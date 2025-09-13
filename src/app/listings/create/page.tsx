"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  listingType: z.enum(["RENT", "SALE"]),
  price: z.coerce.number().positive(),
  currency: z.string().min(3).max(3).default("AFN"),
  location: z.string().min(2),
  address: z
    .string()
    .optional()
    .transform((v) => v ?? ""),
  categoryId: z.coerce.number().int().positive(),
});

type FormData = z.infer<typeof schema>;

export default function CreateListingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pickedType, setPickedType] = useState<"RENT" | "SALE" | null>(null);
  const [pickedCategory, setPickedCategory] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useApiGet<any>(["categories"], "/categories");
  const cats: { id: number; name: string }[] = Array.isArray(categories)
    ? categories
    : categories
    ? [categories]
    : [];

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
      await createListing.mutateAsync({
        ...data,
        contactVisibility: "HIDE_SELLER",
      });
      reset();
    } catch (e: any) {
      setError(e?.message || "Failed to create listing");
    }
  };

  const Step1 = () => (
    <div className="space-y-4">
      <h2 className="heading-xl">What are you doing?</h2>
      <div className="grid grid-cols-2 gap-3">
        {(["RENT", "SALE"] as const).map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.98 }}
            className={`h-20 rounded-2xl glass border ${
              pickedType === t ? "ring-2 ring-primary/50" : ""
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
    <div className="space-y-4">
      <h2 className="heading-xl">Choose a category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cats.slice(0, 12).map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.98 }}
            className={`h-16 rounded-2xl glass border text-sm ${
              pickedCategory === c.id ? "ring-2 ring-primary/50" : ""
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
        <Button variant="secondary" onClick={() => setStep(1)}>
          Back
        </Button>
      </div>
    </div>
  );

  const Step3 = () => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Title</label>
        <Input {...register("title")} placeholder="2BR Apartment for Rent" />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Description</label>
        <Input
          {...register("description")}
          placeholder="Describe the property..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm mb-1">Price</label>
        <Input type="number" step="0.01" {...register("price")} />
      </div>
      <div>
        <label className="block text-sm mb-1">Currency</label>
        <Input {...register("currency")} placeholder="AFN" />
      </div>
      <div>
        <label className="block text-sm mb-1">Location</label>
        <Input {...register("location")} placeholder="Kabul" />
      </div>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <Input {...register("address")} placeholder="Street 1, Near Market" />
      </div>
      {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
      <div className="md:col-span-2 flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || createListing.isPending}
        >
          Create
        </Button>
      </div>
    </form>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 glass">
        <h1 className="heading-xl mb-4">Create listing</h1>
        <div className="space-y-4">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
        </div>
      </Card>
    </div>
  );
}
