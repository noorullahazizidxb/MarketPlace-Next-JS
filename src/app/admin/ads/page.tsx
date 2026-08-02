"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/atoms/shadcn/dialog";
import { Switch } from "../../../components/ads/switch";
import { PlacementSelect } from "../../../components/ads/placement-select";
import { Plus, Search, Type, FileText, Link2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation, useApiGet } from "@/lib/api-hooks";
import AdCard from "@/components/ads/ad-card";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { TextareaField } from "@/components/ui/atoms/shadcn/textarea";
import { SelectField } from "@/components/ui/atoms/shadcn/SelectField";
import { Button } from "@/components/ui/button";

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
    ...string[],
  ]),
  isActive: z.boolean(),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function AdsManagementPage() {
  const { t } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "inactive"
  >("all");
  const [placementFilter, setPlacementFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);
  const [editingAd, setEditingAd] = React.useState<AdEntity | null>(null);

  const createMutation = useApiMutation<any>("post", "/ads");
  const updateMutation = useApiMutation<any>(
    "put",
    editingAd ? `/ads/${editingAd.id}` : "/ads/0",
  );

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
    },
  );

  const ads = adsData || [];

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

  const statusOptions = [
    { value: "all", label: (t as any)("adsAllStatuses") },
    { value: "active", label: (t as any)("active") },
    { value: "inactive", label: (t as any)("inactive") },
  ];

  const placementOptions = [
    { value: "all", label: (t as any)("adsAllPlacements") },
    ...AD_PLACEMENTS.map((p) => ({
      value: p,
      label: p.replace(/_/g, " "),
    })),
  ];

  return (
    <div className="space-y-[var(--space-section)] app-shell-page" data-app-page="admin-ads">
      <div className="flex flex-col gap-[var(--space-gap)] md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="app-text-heading font-semibold tracking-tight">
            {t("adsManagement")}
          </h1>
          <p className="app-text-body text-muted-foreground mt-1">
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
              type="button"
              variant="primary"
              LeftIcon={Plus}
              onClick={() => {
                setEditingAd(null);
                form.reset();
              }}
            >
              {t("createNewAd")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[var(--border)]/50 bg-[var(--card)]/95 backdrop-blur-2xl shadow-token-lg p-0"
            showCloseButton={false}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-overlay-light/20 to-transparent rounded-t-[2rem]" />
            <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <Plus className="size-4 text-[var(--primary)]" />
                </div>
                <DialogTitle className="app-text-body font-bold">
                  {editingAd ? t("editAd") : t("createNewAd")}
                </DialogTitle>
              </div>
            </div>
            <form
              className="px-6 py-5 space-y-[var(--space-section)]"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <TextInputField
                    label={(t as any)("titleLabel")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={form.formState.errors.title?.message}
                    icon={<Type className="size-4" />}
                    required
                  />
                )}
              />
              <Controller
                name="body"
                control={form.control}
                render={({ field }) => (
                  <TextareaField
                    label={(t as any)("adBodyLabel")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={form.formState.errors.body?.message}
                    icon={<FileText className="size-4" />}
                  />
                )}
              />
              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <TextInputField
                    label={t("imageUrlLabel")}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={form.formState.errors.imageUrl?.message}
                    icon={<Link2 className="size-4" />}
                  />
                )}
              />
              <div className="space-y-1.5">
                <label className="app-text-caption font-semibold text-[var(--foreground)]/60 uppercase tracking-wider">
                  {t("placementLabel")}
                </label>
                <PlacementSelect
                  value={placementValue || AD_PLACEMENTS[0]}
                  onChange={(p: AdPlacement) => form.setValue("placement", p)}
                />
                {form.formState.errors.placement && (
                  <p className="app-text-caption text-destructive">
                    {(form.formState.errors.placement as any).message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)]/40 bg-[var(--muted)]/10 px-4 py-3.5">
                <div className="space-y-0.5">
                  <p className="app-text-body font-semibold">{t("activeLabel")}</p>
                  <p className="app-text-caption text-[var(--foreground)]/45">
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
                  <Button type="button" variant="ghost">
                    {t("cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  loading={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingAd ? t("updateLabel") : t("createNewAd")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-[var(--space-gap)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-[var(--space-gap)] sm:flex-row">
          <div className="relative flex-1">
            <TextInputField
              label={(t as any)("searchAdsPlaceholder")}
              aria-label={(t as any)("search")}
              value={query}
              onChange={setQuery}
              icon={<Search className="size-4" />}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="min-w-[160px]">
              <SelectField
                label="Status"
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(v) =>
                  setStatusFilter(v as "all" | "active" | "inactive")
                }
                options={statusOptions}
                placeholder={(t as any)("adsAllStatuses")}
              />
            </div>
            <div className="min-w-[180px]">
              <SelectField
                label={t("placementLabel")}
                aria-label="Filter by placement"
                value={placementFilter}
                onChange={setPlacementFilter}
                options={placementOptions}
                placeholder={(t as any)("adsAllPlacements")}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="flex items-center gap-2 app-text-body text-muted-foreground">
            {t("loadingAds")}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="app-text-body text-muted-foreground"
          >
            {t("noAdsMatchFilters")}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-[var(--space-section)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
