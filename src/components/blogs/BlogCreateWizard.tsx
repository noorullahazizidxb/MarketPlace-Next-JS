"use client";
import React, { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import { ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [step, setStep] = useState(0); // 0 details, 1 media
  const [images, setImages] = useState<File[]>([]);
  const create = useApiMutation("post", "/blogs");
  const update = useApiMutation(
    "put",
    blogId ? `/blogs/${blogId}` : "/blogs/__noop__"
  );

  const steps = useMemo(() => [t("details"), t("media")], [t]);
  // Validation schema
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
  const next = () =>
    step < steps.length - 1 && canNext && setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const progress = ((step + 1) / steps.length) * 100;

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (!dt) return;
    onFiles(dt.files);
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
        const updated: any = await update.mutateAsync(
          fd as any,
          {
            headers: { "Content-Type": "multipart/form-data" },
          } as any
        );
        try {
          const { getSocket } = await import("@/lib/socket");
          getSocket()?.emit?.("blogUpdated", { id: blogId, blog: updated });
        } catch {}
        onClose();
      } else {
        await create.mutateAsync(
          fd as any,
          {
            headers: { "Content-Type": "multipart/form-data" },
          } as any
        );
        onClose();
      }
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full min-h-0 max-h-[calc(100vh-96px)] bg-[hsl(var(--card))]"
    >
      <div className="p-4 border-b border-[hsl(var(--border))] flex items-center gap-4 relative">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {blogId ? (t("edit") as string) : (t("createBlog") as string)}
        </h2>
        <div className="flex items-center gap-2 text-2xs ml-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`size-6 rounded-full grid place-items-center text-[10px] font-semibold ${
                  i === step
                    ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                    : i < step
                    ? "bg-green-500/80 text-white"
                    : "bg-[hsl(var(--muted))] text-foreground/60"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={
                  i === step
                    ? "text-foreground uppercase tracking-wide text-2xs"
                    : "text-foreground/50 uppercase tracking-wide text-2xs"
                }
              >
                {s}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute left-0 bottom-0 h-1 w-full bg-[hsl(var(--muted))/0.35] overflow-hidden rounded">
          <motion.div
            initial={false}
            animate={{ width: progress + "%" }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            className="h-full bg-gradient-to-r from-[hsl(var(--accent))] via-emerald-400 to-green-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="blog-step-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="blog-title">
                  {t("title")}
                </label>
                <Input
                  id="blog-title"
                  {...register("title")}
                  placeholder={t("catchyHeadline") as string}
                  className="h-11 rounded-xl bg-[hsl(var(--input))]/20 border-[hsl(var(--border))]/60 focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                />
                {errors.title && (
                  <p className="text-2xs text-red-500 mt-1">
                    {errors.title.message as any}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="blog-desc">
                  {t("description")}
                </label>
                <textarea
                  id="blog-desc"
                  className="w-full min-h-[160px] rounded-xl bg-[hsl(var(--input))]/20 border border-[hsl(var(--border))]/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                  {...register("content")}
                  placeholder={t("writeSomethingAmazing") as string}
                />
                {errors.content && (
                  <p className="text-2xs text-red-500 mt-1">
                    {errors.content.message as any}
                  </p>
                )}
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="blog-step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("images")}</label>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.2] p-6 text-center cursor-pointer"
                  onClick={() =>
                    document.getElementById("blog-images-input")?.click()
                  }
                >
                  <UploadCloud className="mx-auto size-6 opacity-70" />
                  <p className="text-sm mt-2 opacity-80">
                    Drag & drop images here, or click to browse
                  </p>
                  <input
                    id="blog-images-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      onFiles((e.target as HTMLInputElement).files)
                    }
                    className="hidden"
                    aria-label="Upload images"
                    title="Upload images"
                  />
                </div>
              </div>
              {images.length > 0 && (
                <ul className="grid grid-cols-3 gap-2">
                  {images.map((file, idx) => {
                    const src = URL.createObjectURL(file);
                    return (
                      <li key={idx + src} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt="preview"
                          className="w-full h-24 object-cover rounded-xl"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 z-30 p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] backdrop-blur-sm flex items-center justify-between">
        <div className="text-2xs subtle">
          {t("step")} {step + 1} / {steps.length}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          {step > 0 && (
            <Button
              type="button"
              variant="secondary"
              LeftIcon={ArrowLeft}
              onClick={prev}
            >
              {t("back")}
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button
              type="button"
              variant="accent"
              LeftIcon={ArrowRight}
              disabled={!canNext}
              onClick={next}
            >
              {t("next")}
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button
              type="submit"
              variant="primary"
              LeftIcon={Check}
              disabled={create.isPending || (blogId ? update.isPending : false)}
            >
              {blogId ? (t("updateLabel") as string) : (t("publish") as string)}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
