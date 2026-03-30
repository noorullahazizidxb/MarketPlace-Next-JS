"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "../../../components/ads/switch"; // relative to avoid path alias issues
import { PlacementSelect } from "../../../components/ads/placement-select";
import { Plus, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation, useApiGet } from "@/lib/api-hooks";
import AdCard from "@/components/ads/ad-card";
import { Tooltip } from "@/components/ui/tooltip";

// Enum list derived from Prisma model
const AD_PLACEMENTS = [
  "HOME_PAGE_1ST",
  "HOME_PAGE_2ND",
  "HOME_PAGE_3RD",
  "DETAIL_PAGE_1ST",
  "DETAIL_PAGE_2ND",
  "DETAIL_PAGE_SIDEBAR",
] as const;

type AdPlacement = (typeof AD_PLACEMENTS)[number];

interface AdEntity {
  id: number;
  title: string;
  body?: string | null;
  imageUrl?: string | null;
  placement: AdPlacement;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Schema for create/edit dialog
const adSchema = z.object({
  title: z.string().min(3, "Title too short"),
  body: z.string().max(800).optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  placement: z.enum([AD_PLACEMENTS[0], ...AD_PLACEMENTS.slice(1)] as [
    string,
    ...string[]
  ]),
  isActive: z.boolean(),
});

type AdFormValues = z.infer<typeof adSchema>;

// Relative time utility
function timeAgo(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString();
}

export default function AdsManagementPage() {
  const { t } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "inactive"
  >("all");
  const [placementFilter, setPlacementFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);
  const [editingAd, setEditingAd] = React.useState<AdEntity | null>(null);

  // Create & update mutations
  const createMutation = useApiMutation<any>("post", "/ads");
  const updateMutation = useApiMutation<any>(
    "put",
    editingAd ? `/ads/${editingAd.id}` : "/ads/0"
  ); // url will be ignored if not used

  // Fetch list of ads (placeholder endpoint — adapt to your backend)
  const {
    data: adsData,
    isLoading,
    mutate,
  } = useApiGet<AdEntity[] | undefined>(
    ["ads", query, statusFilter, placementFilter],
    "/ads",
    {
      q: query || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      placement: placementFilter !== "all" ? placementFilter : undefined,
    }
  );

  const ads = adsData || [];

  // Note: per-ad mutations (PUT/PATCH/DELETE) are handled in the AdCard component below

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      body: "",
      imageUrl: "",
      placement: AD_PLACEMENTS[0],
      isActive: true,
    },
  });
  const placementValue = useWatch({
    control: form.control,
    name: "placement",
  });
  const isActiveValue = useWatch({
    control: form.control,
    name: "isActive",
  });

  const onSubmit = async (values: AdFormValues) => {
    if (editingAd) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    mutate();
    setOpen(false);
    setEditingAd(null);
    form.reset();
  };

  const filtered = ads.filter((ad) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      ad.title.toLowerCase().includes(q) ||
      ad.placement.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && ad.isActive) ||
      (statusFilter === "inactive" && !ad.isActive);
    const matchesPlacement =
      placementFilter === "all" || ad.placement === placementFilter;
    return matchesQuery && matchesStatus && matchesPlacement;
  });

  // inline AdCard removed — using external component imported above

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("adsManagement")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("adsManagementSubtitle")}
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            if (!o) {
              setEditingAd(null);
              form.reset();
            }
            setOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={() => {
                setEditingAd(null);
                form.reset();
              }}
              className="h-10 px-4 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 transition-all relative overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <Plus className="size-4" />
              {t("createNewAd")}
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/95 backdrop-blur-2xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.35)] p-0">
            {/* shimmer top line */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-[2rem]" />
            <div className="px-6 pt-6 pb-4 border-b border-[hsl(var(--border))]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                  <Plus className="size-4 text-[hsl(var(--primary))]" />
                </div>
                <DialogTitle className="text-base font-bold">
                  {editingAd ? t("editAd") : t("createNewAd")}
                </DialogTitle>
              </div>
              <Tooltip content="Close" side="bottom">
                <DialogClose aria-label="Close" className="size-8 rounded-xl flex items-center justify-center text-[hsl(var(--foreground))]/40 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/20 transition-colors">
                  <span className="sr-only">Close</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </DialogClose>
              </Tooltip>
            </div>
            <form className="px-6 py-5 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))]/60 uppercase tracking-wider" htmlFor="title">
                  {(t as any)("titleLabel")}
                </label>
                <input
                  id="title"
                  placeholder={(t as any)("adTitlePlaceholder")}
                  {...form.register("title")}
                  className="h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))]/60 uppercase tracking-wider" htmlFor="body">
                  {(t as any)("adBodyLabel")}
                </label>
                <textarea
                  id="body"
                  className="w-full min-h-[100px] rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30 resize-none"
                  placeholder={t("optionalSupportingText")}
                  {...form.register("body")}
                />
                {form.formState.errors.body && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.body.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))]/60 uppercase tracking-wider" htmlFor="imageUrl">
                  {t("imageUrlLabel")}
                </label>
                <input
                  id="imageUrl"
                  placeholder="https://..."
                  {...form.register("imageUrl")}
                  className="h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[hsl(var(--foreground))]/60 uppercase tracking-wider">
                  {t("placementLabel")}
                </label>
                <PlacementSelect
                  value={placementValue || AD_PLACEMENTS[0]}
                  onChange={(p: AdPlacement) => form.setValue("placement", p)}
                />
                {form.formState.errors.placement && (
                  <p className="text-xs text-red-400">
                    {(form.formState.errors.placement as any).message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--muted))]/10 px-4 py-3.5">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{t("activeLabel")}</p>
                  <p className="text-xs text-[hsl(var(--foreground))]/45">
                    {t("activeHint")}
                  </p>
                </div>
                <Switch
                  checked={!!isActiveValue}
                  onCheckedChange={(v: boolean) => form.setValue("isActive", v)}
                  aria-label="Ad Active"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 pb-1">
                <DialogClose asChild>
                  <button type="button" className="h-10 px-4 rounded-2xl text-sm font-medium text-[hsl(var(--foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/20 transition-colors">
                    {t("cancel")}
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="h-10 px-5 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : editingAd ? (
                    t("updateLabel")
                  ) : (
                    t("createNewAd")
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(var(--foreground))]/40" />
            <input
              aria-label={(t as any)("search")}
              placeholder={(t as any)("searchAdsPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/70 backdrop-blur-sm pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all placeholder:text-[hsl(var(--foreground))]/30"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all"
            >
              <option value="all">{(t as any)("adsAllStatuses")}</option>
              <option value="active">{(t as any)("active")}</option>
              <option value="inactive">{(t as any)("inactive")}</option>
            </select>
            <select
              aria-label="Filter by placement"
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="h-10 rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all min-w-[180px]"
            >
              <option value="all">{(t as any)("adsAllPlacements")}</option>
              {AD_PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {p.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t("loadingAds")}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            {t("noAdsMatchFilters")}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((ad) => (
              <motion.div
                key={ad.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "anticipate" }}
              >
                <AdCard
                  ad={ad}
                  onUpdated={() => mutate?.()}
                  onEdit={(ad) => {
                    setEditingAd(ad);
                    form.reset({
                      title: ad.title,
                      body: ad.body || "",
                      imageUrl: ad.imageUrl || "",
                      placement: ad.placement as AdPlacement,
                      isActive: ad.isActive,
                    });
                    setOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
