"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  type TooltipPayload,
} from "recharts";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/admin/chart-card";
import { SkeletonBlock } from "@/components/admin/skeleton-block";
import {
  Building2,
  Bell,
  Users2,
  ShieldCheck,
  Star,
  Activity,
  LineChart as LineChartIcon,
} from "lucide-react";
import { useApiGet } from "@/lib/api-hooks";
import { useLanguage } from "@/components/providers/language-provider";

// NOTE: Using direct client-only import. Recharts is safe client-side because file is marked "use client".

interface AdminStatsResponse {
  totals?: { total?: number; pending?: number; approved?: number };
  retention?: { unapprovedDays?: number; renewWindowDays?: number };
  schedules?: { moderationCleanupTime?: string; renewalCleanupTime?: string };
  queueStats?: Record<
    string,
    {
      active: number;
      completed: number;
      delayed: number;
      failed: number;
      paused: number;
      prioritized: number;
      waiting: number;
      ["waiting-children"]: number;
    }
  >;
  summary?: {
    totalListings?: number;
    pendingListings?: number;
    approvedListings?: number;
    totalUsers?: number;
    feedbackCount?: number;
    avgRating?: number;
  };
  charts?: {
    listingsDaily?: { date: string; created: number; approved: number }[];
    listingsMonthly?: { month: string; created: number }[];
    usersDaily?: { date: string; registered: number }[];
    feedbackDaily?: {
      date: string;
      feedbackCount: number;
      avgRating: number;
    }[];
    notificationsDaily?: {
      date: string;
      total: number;
      email: number;
      whatsapp: number;
      system: number;
    }[];
    approvalTimeDaily?: { date: string; avgHours: number }[];
    representativesByRegion?: { region: string; count: number }[];
    listingsTypeStatusDaily?: any[];
    listingsTypeStatusWeekly?: any[];
    listingsTypeStatusMonthly?: any[];
    listingsTypeStatusYearly?: any[];
  };
}

// Shared premium chart enhancements
const chartCardBg =
  "bg-gradient-to-br from-[var(--card)] to-[color-mix(in oklab, var(--card) 70%, transparent)]";

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload;
  label?: string | number;
  formatValue?: (value: number, dataKey: string) => string;
  formatName?: (name: string, dataKey: string) => string;
};

function ChartTooltip({
  active,
  payload,
  label,
  formatValue,
  formatName,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const labelText = label != null ? String(label) : null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--popover)]/90 backdrop-blur-sm px-3 py-2 shadow-lg min-w-[140px]">
      {labelText && (
        <p className="app-text-micro font-medium mb-1 text-[var(--foreground)]/80">
          {labelText}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((p) => {
          const dataKey = String(p.dataKey ?? "");
          const colorMap: Record<string, string> = {
            "#2563eb": "bg-[var(--primary)]",
            "#16a34a": "bg-[var(--accent)]",
            "#6366f1": "bg-[var(--secondary)]",
            "#06b6d4": "bg-[var(--accent)]",
            "#10b981": "bg-[var(--accent)]",
            "#f43f5e": "bg-[var(--primary)]",
            "#f59e0b": "bg-[var(--secondary)]",
            "#0ea5e9": "bg-[var(--primary)]",
          };
          const swatch =
            colorMap[String(p.color ?? "")] || "bg-[var(--primary)]";
          const rawName = String(p.name ?? dataKey);
          const displayName = formatName
            ? formatName(rawName, dataKey)
            : rawName;
          const numericValue =
            typeof p.value === "number" ? p.value : Number(p.value);
          const displayValue =
            formatValue && Number.isFinite(numericValue)
              ? formatValue(numericValue, dataKey)
              : typeof p.value === "number"
                ? p.value.toLocaleString()
                : String(p.value ?? "");

          return (
            <div
              key={dataKey}
              className="flex items-center justify-between gap-4 app-text-micro"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`inline-block size-2.5 rounded-sm ${swatch}`}
                />
                <span className="text-[var(--foreground)]/70">
                  {displayName}
                </span>
              </span>
              <span className="tabular-nums font-medium text-[var(--foreground)]">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  // Using external API call assumption: replace URL with real backend endpoint
  const { data, isLoading, error } = useApiGet<AdminStatsResponse>(
    ["admin-stats"],
    "/admin/stats"
  );

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const retention = data?.retention;
  const schedules = data?.schedules;
  const queueStats = data?.queueStats;

  const kpis = [
    {
      title: t("listings") || "Listings",
      icon: Building2,
      value: summary.totalListings ?? data?.totals?.total ?? 0,
      accent: "text-[var(--primary)]",
      iconBg: "bg-[var(--primary)]/10",
      sub: `${data?.totals?.pending ?? 0} pending`,
    },
    {
      title: t("approvedShort") || "Approved",
      icon: ShieldCheck,
      value: summary.approvedListings ?? data?.totals?.approved ?? 0,
      accent: "text-success",
      iconBg: "bg-success/10",
      sub: null,
    },
    {
      title: t("users") || "Users",
      icon: Users2,
      value: summary.totalUsers ?? 0,
      accent: "text-primary",
      iconBg: "bg-primary/10",
      sub: null,
    },
    {
      title: t("feedbacks") || "Feedbacks",
      icon: Star,
      value: summary.feedbackCount ?? 0,
      accent: "text-warning",
      iconBg: "bg-warning/10",
      sub: summary.avgRating ? `Avg ${summary.avgRating}★` : null,
    },
  ];

  return (
    <div className="space-y-8 app-shell-page" data-app-page="admin">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-xl flex items-center gap-3">
          <LineChartIcon className="app-icon-lg text-[var(--primary)]" />
          {t("adminHub") || "Admin Dashboard"}
        </h1>
        {error && (
          <p className="app-text-body text-destructive">
            {(error as any)?.message || "Failed to load stats"}
          </p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div
            key={k.title}
            className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)]/40 bg-[var(--card)]/80 backdrop-blur-xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default"
          >
            {/* shimmer top line */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-overlay-light/20 to-transparent" />
            {/* accent glow */}
            <span className={`pointer-events-none absolute -top-8 -left-4 size-24 rounded-full blur-2xl opacity-20 ${k.iconBg}`} />
            <div className="flex items-start justify-between relative">
              <div className="space-y-1">
                <p className="app-text-micro uppercase tracking-widest font-semibold text-[var(--foreground)]/45">
                  {k.title}
                </p>
                <p className="app-text-h1 font-bold tabular-nums">
                  {isLoading ? <span className="inline-block h-8 w-12 rounded-lg bg-[var(--muted)]/30 animate-pulse" /> : k.value.toLocaleString()}
                </p>
              </div>
              <div className={`size-11 rounded-2xl flex items-center justify-center ${k.iconBg} shadow-sm`}>
                <k.icon className={"app-icon-md " + k.accent} />
              </div>
            </div>
            {k.sub && (
              <p className="app-text-micro text-[var(--foreground)]/40 font-medium relative">
                {k.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Secondary stats redesigned: stacked meta + wide queue stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <Card className="p-5 space-y-3 shadow-sm border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
            <h3 className="app-text-body font-semibold tracking-wide flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-[var(--accent)]" />
              {t("retention")}
            </h3>
            <div className="grid grid-cols-2 gap-3 app-text-caption">
              <div className="rounded-xl border border-[var(--border)]/60 bg-gradient-to-br from-[color-mix(in oklab, var(--accent) 10%, transparent)] to-transparent p-3">
                <p className="subtle app-text-micro uppercase tracking-wide">
                  {t("unapprovedDays")}
                </p>
                <p className="app-text-heading-sm font-semibold tabular-nums">
                  {retention?.unapprovedDays ?? "—"}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)]/60 bg-gradient-to-br from-[color-mix(in oklab, var(--primary) 10%, transparent)] to-transparent p-3">
                <p className="subtle app-text-micro uppercase tracking-wide">
                  {t("renewWindowDays")}
                </p>
                <p className="app-text-heading-sm font-semibold tabular-nums">
                  {retention?.renewWindowDays ?? "—"}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5 space-y-3 shadow-sm border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
            <h3 className="app-text-body font-semibold tracking-wide flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-[var(--secondary)]" />
              {t("schedules")}
            </h3>
            <div className="space-y-2 app-text-caption">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)]/60 px-3 py-2 bg-[var(--muted)]/10">
                <span>{t("moderationCleanupTime")}</span>
                <span className="font-mono tabular-nums">
                  {schedules?.moderationCleanupTime || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)]/60 px-3 py-2 bg-[var(--muted)]/10">
                <span>{t("renewalCleanupTime")}</span>
                <span className="font-mono tabular-nums">
                  {schedules?.renewalCleanupTime || "—"}
                </span>
              </div>
            </div>
          </Card>
        </div>
        <Card className="lg:col-span-2 p-5 space-y-4 overflow-x-auto shadow-md border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="app-text-body font-semibold tracking-wide">
              {t("queueStats")}
            </h3>
            <span className="app-text-micro uppercase tracking-wide text-[var(--foreground)]/50">
              {t("updated")}: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="min-w-[620px] space-y-4">
            {queueStats &&
              Object.entries(queueStats).map(([q, stats]) => (
                <div
                  key={q}
                  className="rounded-2xl border border-[var(--border)]/60 p-4 bg-gradient-to-br from-[color-mix(in oklab, var(--muted) 8%, transparent)] to-transparent hover:from-[color-mix(in oklab, var(--muted) 15%, transparent)] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 app-text-caption mb-3">
                    <span className="font-medium text-[var(--foreground)]/90">
                      {q}
                    </span>
                    <span className="text-[var(--foreground)]/60 flex items-center gap-1">
                      <span className="inline-block size-1.5 rounded-full bg-success" />
                      {t("completed")}: {stats.completed}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 app-text-micro">
                    {[
                      ["active", stats.active],
                      ["waiting", stats.waiting],
                      ["delayed", stats.delayed],
                      ["failed", stats.failed],
                      ["paused", stats.paused],
                      ["prioritized", stats.prioritized],
                      ["waiting-children", stats["waiting-children"]],
                    ].map(([label, v]) => (
                      <div
                        key={label as string}
                        className="rounded-lg border border-[var(--border)]/50 px-2 py-1.5 flex flex-col items-center bg-[var(--background)]/50 backdrop-blur-sm hover:bg-[var(--background)]/70 transition-colors"
                      >
                        <span className="font-mono tabular-nums app-text-micro font-semibold">
                          {v}
                        </span>
                        <span className="uppercase tracking-wide app-text-micro text-[var(--foreground)]/55">
                          {t(label as any) || label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {!queueStats && <p className="app-text-caption subtle">—</p>}
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-[minmax(320px,_1fr)]">
        {/* Listings Type / Status Composite Chart */}
        <ChartCard
          title={(t as any)("listingsTypeStatus")}
          description={(t as any)("listingsTypeStatus")}
          isLoading={isLoading}
          className="xl:col-span-3"
        >
          <ListingsTypeStatusCharts
            charts={charts}
            t={t}
            isLoading={isLoading}
          />
        </ChartCard>
        <ChartCard
          title={t("listings") + " (30d)"}
          description={t("listings")}
          isLoading={isLoading}
          className="xl:col-span-2"
        >
          {!isLoading &&
            charts.listingsDaily &&
            charts.listingsDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.listingsDaily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name={t("created")}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                    name={t("approvedShort")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.listingsDaily || charts.listingsDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("monthlyListings")}
          description={t("monthlyListings")}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.listingsMonthly &&
            charts.listingsMonthly.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.listingsMonthly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Bar dataKey="created" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.listingsMonthly ||
              charts.listingsMonthly.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("users") + " (30d)"}
          description={t("users")}
          isLoading={isLoading}
        >
          {!isLoading && charts.usersDaily && charts.usersDaily.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.usersDaily}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip
                  content={(props) => <ChartTooltip {...props} />}
                  wrapperClassName="chart-tooltip"
                />
                <Bar
                  dataKey="registered"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!isLoading &&
            (!charts.usersDaily || charts.usersDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("approvalTime")}
          description={t("approvalTime")}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.approvalTimeDaily &&
            charts.approvalTimeDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.approvalTimeDaily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgHours"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgHours")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.approvalTimeDaily ||
              charts.approvalTimeDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("feedbacks") + " (30d)"}
          description={t("feedbacks")}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.feedbackDaily &&
            charts.feedbackDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.feedbackDaily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="feedbackCount"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name={t("feedbacks")}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgRating"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgRating") || "Avg Rating"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.feedbackDaily || charts.feedbackDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("notifications") + " (30d)"}
          description={t("notifications")}
          isLoading={isLoading}
          className="xl:col-span-2"
        >
          {!isLoading &&
            charts.notificationsDaily &&
            charts.notificationsDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.notificationsDaily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    name={t("notifications")}
                  />
                  <Line
                    type="monotone"
                    dataKey="email"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("email") || "Email"}
                  />
                  <Line
                    type="monotone"
                    dataKey="whatsapp"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("whatsapp") || "WhatsApp"}
                  />
                  <Line
                    type="monotone"
                    dataKey="system"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("system") || "System"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.notificationsDaily ||
              charts.notificationsDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("approvedShort") + " %"}
          description={t("approvedShort")}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.listingsDaily &&
            charts.listingsDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={charts.listingsDaily.map((d) => ({
                    date: d.date,
                    pct: d.created ? (d.approved / d.created) * 100 : 0,
                  }))}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                    name={t("approvedShort")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.listingsDaily || charts.listingsDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("feedbacks") + " ★"}
          description={t("avgRating") || "Avg Rating"}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.feedbackDaily &&
            charts.feedbackDaily.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.feedbackDaily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgRating"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgRating") || "Avg Rating"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.feedbackDaily || charts.feedbackDaily.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("representatives") || "Representatives"}
          description={t("representatives")}
          isLoading={isLoading}
        >
          {!isLoading &&
            charts.representativesByRegion &&
            charts.representativesByRegion.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Pie
                    data={charts.representativesByRegion}
                    dataKey="count"
                    nameKey="region"
                    outerRadius={110}
                    fill="#0ea5e9"
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          {!isLoading &&
            (!charts.representativesByRegion ||
              charts.representativesByRegion.length === 0) && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>
      </div>
    </div>
  );
}

// Sub-component: ListingsTypeStatusCharts
function ListingsTypeStatusCharts({
  charts,
  t,
  isLoading,
}: {
  charts: any;
  t: (k: any) => string;
  isLoading: boolean;
}) {
  const [mode, setMode] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    "daily"
  );

  const dataset = useMemo(() => {
    switch (mode) {
      case "weekly":
        return charts.listingsTypeStatusWeekly || [];
      case "monthly":
        return charts.listingsTypeStatusMonthly || [];
      case "yearly":
        return charts.listingsTypeStatusYearly || [];
      default:
        return charts.listingsTypeStatusDaily || [];
    }
  }, [charts, mode]);

  // Derive category key based on mode
  const keyField =
    mode === "daily"
      ? "day"
      : mode === "weekly"
        ? "week"
        : mode === "monthly"
          ? "month"
          : "year";

  const statusKeys = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "SOLD",
    "RENTED",
    "EXPIRED",
    "DRAFT",
    "HIDDEN",
  ];

  const colorPalette = {
    PENDING: "#f59e0b",
    APPROVED: "#16a34a",
    REJECTED: "#f43f5e",
    SOLD: "#6366f1",
    RENTED: "#0ea5e9",
    EXPIRED: "#6b7280",
    DRAFT: "#10b981",
    HIDDEN: "#64748b",
  } as Record<string, string>;

  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="mb-4 flex flex-wrap items-center gap-2 app-text-caption">
        {(["daily", "weekly", "monthly", "yearly"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              "px-3 py-1.5 rounded-full border app-text-micro font-medium transition-colors " +
              (mode === m
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)] hover:[background-color:var(--btn-accent-hover-bg,var(--primary))] hover:[color:var(--btn-accent-hover-fg,var(--accent-foreground))]"
                : "bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 border-[var(--border)]")
            }
          >
            {(t as any)(m)}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-[280px]">
        {!isLoading && dataset.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataset}
              stackOffset="expand"
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis dataKey={keyField} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    payload={props.payload}
                    label={props.label}
                    formatValue={(value) => `${(value * 100).toFixed(1)}%`}
                    formatName={(name) => (t as any)(name.toLowerCase()) || name}
                  />
                )}
                wrapperClassName="chart-tooltip"
              />
              {statusKeys.map((k) => (
                <Bar
                  key={k}
                  dataKey={k}
                  stackId="a"
                  fill={colorPalette[k]}
                  name={k}
                  radius={k === "HIDDEN" ? [4, 4, 0, 0] : 0}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 12 }} itemSorter={null} />
            </BarChart>
          </ResponsiveContainer>
        ) : !isLoading && dataset.length === 0 ? (
          <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
            {(t as any)("noData")}
          </p>
        ) : null}
      </div>
      <div className="mt-2 app-text-micro text-[var(--foreground)]/50 flex flex-wrap gap-3">
        {statusKeys.map((k) => {
          const swatch =
            {
              PENDING: "bg-warning",
              APPROVED: "bg-success",
              REJECTED: "bg-destructive",
              SOLD: "bg-primary",
              RENTED: "bg-info",
              EXPIRED: "bg-muted",
              DRAFT: "bg-success",
              HIDDEN: "bg-muted",
            }[k] || "bg-[var(--primary)]";
          return (
            <span key={k} className="flex items-center gap-1">
              <span className={`inline-block size-2 rounded-sm ${swatch}`} />
              {(t as any)(k.toLowerCase()) || k}
            </span>
          );
        })}
      </div>
    </div>
  );
}
