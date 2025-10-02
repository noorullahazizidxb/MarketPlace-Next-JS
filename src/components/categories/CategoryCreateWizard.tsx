"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
import { Card } from "@/components/ui/card";
import { ParentAutocomplete } from "./ParentAutocomplete";
import { useCreateCategory } from "./useCategoryData";
import type { CreateCategoryInput } from "./types";
import { toastSuccess } from "@/lib/toast";
// Optional visual celebration; you can wire a real confetti lib later.
const fireConfetti = () => {
  try {
    // lightweight fallback animation (no external dep)
    if (typeof window === "undefined") return;
    const el = document.createElement("div");
    el.className = "fixed inset-0 pointer-events-none overflow-hidden z-[9999]";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("span");
      p.className = "absolute w-2 h-2 rounded-full";
      p.style.background = "hsl(var(--accent))";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = "40%";
      const tx = (Math.random() - 0.5) * 300;
      const ty = 200 + Math.random() * 200;
      const rot = Math.random() * 720;
      p.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          {
            transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(0.4)`,
            opacity: 0,
          },
        ],
        {
          duration: 1200 + Math.random() * 600,
          easing: "cubic-bezier(.32,.72,.37,.97)",
          fill: "forwards",
        }
      );
      frag.appendChild(p);
    }
    el.appendChild(frag);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  } catch {}
};

// Mirror Joi schema
const schema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional().or(z.literal("")),
  isActive: z.boolean(),
  isSub: z.boolean(),
  parentId: z.number().int().nullable().optional(),
});
type FormValues = z.infer<typeof schema>;

interface WizardProps {
  onCreated: () => void;
  onClose?: () => void;
}

export const CategoryCreateWizard: React.FC<WizardProps> = ({
  onCreated,
  onClose,
}) => {
  const [autoSlug, setAutoSlug] = useState(true);
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
      isSub: false,
      parentId: null,
    },
  });
  const create = useCreateCategory(() => {
    onCreated();
  });
  const name = watch("name");
  const isSub = watch("isSub");

  React.useEffect(() => {
    if (autoSlug)
      setValue(
        "slug",
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 200)
      );
  }, [name, autoSlug, setValue]);

  const steps = useMemo(() => {
    const base = [
      "Name",
      "Slug",
      "Activation",
      ...(isSub ? ["Parent"] : []),
      "Review",
    ];
    return base;
  }, [isSub]);

  const nextAllowed = () => {
    if (step === 0) return !!name && !errors.name;
    if (step === 1) return !!watch("slug") && !errors.slug;
    if (step === 2) return true; // activation step always valid
    if (isSub && step === 3) return watch("parentId") != null; // parent required if sub
    return true;
  };

  const goNext = () => {
    if (step < steps.length - 1 && nextAllowed()) setStep((s) => s + 1);
  };
  const goPrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onSubmit = async (vals: FormValues) => {
    const payload: CreateCategoryInput = {
      name: vals.name.trim(),
      slug:
        vals.slug?.trim() ||
        vals.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      isActive: vals.isActive,
      parentId: vals.isSub ? vals.parentId ?? undefined : undefined,
    };
    await create.submit(payload);
    // tiny celebratory confetti
    fireConfetti();
    toastSuccess("Category created");
    onCreated();
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        {steps.map((label, i) => (
          <button
            type="button"
            key={label}
            onClick={() => i < step && setStep(i)}
            className={
              "text-2xs tracking-wide font-medium px-3 h-8 rounded-full border transition-colors " +
              (i === step
                ? "bg-[hsl(var(--accent))/0.2] border-[hsl(var(--accent))]"
                : i < step
                ? "bg-[hsl(var(--muted))/0.5]"
                : "bg-[hsl(var(--muted))/0.2] opacity-70")
            }
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="text-2xs font-semibold uppercase tracking-wide">
                  Name *
                </label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Electronics"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-2xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="step-slug"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-2xs font-semibold uppercase tracking-wide">
                    Slug *
                  </label>
                  <Input
                    {...register("slug")}
                    disabled={autoSlug}
                    placeholder="electronics"
                    className="mt-1"
                  />
                </div>
                <div className="pt-5 flex items-center gap-2 text-2xs">
                  <Switch
                    checked={autoSlug}
                    onCheckedChange={setAutoSlug}
                    id="autoslug"
                  />
                  <label htmlFor="autoslug">Auto</label>
                </div>
              </div>
              {errors.slug && (
                <p className="text-2xs text-red-500">{errors.slug.message}</p>
              )}
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step-active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-2xs font-medium">
                  <Switch
                    {...register("isActive")}
                    checked={watch("isActive")}
                    onCheckedChange={(v: boolean) => setValue("isActive", v)}
                    id="active"
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div className="flex items-center gap-2 text-2xs font-medium">
                  <Switch
                    {...register("isSub")}
                    checked={watch("isSub")}
                    onCheckedChange={(v: boolean) => setValue("isSub", v)}
                    id="isSub"
                  />
                  <label htmlFor="isSub">Is Sub Category?</label>
                </div>
              </div>
            </motion.div>
          )}
          {isSub && step === 3 && (
            <motion.div
              key="step-parent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <label className="text-2xs font-semibold uppercase tracking-wide">
                Parent *
              </label>
              <ParentAutocomplete
                value={watch("parentId") ?? null}
                onChange={(v) => setValue("parentId", v)}
              />
              {watch("parentId") == null && (
                <p className="text-2xs text-amber-500">
                  Select a parent to continue.
                </p>
              )}
            </motion.div>
          )}
          {step === steps.length - 1 && (
            <motion.div
              key="step-review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">Name</span>
                  <span>{watch("name") || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Slug</span>
                  <span>{watch("slug") || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Active</span>
                  <span>{watch("isActive") ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Is Sub</span>
                  <span>{watch("isSub") ? "Yes" : "No"}</span>
                </div>
                {watch("isSub") && (
                  <div className="flex justify-between">
                    <span className="font-medium">Parent</span>
                    <span>{watch("parentId") || "—"}</span>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="secondary"
          disabled={step === 0}
          onClick={goPrev}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" disabled={!nextAllowed()} onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating..." : "Create Category"}
          </Button>
        )}
      </div>
    </form>
  );
};
