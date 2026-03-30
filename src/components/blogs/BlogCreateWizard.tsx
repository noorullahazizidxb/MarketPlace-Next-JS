"use client";
import React, { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  FileText,
  Image,
  Newspaper,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/cn";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const STEPS = [
  { label: "Details", key: "details", icon: FileText },
  { label: "Media", key: "media", icon: Image },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? "1.5rem" : "0.5rem",
            backgroundColor:
              i < current
                ? "hsl(var(--primary))"
                : i === current
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))",
            opacity: i === current ? 1 : i < current ? 0.7 : 0.35,
          }}
          transition={{ duration: 0.25 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

export default function BlogCreateWizard({
  onClose,
  blogId,
  initial,
}: {
  onClose: () => void;
  blogId?: string;
  initial?: { title?: string; content?: string } | null;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const create = useApiMutation("post", "/blogs");
  const update = useApiMutation(
    "put",
    blogId ? `/blogs/${blogId}` : "/blogs/__noop__"
  );

  const schema = z.object({
    title: z
      .string()
      .min(3, (t("title") as string) + ": min 3 chars")
      .max(200),
    content: z.string().min(10, "Description must be at least 10 characters"),
  });
  type FormVals = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || "",
      content: initial?.content || "",
    },
    mode: "onChange",
  });

  const title = watch("title");
  const content = watch("content");
  const canNext =
    step === 0 ? !!title?.trim() && !errors.title && !errors.content : true;
  const next = () => step < STEPS.length - 1 && canNext && setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const isPending = create.isPending || (blogId ? update.isPending : false);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFiles(e.dataTransfer?.files);
  }, []);
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onSubmit = async (vals: FormVals) => {
    const fd = new FormData();
    fd.append("title", vals.title.trim());
    fd.append("content", vals.content.trim());
    images.forEach((file) => fd.append("images", file));
    try {
      if (blogId && update) {
        const updated: any = await update.mutateAsync(fd as any, {
          headers: { "Content-Type": "multipart/form-data" },
        } as any);
        try {
          const { getSocket } = await import("@/lib/socket");
          getSocket()?.emit?.("blogUpdated", { id: blogId, blog: updated });
        } catch { }
        onClose();
      } else {
        await create.mutateAsync(fd as any, {
          headers: { "Content-Type": "multipart/form-data" },
        } as any);
        onClose();
      }
    } catch { }
  };

  const inputCls =
    "w-full h-11 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/60 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30";

  return (
    <div className="flex flex-col h-full min-h-0 max-h-[calc(100vh-96px)] relative">
      {/* shimmer top line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent z-10" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[hsl(var(--border))]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <Newspaper className="size-4.5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">
                {blogId ? (t("edit") as string) : (t("createBlog") as string) || (blogId ? "Edit Blog" : "New Blog Post")}
              </h2>
              <p className="text-[11px] text-[hsl(var(--foreground))]/40">
                {step === 0 ? "Write your post details" : "Add images to your post"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-xl border border-[hsl(var(--border))]/40 flex items-center justify-center text-[hsl(var(--foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/20 transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step line */}
        <div className="flex items-center gap-3">
          <StepDots current={step} total={STEPS.length} />
          <div className="flex-1 h-1 rounded-full bg-[hsl(var(--muted))]/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
            />
          </div>
          <span className="text-[10px] font-medium text-[hsl(var(--foreground))]/40 tabular-nums">
            {step + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* Body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="blog-step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">
                    {t("title") || "Title"}
                  </label>
                  <input
                    id="blog-title"
                    {...register("title")}
                    placeholder={(t("catchyHeadline") as string) || "An amazing headline…"}
                    className={inputCls}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400">{errors.title.message as any}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/45">
                    {t("description") || "Content"}
                  </label>
                  <textarea
                    id="blog-desc"
                    className={cn(inputCls, "h-auto min-h-[160px] py-3 resize-none")}
                    {...register("content")}
                    placeholder={(t("writeSomethingAmazing") as string) || "Write something amazing…"}
                  />
                  {errors.content && (
                    <p className="text-xs text-red-400">{errors.content.message as any}</p>
                  )}
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="blog-step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="group rounded-2xl border-2 border-dashed border-[hsl(var(--border))]/50 hover:border-[hsl(var(--primary))]/50 bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--primary))]/5 p-8 text-center cursor-pointer transition-all"
                  onClick={() => document.getElementById("blog-images-input")?.click()}
                >
                  <UploadCloud className="size-8 mx-auto mb-2 text-[hsl(var(--foreground))]/25 group-hover:text-[hsl(var(--primary))]/60 transition-colors" />
                  <p className="text-sm text-[hsl(var(--foreground))]/50 group-hover:text-[hsl(var(--foreground))]/70">
                    Drag & drop images, or{" "}
                    <span className="text-[hsl(var(--primary))] font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-[hsl(var(--foreground))]/30 mt-1">PNG, JPG, WebP supported</p>
                  <input
                    id="blog-images-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onFiles((e.target as HTMLInputElement).files)}
                    className="hidden"
                    aria-label="Upload images"
                    title="Upload images"
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((file, idx) => {
                      const src = URL.createObjectURL(file);
                      return (
                        <div key={idx + src} className="relative group aspect-video">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="preview" className="w-full h-full object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-[hsl(var(--foreground))]/35 text-center">
                  {images.length > 0 ? `${images.length} image${images.length > 1 ? "s" : ""} selected` : "No images selected yet — this step is optional"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[hsl(var(--border))]/30 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3 rounded-xl text-sm text-[hsl(var(--foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/20 transition-colors"
          >
            {t("cancel") || "Cancel"}
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={prev}
                className="h-10 px-4 rounded-2xl border border-[hsl(var(--border))]/50 text-sm font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                {t("back") || "Back"}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={next}
                className="h-10 px-5 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                {t("next") || "Next"}
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="h-10 px-6 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {blogId ? (t("updateLabel") as string) || "Update" : (t("publish") as string) || "Publish"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

