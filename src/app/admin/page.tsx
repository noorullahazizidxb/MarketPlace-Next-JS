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
  Cell,
  type TooltipPayload,
} from "recharts";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/molecules/card";
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
    listings?: PeriodMap<{ period: string; created: number; approved: number }>;
    users?: PeriodMap<{ period: string; registered: number }>;
    feedback?: PeriodMap<{
      period: string;
      feedbackCount: number;
      avgRating: number;
    }>;
    notifications?: PeriodMap<{
      period: string;
      total: number;
      email: number;
      whatsapp: number;
      system: number;
    }>;
    approvalTime?: PeriodMap<{ period: string; avgHours: number }>;
    representativesByRegion?: PeriodMap<{ region: string; count: number }>;
    listingsTypeStatus?: PeriodMap<any>;
    listingsDaily?: { date: string; created: number; approved: number }[];
    listingsMonthly?: { month: string; created: number }[];
    listingsTypeStatusDaily?: any[];
    listingsTypeStatusWeekly?: any[];
    listingsTypeStatusMonthly?: any[];
    listingsTypeStatusYearly?: any[];
  };
}

const CHART_RANGES = ["daily", "weekly", "monthly", "yearly"] as const;
type ChartRange = (typeof CHART_RANGES)[number];
type PeriodMap<T> = Partial<Record<ChartRange, T[]>>;

function periodRows<T>(map: PeriodMap<T> | undefined, range: ChartRange): T[] {
  const rows = map?.[range];
  return Array.isArray(rows) ? rows : [];
}

// Shared premium chart enhancements
const chartCardBg =
  "bg-gradient-to-br from-[var(--card)] to-[color-mix(in oklab, var(--card) 70%, transparent)]";

const CHART_SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

function chartSeriesColor(index: number) {
  const token = CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
  const cycle = Math.floor(index / CHART_SERIES_COLORS.length);
  if (cycle === 0) return token;
  const mix = cycle === 1 ? 62 : 40;
  return `color-mix(in oklab, ${token} ${mix}%, var(--foreground))`;
}

function ChartRangeToggle({
  value,
  onChange,
  t,
}: {
  value: ChartRange;
  onChange: (range: ChartRange) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1">
      {CHART_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={
            "px-2.5 py-1 rounded-full border app-text-micro font-medium transition-colors " +
            (value === range
              ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-[var(--border)]"
              : "bg-[var(--muted)]/20 hover:bg-[var(--muted)]/30 border-[var(--border)]")
          }
        >
          {(t as (key: string) => string)(range) || range}
        </button>
      ))}
    </div>
  );
}

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
          const seriesColor = String(
            p.color ?? (p as { fill?: string }).fill ?? "var(--chart-1)",
          );
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
              key={`${dataKey}-${rawName}`}
              className="flex items-center justify-between gap-[var(--space-gap)] app-text-micro"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2.5 rounded-sm"
                  style={{ background: seriesColor }}
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
  const [typeStatusRange, setTypeStatusRange] = useState<ChartRange>("daily");
  const [listingsRange, setListingsRange] = useState<ChartRange>("daily");
  const [monthlyListingsRange, setMonthlyListingsRange] =
    useState<ChartRange>("monthly");
  const [usersRange, setUsersRange] = useState<ChartRange>("daily");
  const [approvalRange, setApprovalRange] = useState<ChartRange>("daily");
  const [feedbackRange, setFeedbackRange] = useState<ChartRange>("daily");
  const [notificationsRange, setNotificationsRange] =
    useState<ChartRange>("daily");
  const [approvedPercentRange, setApprovedPercentRange] =
    useState<ChartRange>("daily");
  const [ratingRange, setRatingRange] = useState<ChartRange>("daily");
  const [representativesRange, setRepresentativesRange] =
    useState<ChartRange>("daily");
  const listingsSeries = periodRows(charts.listings, listingsRange);
  const monthlyListingsSeries = periodRows(charts.listings, monthlyListingsRange);
  const usersSeries = periodRows(charts.users, usersRange);
  const approvalSeries = periodRows(charts.approvalTime, approvalRange);
  const feedbackSeries = periodRows(charts.feedback, feedbackRange);
  const notificationsSeries = periodRows(charts.notifications, notificationsRange);
  const approvedPercentSeries = periodRows(charts.listings, approvedPercentRange).map(
    (point) => ({
      period: point.period,
      approvedPct: point.created
        ? Math.round((point.approved / point.created) * 100)
        : 0,
    })
  );
  const ratingSeries = periodRows(charts.feedback, ratingRange);
  const representativeSeries = periodRows(
    charts.representativesByRegion,
    representativesRange
  );
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
    <div className="space-y-[var(--space-section)] app-shell-page" data-app-page="admin">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-gap)]">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[var(--space-gap)]">
        {kpis.map((k, i) => (
          <div
            key={k.title}
            className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)]/40 bg-[var(--card)]/80 backdrop-blur-xl p-[var(--space-card)] flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-section)] items-start">
        <div className="space-y-[var(--space-section)]">
          <Card className="p-[var(--space-card)] space-y-3 shadow-sm border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
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
          <Card className="p-[var(--space-card)] space-y-3 shadow-sm border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
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
        <Card className="lg:col-span-2 p-[var(--space-card)] space-y-[var(--space-gap)] overflow-x-auto shadow-md border border-[var(--border)]/60 bg-[var(--card)]/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="app-text-body font-semibold tracking-wide">
              {t("queueStats")}
            </h3>
            <span className="app-text-micro uppercase tracking-wide text-[var(--foreground)]/50">
              {t("updated")}: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="min-w-[620px] space-y-[var(--space-gap)]">
            {queueStats &&
              Object.entries(queueStats).map(([q, stats]) => {
                const countOf = (value: unknown) =>
                  typeof value === "number" && Number.isFinite(value) ? value : 0;
                const hasCounts = [
                  "active",
                  "waiting",
                  "completed",
                  "failed",
                  "delayed",
                ].some((key) => typeof (stats as Record<string, unknown>)[key] === "number");
                return (
                <div
                  key={q}
                  className="rounded-2xl border border-[var(--border)]/60 p-[var(--space-card)] bg-gradient-to-br from-[color-mix(in oklab, var(--muted) 8%, transparent)] to-transparent hover:from-[color-mix(in oklab, var(--muted) 15%, transparent)] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 app-text-caption mb-3">
                    <span className="font-medium text-[var(--foreground)]/90">
                      {q}
                    </span>
                    <span className="text-[var(--foreground)]/60 flex items-center gap-1">
                      <span className={`inline-block size-1.5 rounded-full ${hasCounts ? "bg-success" : "bg-[var(--muted-foreground)]"}`} />
                      {hasCounts
                        ? `${t("completed")}: ${countOf(stats.completed)}`
                        : (t("unavailable") && t("unavailable") !== "unavailable"
                            ? t("unavailable")
                            : "Unavailable")}
                    </span>
                  </div>
                  {hasCounts ? (
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 app-text-micro">
                    {[
                      ["active", countOf(stats.active)],
                      ["waiting", countOf(stats.waiting)],
                      ["delayed", countOf(stats.delayed)],
                      ["failed", countOf(stats.failed)],
                      ["paused", countOf(stats.paused)],
                      ["prioritized", countOf(stats.prioritized)],
                      ["waiting-children", countOf(stats["waiting-children"])],
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
                  ) : null}
                </div>
                );
              })}
            {!queueStats && <p className="app-text-caption subtle">—</p>}
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[var(--space-section)] auto-rows-[minmax(320px,_1fr)]">
        <ChartCard
          title={(t as any)("listingsTypeStatus")}
          description={(t as any)("listingsTypeStatus")}
          action={
            <ChartRangeToggle
              value={typeStatusRange}
              onChange={setTypeStatusRange}
              t={t}
            />
          }
          isLoading={isLoading}
          className="xl:col-span-3"
          plotClassName="h-[360px]"
        >
          <ListingsTypeStatusCharts
            charts={charts}
            mode={typeStatusRange}
            t={t}
            isLoading={isLoading}
          />
        </ChartCard>
        <ChartCard
          title={t("listings")}
          description={t("listings")}
          action={
            <ChartRangeToggle
              value={listingsRange}
              onChange={setListingsRange}
              t={t}
            />
          }
          isLoading={isLoading}
          className="xl:col-span-2"
        >
          {!isLoading && listingsSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={listingsSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={listingsRange === "daily"} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={false}
                    name={t("created")}
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                    name={t("approvedShort")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && listingsSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("monthlyListings")}
          description={t("monthlyListings")}
          action={
            <ChartRangeToggle
              value={monthlyListingsRange}
              onChange={setMonthlyListingsRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && monthlyListingsSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyListingsSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={monthlyListingsRange === "daily"} />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Bar dataKey="created" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          {!isLoading && monthlyListingsSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("users")}
          description={t("users")}
          action={
            <ChartRangeToggle
              value={usersRange}
              onChange={setUsersRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && usersSeries.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersSeries}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis dataKey="period" hide={usersRange === "daily"} />
                <YAxis />
                <Tooltip
                  content={(props) => <ChartTooltip {...props} />}
                  wrapperClassName="chart-tooltip"
                />
                <Bar
                  dataKey="registered"
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!isLoading && usersSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("approvalTime")}
          description={t("approvalTime")}
          action={
            <ChartRangeToggle
              value={approvalRange}
              onChange={setApprovalRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && approvalSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={approvalSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={approvalRange === "daily"} />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgHours"
                    stroke="var(--info)"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgHours")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && approvalSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("feedbacks")}
          description={t("feedbacks")}
          action={
            <ChartRangeToggle
              value={feedbackRange}
              onChange={setFeedbackRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && feedbackSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feedbackSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={feedbackRange === "daily"} />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="feedbackCount"
                    stroke="var(--warning)"
                    strokeWidth={2}
                    dot={false}
                    name={t("feedbacks")}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgRating"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgRating") || "Avg Rating"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && feedbackSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("notifications")}
          description={t("notifications")}
          action={
            <ChartRangeToggle
              value={notificationsRange}
              onChange={setNotificationsRange}
              t={t}
            />
          }
          isLoading={isLoading}
          className="xl:col-span-2"
        >
          {!isLoading && notificationsSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={notificationsSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={notificationsRange === "daily"} />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    dot={false}
                    name={t("notifications")}
                  />
                  <Line
                    type="monotone"
                    dataKey="email"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("email") || "Email"}
                  />
                  <Line
                    type="monotone"
                    dataKey="whatsapp"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("whatsapp") || "WhatsApp"}
                  />
                  <Line
                    type="monotone"
                    dataKey="system"
                    stroke="var(--destructive)"
                    strokeWidth={2}
                    dot={false}
                    name={(t as any)("system") || "System"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && notificationsSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("approvedShort") + " %"}
          description={t("approvedShort")}
          action={
            <ChartRangeToggle
              value={approvedPercentRange}
              onChange={setApprovedPercentRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && approvedPercentSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={approvedPercentSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={approvedPercentRange === "daily"} />
                  <YAxis />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="approvedPct"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    dot={false}
                    name={t("approvedShort")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && approvedPercentSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("feedbacks") + " ★"}
          description={t("avgRating") || "Avg Rating"}
          action={
            <ChartRangeToggle
              value={ratingRange}
              onChange={setRatingRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && ratingSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis dataKey="period" hide={ratingRange === "daily"} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgRating"
                    stroke="var(--warning)"
                    strokeWidth={2}
                    dot={false}
                    name={t("avgRating") || "Avg Rating"}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          {!isLoading && ratingSeries.length === 0 && (
              <p className="app-text-caption text-center mt-4 text-[var(--foreground)]/60">
                {t("noData")}
              </p>
            )}
        </ChartCard>

        <ChartCard
          title={t("representatives") || "Representatives"}
          description={t("representatives")}
          action={
            <ChartRangeToggle
              value={representativesRange}
              onChange={setRepresentativesRange}
              t={t}
            />
          }
          isLoading={isLoading}
        >
          {!isLoading && representativeSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={(props) => <ChartTooltip {...props} />}
                    wrapperClassName="chart-tooltip"
                  />
                  <Pie
                    data={representativeSeries}
                    dataKey="count"
                    nameKey="region"
                    outerRadius={88}
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    {representativeSeries.map((entry, index) => (
                      <Cell
                        key={entry.region || index}
                        fill={chartSeriesColor(index)}
                      />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          {!isLoading && representativeSeries.length === 0 && (
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
  mode,
  t,
  isLoading,
}: {
  charts: AdminStatsResponse["charts"];
  mode: ChartRange;
  t: (k: any) => string;
  isLoading: boolean;
}) {
  const dataset = useMemo(() => {
    const grouped = charts?.listingsTypeStatus?.[mode];
    if (Array.isArray(grouped)) return grouped;
    const legacy = {
      daily: charts?.listingsTypeStatusDaily,
      weekly: charts?.listingsTypeStatusWeekly,
      monthly: charts?.listingsTypeStatusMonthly,
      yearly: charts?.listingsTypeStatusYearly,
    }[mode];
    return Array.isArray(legacy) ? legacy : [];
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

  const colorPalette: Record<string, string> = {
    PENDING: "var(--warning)",
    APPROVED: "var(--success)",
    REJECTED: "var(--destructive)",
    SOLD: "var(--chart-1)",
    RENTED: "var(--info)",
    EXPIRED: "var(--chart-5)",
    DRAFT: "var(--chart-4)",
    HIDDEN: "var(--chart-3)",
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
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
        {statusKeys.map((k) => (
            <span key={k} className="flex items-center gap-1">
              <span
                className="inline-block size-2 rounded-sm"
                style={{ background: colorPalette[k] }}
              />
              {(t as any)(k.toLowerCase()) || k}
            </span>
          ))}
      </div>
    </div>
  );
}
