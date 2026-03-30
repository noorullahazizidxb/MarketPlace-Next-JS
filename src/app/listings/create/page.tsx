"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { useAuthStore } from "@/store/auth.store";
import { useListingsStore } from "@/store/listings.store";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  Type as TypeIcon,
  FileText,
  DollarSign,
  Coins,
  MapPin,
  Home,
  ChevronDown,
  Check,
  ArrowLeft,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";
import { asset } from "@/lib/assets";
import { useLanguage } from "@/components/providers/language-provider";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  listingType: z.enum(["RENT", "SALE"]),
  price: z.coerce.number().positive(),
  currency: z.enum(["USD", "AFG", "EUR"]).default("AFG"),
  location: z.string().min(2),
  address: z
    .string()
    .optional()
    .transform((v) => v ?? ""),
  categoryId: z.coerce.number().int().positive(),
  // images is optional here; we validate presence at runtime so edits that keep existing images pass
  images: z.any().optional(),
});

type FormData = z.infer<typeof schema>;
type ExistingImage = { id?: string; url: string };

export default function CreateListingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { t } = useLanguage();
  const [pickedType, setPickedType] = useState<"RENT" | "SALE" | null>(null);
  const [pickedCategory, setPickedCategory] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagesPreview, setImagesPreview] = useState<File[]>([]);
  const [imagesLocalError, setImagesLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: categories } = useApiGet<any>(["categories"], "/categories");
  const cats: { id: number; name: string }[] = Array.isArray(categories)
    ? categories
    : categories
      ? [categories]
      : [];

  // Fetch representatives to populate location regions
  const { data: reps } = useApiGet<any>(
    ["representatives"],
    "/representatives"
  );
  const regions: string[] = useMemo(() => {
    const items = Array.isArray(reps) ? reps : reps?.data ?? [];
    if (!Array.isArray(items)) return [];
    const set = new Set<string>();
    items.forEach((r: any) => {
      const region = r?.region;
      if (region) set.add(region);
    });
    return Array.from(set).sort();
  }, [reps]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  const createListing = useApiMutation<any>("post", "/listings");
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const editListingFetch = useApiGet<any>(
    editId ? ["listing-edit", editId] : null,
    editId ? `/listings/${editId}` : ""
  );
  const editListingMutation = useApiMutation<any>(
    "patch",
    editId ? `/listings/${editId}` : "/listings/0"
  );

  const [removedExisting, setRemovedExisting] = useState<string[]>([]);
  const initialExistingImages = useMemo<ExistingImage[]>(() => {
    if (!editId) return [];
    const d = editListingFetch.data;
    const L = Array.isArray(d) ? d[0] : d;
    const imgs: ExistingImage[] = Array.isArray(L?.images)
      ? L.images.map((i: any) => ({
        id: i?.id != null ? String(i.id) : i?.key != null ? String(i.key) : undefined,
        url: i?.url ?? i,
      }))
      : [];
    return imgs.filter((x: any) => x?.url);
  }, [editId, editListingFetch.data]);

  const existingImages = useMemo(() => {
    return initialExistingImages.filter((img) => {
      if (img.id) return !removedExisting.includes(String(img.id));
      return !removedExisting.includes(`url:${img.url}`);
    });
  }, [initialExistingImages, removedExisting]);
  const profileFetch = useApiMutation<any>("get", "/auth/profile");

  const setUser = useAuthStore((s) => s.setUser);
  const setListings = useListingsStore((s) => s.set);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      fd.append("listingType", data.listingType);
      fd.append("price", String(data.price));
      fd.append("currency", data.currency);
      fd.append("location", data.location);
      if (data.address) fd.append("address", data.address);
      fd.append("categoryId", String(data.categoryId));
      // contact visibility default
      fd.append("contactVisibility", "HIDE_SELLER");
      // Validate images presence using only imagesPreview (new) + existingImages (edit)
      if (!editId) {
        if (imagesPreview.length === 0) {
          setError("Add at least one image");
          return;
        }
      } else {
        if (imagesPreview.length === 0 && existingImages.length === 0) {
          setError("Add at least one image");
          return;
        }
      }
      imagesPreview.forEach((f) => fd.append("images", f));
      const removedById = removedExisting.filter((x) => !x.startsWith("url:"));
      if (editId && removedById.length > 0) {
        // Only send a single JSON array of removed image IDs
        fd.append("removeImages", JSON.stringify(removedById));
      }
      if (process.env.NODE_ENV !== "production") {
        // Debug: log FormData keys (cannot directly inspect values of files easily)
        try {
          // @ts-ignore
          for (const [k, v] of (fd as any).entries()) {
            console.debug(
              "FormData:",
              k,
              v instanceof File ? `File(${v.name})` : v
            );
          }
        } catch (e) {
          console.debug("Failed to iterate FormData", e);
        }
      }

      if (editId && editListingMutation) {
        await editListingMutation.mutateAsync(fd as any);
      } else {
        await createListing.mutateAsync(fd as any);
      }
      // Refresh profile (user + listings) after successful creation
      try {
        const profileRes = await profileFetch.mutateAsync(undefined as any);
        const body = (profileRes as any)?.data ?? profileRes;
        const user = body?.user ?? body?.data?.user ?? body;
        const listings =
          body?.listings ??
          body?.data?.listings ??
          (Array.isArray(body) ? body : []);
        try {
          setUser(user ?? null);
        } catch (e) {
          console.warn("Failed to set user in store", e);
        }
        try {
          setListings(Array.isArray(listings) ? listings : []);
        } catch (e) {
          console.warn("Failed to set listings in store", e);
        }
      } catch (err) {
        console.warn("Failed to refresh profile after creating listing", err);
      }
      reset();
      setImagesPreview([]);
      setPickedType(null);
      setPickedCategory(null);
      setRemovedExisting([]);
      setStep(1);
    } catch (e: any) {
      setError(e?.message || "Failed to create listing");
    }
  };

  const onFormErrors = (errs: any) => {
    console.warn("Form validation errors:", errs);
    // pick first error message
    try {
      const firstKey = Object.keys(errs)[0];
      const msg = errs[firstKey]?.message || JSON.stringify(errs[firstKey]);
      setError(msg || "Validation failed");
    } catch (e) {
      setError("Validation failed");
    }
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  // Prefill when editing
  useEffect(() => {
    if (!editId) return;
    const d = editListingFetch.data;
    if (!d) return;
    const L = Array.isArray(d) ? d[0] : d;
    try {
      setValue("title", L.title || "");
      setValue("description", L.description || "");
      setValue("price", L.price ?? 0);
      setValue("currency", L.currency || "AFG");
      setValue("location", L.location || "");
      setValue("address", L.address || "");
      setValue("categoryId", L.categoryId ?? L.category?.id ?? null);
      setValue("listingType", L.listingType || "RENT");
      // Keep current step; user can continue through guided flow.
    } catch (e) {
      console.warn("Failed to prefill edit listing", e);
    }
  }, [editId, editListingFetch.data, setValue]);

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--foreground))]/50">
        {t("listingsCreateStep1Title")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {(["RENT", "SALE"] as const).map((typeKey) => (
          <motion.button
            key={typeKey}
            type="button"
            whileTap={{ scale: 0.97 }}
            className={cn(
              "h-20 rounded-2xl border-2 bg-[hsl(var(--card))]/60 backdrop-blur-sm hover:bg-[hsl(var(--primary))]/5 transition-all relative overflow-hidden",
              pickedType === typeKey
                ? "border-[hsl(var(--primary))]/60 bg-[hsl(var(--primary))]/5 shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]"
                : "border-[hsl(var(--border))]/40"
            )}
            onClick={() => {
              setPickedType(typeKey);
              setValue("listingType", typeKey);
              setStep(2);
            }}
          >
            {pickedType === typeKey && (
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary))]/40 to-transparent" />
            )}
            <span
              className={cn(
                "text-sm font-bold",
                pickedType === typeKey
                  ? "text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--foreground))]"
              )}
            >
              {typeKey === "RENT"
                ? t("listingsCreateOptionRent")
                : t("listingsCreateOptionSale")}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--foreground))]/50">
        {t("listingsCreateStep2Title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cats.slice(0, 12).map((c) => (
          <motion.button
            key={c.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            className={cn(
              "h-14 rounded-2xl border-2 text-sm bg-[hsl(var(--card))]/60 backdrop-blur-sm hover:bg-[hsl(var(--primary))]/5 transition-all relative overflow-hidden",
              pickedCategory === c.id
                ? "border-[hsl(var(--primary))]/60 bg-[hsl(var(--primary))]/5 font-semibold text-[hsl(var(--primary))]"
                : "border-[hsl(var(--border))]/40 font-medium"
            )}
            onClick={() => {
              setPickedCategory(c.id);
              setValue("categoryId", c.id);
              setStep(3);
            }}
          >
            {pickedCategory === c.id && (
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--primary))]/40 to-transparent" />
            )}
            {c.name}
          </motion.button>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="h-9 px-3 rounded-xl border border-[hsl(var(--border))]/50 text-xs font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--foreground))]/50">
        {t("listingsCreateStep3Title")}
      </h2>
      <div
        className={cn(
          "p-8 rounded-2xl border-2 border-dashed bg-[hsl(var(--card))]/40 backdrop-blur-sm transition-colors",
          imagesLocalError ? "border-red-500/60" : "border-[hsl(var(--border))]/40 hover:border-[hsl(var(--primary))]/30"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
          );
          if (files.length) {
            const combo = [...imagesPreview, ...files];
            const seen = new Set<string>();
            const dedup: File[] = [];
            combo.forEach((f) => {
              const key = `${f.name}_${f.size}_${f.lastModified}`;
              if (!seen.has(key)) {
                seen.add(key);
                dedup.push(f);
              }
            });
            setImagesPreview(dedup);
            setValue("images", dedup as any, { shouldValidate: true });
            setImagesLocalError(null);
          }
        }}
      >
        <div className="text-center space-y-3">
          <UploadCloud className="size-8 mx-auto text-[hsl(var(--foreground))]/25" />
          <p className="text-sm text-[hsl(var(--foreground))]/50">
            {t("listingsCreateImagesDragDrop")}
          </p>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 px-4 rounded-xl border border-[hsl(var(--border))]/50 text-xs font-medium hover:bg-[hsl(var(--muted))]/20 transition-colors"
            >
              {t("listingsCreateImagesBrowse")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              name="images"
              aria-label="Upload images"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).filter((f) =>
                  f.type.startsWith("image/")
                );
                const combo = [...imagesPreview, ...files];
                const seen = new Set<string>();
                const dedup: File[] = [];
                combo.forEach((f) => {
                  const key = `${f.name}_${f.size}_${f.lastModified}`;
                  if (!seen.has(key)) {
                    seen.add(key);
                    dedup.push(f);
                  }
                });
                setImagesPreview(dedup);
                setValue("images", dedup as any, { shouldValidate: true });
                setImagesLocalError(null);
              }}
            />
          </div>
        </div>
        {imagesPreview.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {imagesPreview.map((f, i) => {
              const url = URL.createObjectURL(f);
              return (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))] shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={f.name}
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1.5 right-1.5 size-6 rounded-lg bg-[hsl(var(--background))]/80 backdrop-blur border border-[hsl(var(--border))]/50 flex items-center justify-center text-[hsl(var(--foreground))]/50 hover:text-red-400 transition-colors"
                    onClick={() => {
                      const next = imagesPreview.filter((_, idx) => idx !== i);
                      setImagesPreview(next);
                      setValue("images", next as any, { shouldValidate: true });
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {existingImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((img: ExistingImage, i: number) => (
              <div
                key={img.url + i}
                className="relative rounded-xl overflow-hidden border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))] shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(img.url)}
                  alt={`Image ${i + 1}`}
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1.5 right-1.5 size-6 rounded-lg bg-[hsl(var(--background))]/80 backdrop-blur border border-[hsl(var(--border))]/50 flex items-center justify-center text-[hsl(var(--foreground))]/50 hover:text-red-400 transition-colors"
                  onClick={() => {
                    const marker = img.id ? String(img.id) : `url:${img.url}`;
                    setRemovedExisting((s) =>
                      s.includes(marker) ? s : [...s, marker]
                    );
                  }}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {(imagesLocalError || (errors as any)?.images?.message) && (
          <p className="mt-2 text-sm text-red-500">
            {imagesLocalError || (errors as any)?.images?.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="h-9 px-3 rounded-xl border border-[hsl(var(--border))]/50 text-xs font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (imagesPreview.length === 0 && existingImages.length === 0) {
              setImagesLocalError("Add at least one image");
              return;
            }
            setImagesLocalError(null);
            setStep(4);
          }}
          className="h-9 px-5 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-semibold hover:brightness-110 transition-all relative overflow-hidden"
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <form
      onSubmit={handleSubmit(onSubmit, onFormErrors)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Title
        </label>
        <div className="relative">
          <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <input
            {...register("title")}
            placeholder="2BR Apartment for Rent"
            className={cn(inputCls, "pl-10")}
          />
        </div>
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <textarea
            {...register("description")}
            placeholder="Describe the property..."
            rows={5}
            className="w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all resize-none placeholder:text-[hsl(var(--foreground))]/30"
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Price
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className={cn(inputCls, "pl-10")}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Currency
        </label>
        <div className="relative">
          <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <select {...register("currency")} className={selectCls}>
            <option value="USD">USD</option>
            <option value="AFG">AFG</option>
            <option value="EUR">EUR</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <select {...register("location")} className={selectCls}>
            <option value="">Select a region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50 mb-1.5">
          Address
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--foreground))]/30 pointer-events-none" />
          <input
            {...register("address")}
            placeholder="Street 1, Near Market"
            className={cn(inputCls, "pl-10")}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
      <div className="md:col-span-2 flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="h-10 px-4 rounded-2xl border border-[hsl(var(--border))]/50 text-sm font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            createListing.isPending ||
            editListingMutation.isPending
          }
          className="h-10 px-6 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          {(isSubmitting || createListing.isPending || editListingMutation.isPending) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {editId ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );

  const progressWidthClass = ["w-1/4", "w-2/4", "w-3/4", "w-full"][step - 1];
  const progressPct = ["25%", "50%", "75%", "100%"][step - 1];
  const stepLabels = [
    t("listingsCreateStep1Title") || "Type",
    t("listingsCreateStep2Title") || "Category",
    t("listingsCreateStep3Title") || "Photos",
    t("listingsCreateStep4Title") || "Details",
  ];
  const inputCls =
    "h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30";
  const selectCls =
    "h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all appearance-none";

  return (
    <div className="min-h-screen flex mt-32 justify-center px-4 sm:px-6">
      <div className="w-full max-w-3xl">
        <Card className="relative overflow-hidden p-6 rounded-[2rem] border border-[hsl(var(--border))]/40 bg-[hsl(var(--card))]/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
          {/* shimmer top line */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="size-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center shrink-0">
              <TypeIcon className="size-4 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">
                {editId ? t("editListing") || "Edit Listing" : t("createListing") || "Create Listing"}
              </h1>
              <p className="text-[11px] text-[hsl(var(--foreground))]/40">
                {stepLabels[step - 1]} — Step {step} of 4
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              {([1, 2, 3, 4] as const).map((i, idx) => (
                <div key={i} className="flex items-center" style={{ flex: idx < 3 ? "1 1 0%" : "0 0 auto" }}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{
                        backgroundColor:
                          i <= step ? "hsl(var(--primary))" : "transparent",
                        borderColor:
                          i <= step ? "hsl(var(--primary))" : "hsl(var(--border))",
                      }}
                      transition={{ duration: 0.2 }}
                      className="size-7 rounded-xl border-2 flex items-center justify-center text-[11px] font-bold shrink-0"
                    >
                      <motion.span
                        animate={{ opacity: 1 }}
                        className={
                          i < step
                            ? "text-[hsl(var(--primary-foreground))]"
                            : i === step
                              ? "text-[hsl(var(--primary-foreground))]"
                              : "text-[hsl(var(--foreground))]/40"
                        }
                      >
                        {i < step ? <Check className="size-3" /> : i}
                      </motion.span>
                    </motion.div>
                    <span
                      className={cn(
                        "text-[10px] hidden sm:block whitespace-nowrap",
                        i === step
                          ? "text-[hsl(var(--foreground))] font-medium"
                          : "text-[hsl(var(--foreground))]/35"
                      )}
                    >
                      {stepLabels[i - 1]}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className="relative flex-1 h-0.5 mx-2 mb-4">
                      <div className="absolute inset-0 rounded-full bg-[hsl(var(--border))]/25" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[hsl(var(--primary))]"
                        animate={{ scaleX: i < step ? 1 : 0 }}
                        style={{ originX: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full bg-[hsl(var(--muted))]/20 overflow-hidden">
              <motion.div
                animate={{ width: progressPct }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/60"
              />
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>
        </Card>
      </div>
    </div>
  );
}
