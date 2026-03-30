"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateStory, useUpdateStory } from "@/lib/stories-hooks";
import {
  Check,
  Image,
  Video,
  X,
  UploadCloud,
  Tag,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120),
  description: z.string().min(3, "Description is required").max(1000),
  tags: z.array(z.string()).optional().default([]),
  mode: z.enum(["image", "video"]).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});
type FormVals = z.infer<typeof schema>;

const STEPS = [
  { label: "Details", icon: FileText },
  { label: "Media", icon: Image },
  { label: "Extras", icon: Tag },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = s.icon;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: active ? 1.12 : 1,
                  backgroundColor: done
                    ? "hsl(var(--primary))"
                    : active
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  borderColor: done || active
                    ? "hsl(var(--primary))"
                    : "hsl(var(--border))",
                }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "size-9 rounded-full border-2 flex items-center justify-center shadow-sm",
                  done || active
                    ? "text-[hsl(var(--primary-foreground))]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="size-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Icon className="size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-200",
                active ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))]/40"
              )}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="relative w-16 h-0.5 mx-1 mb-5">
                <div className="absolute inset-0 rounded-full bg-[hsl(var(--border))]/40" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[hsl(var(--primary))]"
                  animate={{ scaleX: i < current ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function StoryCreateModal({
  open,
  onClose,
  storyId,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  storyId?: string;
  initial?: { title?: string; description?: string; videoUrl?: string };
}) {
  const [step, setStep] = React.useState(0);
  const [images, setImages] = React.useState<File[]>([]);
  const isEdit = !!storyId;
  const createMut = useCreateStory();
  const updateMut = useUpdateStory(storyId || "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      tags: [],
      title: initial?.title || "",
      description: initial?.description || "",
      videoUrl: initial?.videoUrl || "",
      mode: initial?.videoUrl ? "video" : undefined,
    },
  });
  const mode = watch("mode");
  const titleVal = watch("title");
  const isPending = createMut.isPending || updateMut.isPending;

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const canNext = (idx: number) => {
    if (idx === 0) return !!titleVal?.trim() && !errors.title;
    if (idx === 1) return mode ? (mode === "video" ? true : images.length > 0) : false;
    return true;
  };

  const onSubmit = async (vals: FormVals) => {
    const fd = new FormData();
    fd.append("title", vals.title.trim());
    fd.append("description", vals.description?.trim() || "");
    if (Array.isArray(vals.tags) && vals.tags.length) {
      vals.tags.forEach((t) => fd.append("tags", t));
    }
    if (vals.mode === "video" && vals.videoUrl) {
      fd.append("videoUrl", vals.videoUrl);
    } else if (images.length) {
      images.forEach((f) => fd.append("images", f));
    }
    try {
      if (isEdit && storyId) {
        await updateMut.mutateAsync(fd as any);
      } else {
        await createMut.mutateAsync(fd as any);
      }
      onClose();
      try {
        const { toastSuccess } = await import("@/lib/toast");
        toastSuccess(isEdit ? "Story updated" : "Story created");
      } catch { }
    } catch { }
  };

  const inputCls = "h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/60 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30";

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="w-[min(96vw,640px)] p-0 overflow-hidden rounded-[2rem] border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/95 backdrop-blur-2xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.4)]">
        {/* shimmer line */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

        <form onSubmit={handleSubmit((vals) => onSubmit(vals as FormVals))} className="flex flex-col">
          {/* Header */}
          <div className="relative px-7 pt-7 pb-5 border-b border-[hsl(var(--border))]/30">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-8 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-[hsl(var(--primary))]" />
                  </div>
                  <h2 className="text-lg font-bold">
                    {isEdit ? "Edit Story" : "New Story"}
                  </h2>
                </div>
                <p className="text-xs text-[hsl(var(--foreground))]/50 ml-10">
                  {isEdit ? "Update your story details" : "Share something with your audience"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="size-8 rounded-xl border border-[hsl(var(--border))]/50 flex items-center justify-center text-[hsl(var(--foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/30 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <StepIndicator current={step} />
          </div>

          {/* Body */}
          <div className="px-7 py-6 min-h-[260px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/50">Title</label>
                    <input {...register("title")} placeholder="Give your story a compelling title…" className={inputCls} />
                    {errors.title && <p className="text-xs text-red-400">{String(errors.title.message)}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/50">Description</label>
                    <textarea
                      {...(register("description") as any)}
                      className={cn(inputCls, "h-auto min-h-[100px] py-3 resize-none")}
                      placeholder="What's this story about?"
                    />
                    {errors.description && <p className="text-xs text-red-400">{String(errors.description.message)}</p>}
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* Mode toggle */}
                  <div className="inline-flex rounded-2xl p-1 bg-[hsl(var(--muted))]/20 border border-[hsl(var(--border))]/40 gap-1">
                    {(["image", "video"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setValue("mode", m, { shouldValidate: true })}
                        className={cn(
                          "relative px-5 h-9 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200",
                          mode === m
                            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                            : "text-[hsl(var(--foreground))]/60 hover:text-[hsl(var(--foreground))]"
                        )}
                      >
                        {m === "image" ? <Image className="size-3.5" /> : <Video className="size-3.5" />}
                        {m === "image" ? "Images" : "Video URL"}
                      </button>
                    ))}
                  </div>

                  {mode === "image" && (
                    <div className="space-y-3">
                      <div
                        className="group rounded-2xl border-2 border-dashed border-[hsl(var(--border))]/50 hover:border-[hsl(var(--primary))]/50 bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--primary))]/5 p-8 text-center cursor-pointer transition-all"
                        onClick={() => document.getElementById("story-images-input")?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); setImages((prev) => [...prev, ...Array.from(e.dataTransfer.files || [])]); }}
                      >
                        <UploadCloud className="size-8 mx-auto mb-2 text-[hsl(var(--foreground))]/30 group-hover:text-[hsl(var(--primary))]/60 transition-colors" />
                        <p className="text-sm text-[hsl(var(--foreground))]/50 group-hover:text-[hsl(var(--foreground))]/70">Drag & drop images or <span className="text-[hsl(var(--primary))] font-medium">browse</span></p>
                        <input id="story-images-input" type="file" multiple accept="image/*" className="hidden" onChange={(e) => onFiles((e.target as HTMLInputElement).files)} aria-label="Upload images" title="Upload images" />
                      </div>
                      {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {images.map((file, idx) => {
                            const src = URL.createObjectURL(file);
                            return (
                              <div key={idx + src} className="relative group aspect-square">
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
                    </div>
                  )}
                  {mode === "video" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/50">Video URL</label>
                      <input {...register("videoUrl")} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                      {errors.videoUrl && <p className="text-xs text-red-400">{String(errors.videoUrl.message)}</p>}
                    </div>
                  )}
                  {!mode && (
                    <p className="text-xs text-[hsl(var(--foreground))]/40 text-center py-4">Select a media type above to continue</p>
                  )}
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--foreground))]/50">Tags <span className="text-[hsl(var(--foreground))]/30 normal-case">(comma separated)</span></label>
                    <input
                      onChange={(e) => setValue("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean), { shouldValidate: false })}
                      placeholder="news, update, announcement…"
                      className={inputCls}
                    />
                  </div>
                  <div className="rounded-2xl border border-[hsl(var(--border))]/30 bg-[hsl(var(--muted))]/10 p-4 space-y-2">
                    <p className="text-xs font-semibold text-[hsl(var(--foreground))]/50 uppercase tracking-wide">Summary</p>
                    <div className="text-sm space-y-1">
                      <div className="flex gap-2"><span className="text-[hsl(var(--foreground))]/40 w-20 flex-shrink-0">Title</span><span className="font-medium truncate">{watch("title") || "—"}</span></div>
                      <div className="flex gap-2"><span className="text-[hsl(var(--foreground))]/40 w-20 flex-shrink-0">Media</span><span className="font-medium capitalize">{mode ? `${mode} (${mode === "image" ? images.length + " files" : "URL"})` : "None"}</span></div>
                    </div>
                  </div>
                  <p className="text-xs text-[hsl(var(--foreground))]/40">Author will default to your account.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-[hsl(var(--border))]/30 flex items-center justify-between">
            <span className="text-[11px] text-[hsl(var(--foreground))]/35">Step {step + 1} of {STEPS.length}</span>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="h-10 px-4 rounded-2xl border border-[hsl(var(--border))]/50 text-sm font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={!canNext(step)}
                  onClick={() => canNext(step) && setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="h-10 px-5 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all overflow-hidden relative"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  Next
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
                  {isEdit ? "Update Story" : "Publish Story"}
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

