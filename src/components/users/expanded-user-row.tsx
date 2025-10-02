"use client";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  ClipboardList,
  Bell,
  FileText,
  MessageSquare,
  Search as SearchIcon,
  Link2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { BaseUser, RepProvince, emptyRepProvince } from "./types";
import { Portal } from "../portal";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { useApiMutation } from "@/lib/api-hooks";
import { toastError, toastSuccess } from "@/lib/toast";

interface BindModalProps {
  user: BaseUser;
  onClose: () => void;
}

const BindRepresentativeModal: React.FC<BindModalProps> = ({
  user,
  onClose,
}) => {
  const [rows, setRows] = useState<RepProvince[]>([emptyRepProvince()]);
  const bindMutation = useApiMutation<any>("post", "/representatives/bind");

  const update = (index: number, patch: Partial<RepProvince>) => {
    setRows((r) =>
      r.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const addRow = () => setRows((r) => [...r, emptyRepProvince()]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length > 1 ? r.filter((_, i) => i !== idx) : r));

  const canSubmit = rows.some((r) => r.region && r.whatsappNumber);

  const submit = async () => {
    if (!canSubmit) return;
    const representativeInfo = rows.filter((r) => r.region && r.whatsappNumber);
    try {
      await bindMutation.mutateAsync({ userId: user.id, representativeInfo });
      toastSuccess("Representative bound successfully");
      onClose();
    } catch (e: any) {
      toastError(e?.message || "Bind failed");
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[500] flex items-start justify-center p-4 sm:p-8">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-xl bg-[hsl(var(--card))] border rounded-2xl shadow-xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[hsl(var(--accent))/0.15] text-[hsl(var(--accent))] grid place-items-center">
              <Link2 className="size-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                Bind Representative Regions
              </h3>
              <p className="text-2xs subtle break-all">
                User: {user.fullName || user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              title="Close"
              className="size-8 rounded-xl inline-flex items-center justify-center border hover:bg-[hsl(var(--muted))/0.5]"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-xl border p-4 bg-[hsl(var(--muted))/0.35]"
              >
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-2xs font-medium">Region *</span>
                  <input
                    value={row.region}
                    onChange={(e) => update(i, { region: e.target.value })}
                    placeholder="Region"
                    className="h-10 rounded-lg border bg-[hsl(var(--card))] px-3 text-xs"
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-2xs font-medium">WhatsApp *</span>
                  <input
                    value={row.whatsappNumber}
                    onChange={(e) =>
                      update(i, { whatsappNumber: e.target.value })
                    }
                    placeholder="+93..."
                    className="h-10 rounded-lg border bg-[hsl(var(--card))] px-3 text-xs"
                  />
                </label>
                <div className="flex items-end justify-between gap-2 sm:col-span-1">
                  <label className="flex items-center gap-2 text-2xs font-medium">
                    <input
                      type="checkbox"
                      checked={row.active}
                      onChange={(e) => update(i, { active: e.target.checked })}
                      className="size-4 rounded border"
                    />
                    Active
                  </label>
                  {rows.length > 1 && (
                    <button
                      aria-label="Remove row"
                      title="Remove row"
                      type="button"
                      onClick={() => removeRow(i)}
                      className="size-8 rounded-lg border inline-flex items-center justify-center hover:bg-red-500/10 hover:border-red-400 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="h-9 px-3 inline-flex items-center gap-2 rounded-lg border bg-[hsl(var(--muted))/0.3] hover:bg-[hsl(var(--muted))/0.5] text-2xs font-medium"
            >
              <Plus className="size-4" /> Add Row
            </button>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border text-2xs font-medium hover:bg-[hsl(var(--muted))/0.5]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit || bindMutation.isPending}
              onClick={submit}
              className={cn(
                "h-9 px-4 rounded-lg text-2xs font-semibold inline-flex items-center gap-2 transition-colors",
                !canSubmit || bindMutation.isPending
                  ? "bg-[hsl(var(--muted))] text-foreground/50"
                  : "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:brightness-110"
              )}
            >
              {bindMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Bind
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

interface SectionDef {
  key: string;
  label: string;
  icon: React.ReactNode;
  data: any[];
  columns: string[];
}

const sectionsFor = (user: BaseUser): SectionDef[] => [
  {
    key: "listings",
    label: "Listings",
    icon: <ClipboardList className="size-4" />,
    data: user.listings || [],
    columns: [
      "id",
      "title",
      "listingType",
      "contactVisibility",
      "status",
      "createdAt",
      "images",
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <Bell className="size-4" />,
    data: user.notifications || [],
    columns: ["id", "title", "message", "channel", "targetType", "createdAt"],
  },
  {
    key: "auditLogs",
    label: "Audit Logs",
    icon: <FileText className="size-4" />,
    data: user.auditLogs || [],
    columns: ["id", "action", "createdAt"],
  },
  {
    key: "feedbacks",
    label: "Feedbacks",
    icon: <MessageSquare className="size-4" />,
    data: user.feedbacks || [],
    columns: ["id", "statusAfter", "comment", "rating", "createdAt"],
  },
];

const ExpandedUserRow: React.FC<{ user: BaseUser }> = ({ user }) => {
  const sections = sectionsFor(user);
  const [active, setActive] = useState(sections[0]?.key || "listings");
  const [subQuery, setSubQuery] = useState("");

  const activeSection = sections.find((s) => s.key === active)!;
  const filteredData = useMemo(() => {
    const q = subQuery.toLowerCase().trim();
    if (!q) return activeSection.data;
    return (activeSection.data || []).filter((row: any) =>
      Object.values(row || {})
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [subQuery, activeSection]);

  const [showBind, setShowBind] = useState(false);

  return (
    <div className="px-4 pb-6 pt-4 bg-[hsl(var(--card))]/70 backdrop-blur rounded-b-2xl border-t border-[hsl(var(--border))]">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={cn(
              "px-3 h-9 rounded-xl text-xs font-medium inline-flex items-center gap-1 border transition-colors",
              active === s.key
                ? "bg-[hsl(var(--accent))/0.15] border-[hsl(var(--accent))] text-[hsl(var(--accent))]"
                : "bg-[hsl(var(--muted))/0.4] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))/0.6]"
            )}
          >
            {s.icon}
            {s.label} ({s.data.length})
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowBind(true)}
            className="h-9 px-3 rounded-xl inline-flex items-center gap-2 text-xs font-medium bg-[hsl(var(--accent))/0.15] text-[hsl(var(--accent))] border border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/0.25] transition-colors"
          >
            <Link2 className="size-4" /> Bind Rep
          </button>
          <div className="relative">
            <input
              value={subQuery}
              onChange={(e) => setSubQuery(e.target.value)}
              placeholder={`Search ${activeSection.label.toLowerCase()}…`}
              className="h-9 rounded-xl border bg-[hsl(var(--card))] pl-3 pr-9 text-xs w-56"
            />
            <SearchIcon className="size-3 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto touch-scroll rounded-xl border">
        <table className="w-full min-w-[640px] text-xs">
          <thead className="bg-[hsl(var(--muted))/0.4] border-b">
            <tr>
              {activeSection.columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 capitalize whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={activeSection.columns.length}
                  className="px-4 py-6 text-center subtle"
                >
                  No records
                </td>
              </tr>
            )}
            {filteredData.map((row: any, i: number) => (
              <tr
                key={row.id || i}
                className="border-b last:border-b-0 hover:bg-[hsl(var(--muted))/0.3] transition-colors"
              >
                {activeSection.columns.map((c) => {
                  let content: React.ReactNode = String(row[c] ?? "—");
                  // Special handling for listings images
                  if (activeSection.key === "listings" && c === "images") {
                    const imgs = (row.images || []).slice(0, 2);
                    content = (
                      <div className="flex gap-1">
                        {imgs.map((im: any) => (
                          <div
                            key={im.id}
                            className="size-8 rounded-md overflow-hidden border"
                          >
                            <Image
                              src={asset(im.url)}
                              alt={im.alt || "img"}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                        {row.images && row.images.length > 2 && (
                          <span className="text-2xs px-1 rounded bg-[hsl(var(--muted))/0.5]">
                            +{row.images.length - 2}
                          </span>
                        )}
                      </div>
                    );
                  }
                  // Notifications: surface nested notification title & message
                  if (activeSection.key === "notifications") {
                    if (c === "title") content = row.notification?.title || "—";
                    if (c === "message")
                      content = row.notification?.message || "—";
                    if (c === "targetType")
                      content = row.notification?.targetType || "—";
                    if (c === "channel")
                      content = row.notification?.channel || "—";
                    if (c === "createdAt")
                      content = row.notification?.createdAt || "—";
                  }

                  return (
                    <td
                      key={c}
                      className="px-3 py-2 align-top whitespace-nowrap max-w-[260px] truncate"
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {user.representatives && user.representatives.length > 0 && (
        <div className="mt-4 rounded-xl border p-4 space-y-3">
          <div className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
            Representative Regions
          </div>
          <div className="flex flex-wrap gap-2">
            {user.representatives.map((p, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-2xs bg-[hsl(var(--muted))/0.4] border border-[hsl(var(--border))]"
              >
                {p.region} · {p.whatsappNumber}
              </span>
            ))}
          </div>
        </div>
      )}
      {showBind && (
        <BindRepresentativeModal
          user={user}
          onClose={() => setShowBind(false)}
        />
      )}
    </div>
  );
};

export default ExpandedUserRow;
