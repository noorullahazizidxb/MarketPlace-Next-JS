"use client";
import React, { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "../ui/switch";
import { ParentAutocomplete } from "./ParentAutocomplete";
import { useCreateCategory } from "./useCategoryData";
import type { CreateCategoryInput } from "./types";
import { toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/cn";
import {
  Type,
  Hash,
  ToggleLeft,
  FolderTree,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
  X,
} from "lucide-react";

const fireConfetti = () => {
  try {
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
          { transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(0.4)`, opacity: 0 },
        ],
        { duration: 1200 + Math.random() * 600, easing: "cubic-bezier(.32,.72,.37,.97)", fill: "forwards" }
      );
      frag.appendChild(p);
    }
    el.appendChild(frag);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  } catch { }
};

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

const STEP_CONFIG = [
  { key: "name", label: "Name", icon: Type },
  { key: "slug", label: "Slug", icon: Hash },
  { key: "options", label: "Options", icon: ToggleLeft },
  { key: "parent", label: "Parent", icon: FolderTree, conditional: true },
  { key: "review", label: "Review", icon: ClipboardCheck },
];

const inputCls =
  "w-full h-11 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/60 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30";

export const CategoryCreateWizard: React.FC<WizardProps> = ({
  onCreated,
  onClose,
}) => {
  const [autoSlug, setAutoSlug] = useState(true);
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", isActive: true, isSub: false, parentId: null },
  });
  const create = useCreateCategory(() => { onCreated(); });
  const name = useWatch({ control, name: "name" }) || "";
  const slug = useWatch({ control, name: "slug" }) || "";
  const isSub = useWatch({ control, name: "isSub" }) ?? false;
  const isActive = useWatch({ control, name: "isActive" }) ?? true;
  const parentId = useWatch({ control, name: "parentId" }) ?? null;

  React.useEffect(() => {
    if (autoSlug)
      setValue("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200));
  }, [name, autoSlug, setValue]);

  const steps = useMemo(() => STEP_CONFIG.filter((s) => !s.conditional || isSub), [isSub]);

  const nextAllowed = () => {
    const cur = steps[step];
    if (!cur) return false;
    if (cur.key === "name") return !!name && !errors.name;
    if (cur.key === "slug") return !!slug && !errors.slug;
    if (cur.key === "options") return true;
    if (cur.key === "parent") return parentId != null;
    return true;
  };

  const goNext = () => { if (step < steps.length - 1 && nextAllowed()) setStep((s) => s + 1); };
  const goPrev = () => { if (step > 0) setStep((s) => s - 1); };

  const onSubmit = async (vals: FormValues) => {
    const payload: CreateCategoryInput = {
      name: vals.name.trim(),
      slug: vals.slug?.trim() || vals.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      isActive: vals.isActive,
      parentId: vals.isSub ? vals.parentId ?? undefined : undefined,
    };
    await create.submit(payload);
    fireConfetti();
    toastSuccess("Category created");
    onCreated();
    onClose?.();
  };

  const curStep = steps[step];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 relative">
      {/* shimmer */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={s.key}>
                <motion.button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  animate={{
                    backgroundColor: done
                      ? "hsl(var(--primary))"
                      : active
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "size-8 rounded-xl flex items-center justify-center transition-opacity",
                    (done || active) ? "text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))]",
                    i > step ? "opacity-40" : "opacity-100",
                    i < step ? "cursor-pointer hover:brightness-110" : "cursor-default"
                  )}
                  title={s.label}
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.span key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="size-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Icon className="size-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                {i < steps.length - 1 && (
                  <div className="relative w-6 h-0.5">
                    <div className="absolute inset-0 rounded-full bg-[hsl(var(--border))]/30" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[hsl(var(--primary))]"
                      animate={{ scaleX: i < step ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <span className="text-[10px] text-[hsl(var(--foreground))]/35 font-medium tabular-nums">
          {step + 1} / {steps.length}
        </span>
      </div>

      {/* Step content */}
      <div className="relative min-h-[180px]">
        <AnimatePresence mode="wait">
          {curStep?.key === "name" && (
            <motion.div key="step-name" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">Category Name *</label>
              <input {...register("name")} placeholder="e.g. Electronics" className={inputCls} autoFocus />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </motion.div>
          )}
          {curStep?.key === "slug" && (
            <motion.div key="step-slug" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">URL Slug *</label>
              <div className="flex items-center gap-2">
                <input {...register("slug")} disabled={autoSlug} placeholder="electronics" className={cn(inputCls, "flex-1", autoSlug && "opacity-60")} />
                <div className="flex items-center gap-2 shrink-0 px-3 h-11 rounded-2xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/40">
                  <Switch checked={autoSlug} onCheckedChange={setAutoSlug} id="autoslug" />
                  <label htmlFor="autoslug" className="text-xs font-medium cursor-pointer whitespace-nowrap">Auto</label>
                </div>
              </div>
              {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
            </motion.div>
          )}
          {curStep?.key === "options" && (
            <motion.div key="step-opts" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">Category Options</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "active", checked: isActive, onChange: (v: boolean) => setValue("isActive", v), label: "Active", desc: "Visible to users" },
                  { id: "isSub", checked: isSub, onChange: (v: boolean) => setValue("isSub", v), label: "Sub-category", desc: "Has a parent category" },
                ].map((opt) => (
                  <div key={opt.id} className={cn(
                    "flex items-center justify-between gap-3 p-4 rounded-2xl border cursor-pointer transition-all",
                    opt.checked
                      ? "border-[hsl(var(--primary))]/40 bg-[hsl(var(--primary))]/5"
                      : "border-[hsl(var(--border))]/50 hover:border-[hsl(var(--border))]"
                  )} onClick={() => opt.onChange(!opt.checked)}>
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-[11px] text-[hsl(var(--foreground))]/45">{opt.desc}</p>
                    </div>
                    <Switch checked={opt.checked} onCheckedChange={opt.onChange} id={opt.id} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {curStep?.key === "parent" && (
            <motion.div key="step-parent" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">Parent Category *</label>
              <ParentAutocomplete value={parentId} onChange={(v) => setValue("parentId", v)} />
              {parentId == null && <p className="text-xs text-amber-400">Select a parent category to continue.</p>}
            </motion.div>
          )}
          {curStep?.key === "review" && (
            <motion.div key="step-review" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">Review & Create</label>
              <div className="rounded-2xl border border-[hsl(var(--border))]/40 bg-[hsl(var(--muted))]/10 divide-y divide-[hsl(var(--border))]/20 overflow-hidden">
                {[
                  ["Name", name || "—"],
                  ["Slug", slug || "—"],
                  ["Active", isActive ? "Yes" : "No"],
                  ["Sub-category", isSub ? "Yes" : "No"],
                  ...(isSub ? [["Parent ID", String(parentId ?? "—")]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-[hsl(var(--foreground))]/50 font-medium">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={step === 0}
          onClick={goPrev}
          className="h-10 px-4 rounded-2xl border border-[hsl(var(--border))]/50 text-sm font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!nextAllowed()}
            onClick={goNext}
            className="h-10 px-5 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all relative overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            Next
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={create.isPending}
            className="h-10 px-6 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {create.isPending ? "Creating…" : "Create Category"}
          </button>
        )}
      </div>
    </form>
  );
};
