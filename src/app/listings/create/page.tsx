"use client";

import { useRef, useState, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Type as TypeIcon,
  FileText,
  DollarSign,
  Coins,
  MapPin,
  Home,
} from "lucide-react";

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
  // images is validated as FileList or File[]; refined to require at least one file.
  images: z.any().refine(
    (v) => {
      if (typeof window === "undefined") return true;
      if (v instanceof FileList) return v.length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return false;
    },
    { message: "Add at least one image" }
  ),
});

type FormData = z.infer<typeof schema>;

export default function CreateListingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
      const files: File[] = imagesPreview.length
        ? imagesPreview
        : data.images instanceof FileList
        ? Array.from(data.images)
        : Array.isArray(data.images)
        ? (data.images as any)
        : [];
      files.forEach((f) => fd.append("images", f));

      await createListing.mutateAsync(fd as any);
      reset();
      setImagesPreview([]);
      setPickedType(null);
      setPickedCategory(null);
      setStep(1);
    } catch (e: any) {
      setError(e?.message || "Failed to create listing");
    }
  };

  const Step1 = () => (
    <div className="space-y-4 transition-opacity duration-300">
      <h2 className="text-lg font-semibold">What are you doing?</h2>
      <div className="grid grid-cols-2 gap-3">
        {(["RENT", "SALE"] as const).map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.98 }}
            className={`h-20 rounded-2xl border bg-[hsl(var(--card))]/70 backdrop-blur hover:bg-[hsl(var(--muted))]/40 transition-all shadow-sm ${
              pickedType === t
                ? "ring-2 ring-[hsl(var(--accent))]/50 border-[hsl(var(--accent))]/40"
                : "border-[hsl(var(--border))]"
            }`}
            onClick={() => {
              setPickedType(t);
              setValue("listingType", t);
              setStep(2);
            }}
          >
            <span className="font-semibold">
              {t === "RENT" ? "Renting" : "Selling"}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4 transition-opacity duration-300">
      <h2 className="text-lg font-semibold">Choose a category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cats.slice(0, 12).map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.98 }}
            className={`h-16 rounded-2xl border text-sm bg-[hsl(var(--card))]/70 backdrop-blur hover:bg-[hsl(var(--muted))]/40 transition-all shadow-sm ${
              pickedCategory === c.id
                ? "ring-2 ring-[hsl(var(--accent))]/50 border-[hsl(var(--accent))]/40"
                : "border-[hsl(var(--border))]"
            }`}
            onClick={() => {
              setPickedCategory(c.id);
              setValue("categoryId", c.id);
              setStep(3);
            }}
          >
            {c.name}
          </motion.button>
        ))}
      </div>
      <div>
        <Button
          variant="secondary"
          className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4 transition-opacity duration-300">
      <h2 className="text-lg font-semibold">Add images</h2>
      <div
        className={`p-6 rounded-2xl border-2 border-dashed bg-[hsl(var(--card))]/70 backdrop-blur shadow-sm transition-colors ${
          imagesLocalError ? "border-red-500" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
          );
          if (files.length) {
            const next = [...imagesPreview, ...files];
            setImagesPreview(next);
            setValue("images", next as any, { shouldValidate: true });
            setImagesLocalError(null);
          }
        }}
      >
        <div className="text-center space-y-2">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Drag & drop images here
          </p>
          <div>
            <Button
              type="button"
              variant="secondary"
              className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse files
            </Button>
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
                const next = [...imagesPreview, ...files];
                setImagesPreview(next);
                setValue("images", next as any, { shouldValidate: true });
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
                  className="relative rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={f.name}
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-2xs px-2 py-1 rounded-lg bg-[hsl(var(--background))]/70 backdrop-blur border border-[hsl(var(--border))]"
                    onClick={() => {
                      const next = imagesPreview.filter((_, idx) => idx !== i);
                      setImagesPreview(next);
                      setValue("images", next as any, { shouldValidate: true });
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {(imagesLocalError || (errors as any)?.images?.message) && (
          <p className="mt-2 text-sm text-red-500">
            {imagesLocalError || (errors as any)?.images?.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
          onClick={() => setStep(2)}
        >
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 text-white hover:shadow-lg"
          onClick={() => {
            if (imagesPreview.length === 0) {
              setImagesLocalError("Add at least one image");
              return;
            }
            setImagesLocalError(null);
            setStep(4);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const Step4 = () => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300"
    >
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Title</label>
        <div className="relative">
          <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            {...register("title")}
            placeholder="2BR Apartment for Rent"
            className="h-11 rounded-xl pl-10 border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          />
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Description</label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            {...register("description")}
            placeholder="Describe the property..."
            className="h-11 rounded-xl pl-10 border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm mb-1">Price</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            type="number"
            step="0.01"
            {...register("price")}
            className="h-11 rounded-xl pl-10 border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Currency</label>
        <div className="relative">
          <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <select
            {...register("currency")}
            className="h-11 rounded-xl pl-10 w-full border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          >
            <option value="USD">USD</option>
            <option value="AFG">AFG</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <select
            {...register("location")}
            className="h-11 rounded-xl pl-10 w-full border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          >
            <option value="">Select a region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            {...register("address")}
            placeholder="Street 1, Near Market"
            className="h-11 rounded-xl pl-10 border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
      <div className="md:col-span-2 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
          onClick={() => setStep(3)}
        >
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 text-white hover:shadow-lg disabled:opacity-50"
          type="submit"
          disabled={isSubmitting || createListing.isPending}
        >
          Create
        </Button>
      </div>
    </form>
  );

  const progressWidthClass = ["w-1/4", "w-2/4", "w-3/4", "w-full"][step - 1];

  return (
    <div className="min-h-screen flex mt-32 justify-center px-4 sm:px-6">
      <div className="w-full max-w-3xl">
        <Card className="p-6 rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <h1 className="heading-xl mb-2">Create listing</h1>
          <p className="subtle mb-4">A calm, premium multi-step experience.</p>

          {/* Stepper */}
          <div className="mb-6">
            <div className="relative h-2 rounded-full bg-[hsl(var(--muted))]">
              <div
                className={`absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 transition-all duration-300 ${progressWidthClass}`}
              />
            </div>
            <div className="mt-2 grid grid-cols-4 text-2xs subtle">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <span
                    className={
                      i === step
                        ? "px-2 py-0.5 rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]"
                        : i < step
                        ? "px-2 py-0.5 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]"
                        : "px-2 py-0.5 rounded-full bg-[hsl(var(--muted))]"
                    }
                  >
                    Step {i}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
          </div>
        </Card>
      </div>
    </div>
  );
}
