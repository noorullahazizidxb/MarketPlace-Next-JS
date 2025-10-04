"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "../../../components/ads/switch"; // relative to avoid path alias issues
import { PlacementSelect } from "../../../components/ads/placement-select";
import { Plus, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation, useApiGet } from "@/lib/api-hooks";
import AdCard from "@/components/ads/ad-card";

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
            <Button
              LeftIcon={Plus}
              variant="accent"
              onClick={() => {
                setEditingAd(null);
                form.reset();
              }}
            >
              {t("createNewAd")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingAd ? t("editAd") : t("createNewAd")}
            </h2>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  {(t as any)("titleLabel")}
                </label>
                <Input
                  id="title"
                  placeholder={(t as any)("adTitlePlaceholder")}
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="body">
                  {(t as any)("adBodyLabel")}
                </label>
                <textarea
                  id="body"
                  className="min-h-[120px] w-full rounded-2xl bg-input/20 border border-white/10 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                  placeholder={t("optionalSupportingText")}
                  {...form.register("body")}
                />
                {form.formState.errors.body && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.body.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="imageUrl">
                  {t("imageUrlLabel")}
                </label>
                <Input
                  id="imageUrl"
                  placeholder="https://..."
                  {...form.register("imageUrl")}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("placementLabel")}
                </label>
                <PlacementSelect
                  value={form.watch("placement")}
                  onChange={(p: AdPlacement) => form.setValue("placement", p)}
                />
                {form.formState.errors.placement && (
                  <p className="text-xs text-red-400">
                    {(form.formState.errors.placement as any).message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{t("activeLabel")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("activeHint")}
                  </p>
                </div>
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(v: boolean) => form.setValue("isActive", v)}
                  aria-label="Ad Active"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    {t("cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : editingAd ? (
                    t("updateLabel")
                  ) : (
                    t("createNewAd")
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              aria-label={(t as any)("search")}
              placeholder={(t as any)("searchAdsPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-2xl bg-input/20 border border-white/10 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">{(t as any)("adsAllStatuses")}</option>
              <option value="active">{(t as any)("active")}</option>
              <option value="inactive">{(t as any)("inactive")}</option>
            </select>
            <select
              aria-label="Filter by placement"
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="h-10 rounded-2xl bg-input/20 border border-white/10 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 min-w-[180px]"
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
