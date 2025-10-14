"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters")
    .max(120),
  description: z.string().min(3, "Description is required").max(1000),
  tags: z.array(z.string()).optional().default([]),
  mode: z.enum(["image", "video"]).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});
type FormVals = z.infer<typeof schema>;

export default function StoryCreateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = React.useState(0);
  const [images, setImages] = React.useState<File[]>([]);
  const post = useApiMutation("post", "/stories");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { tags: [] },
  });
  const mode = watch("mode");

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const onSubmit = async (vals: FormVals) => {
    // Build multipart form-data for backend requirements
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
      await post.mutateAsync(
        fd as any,
        {
          headers: { "Content-Type": "multipart/form-data" },
        } as any
      );
      await mutate(["stories"]);
      onClose();
      try {
        const { toastSuccess } = await import("@/lib/toast");
        toastSuccess("Story created");
      } catch {}
    } catch {}
  };

  const canNext = (idx: number) => {
    if (idx === 0) return !!watch("title") && !errors.title;
    if (idx === 1)
      return mode ? (mode === "video" ? true : images.length > 0) : false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="w-[min(96vw,860px)] p-0 overflow-hidden">
        <form
          onSubmit={handleSubmit((vals) => onSubmit(vals as FormVals))}
          className="flex flex-col h-[min(80vh,720px)]"
        >
          <div className="px-6 py-4 border-b border-[hsl(var(--border))] backdrop-blur bg-[hsl(var(--card))]/80">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Story</h2>
              <div className="text-2xs subtle">Step {step + 1} / 3</div>
            </div>
            <div className="mt-3 h-2 w-full rounded bg-[hsl(var(--muted))/0.35] overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${((step + 1) / 3) * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="h-full bg-gradient-to-r from-[hsl(var(--accent))] via-blue-400 to-fuchsia-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      {...register("title")}
                      placeholder="Amazing story…"
                    />
                    {errors.title && (
                      <p className="text-2xs text-red-500">
                        {String(errors.title.message)}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      {...(register("description") as any)}
                      className="w-full min-h-[120px] rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--input))]/20 px-3 py-2"
                      placeholder="Tell a short description"
                    />
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={mode === "image" ? "accent" : "secondary"}
                      onClick={() =>
                        setValue("mode", "image", { shouldValidate: true })
                      }
                    >
                      Images
                    </Button>
                    <Button
                      type="button"
                      variant={mode === "video" ? "accent" : "secondary"}
                      onClick={() =>
                        setValue("mode", "video", { shouldValidate: true })
                      }
                    >
                      Video
                    </Button>
                  </div>
                  {mode === "image" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Upload Images
                      </label>
                      <div
                        className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.2] p-6 text-center cursor-pointer"
                        onClick={() =>
                          document.getElementById("story-images-input")?.click()
                        }
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setImages((prev) => [
                            ...prev,
                            ...Array.from(e.dataTransfer.files || []),
                          ]);
                        }}
                      >
                        Drag & drop images here, or click to browse
                        <input
                          id="story-images-input"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            onFiles((e.target as HTMLInputElement).files)
                          }
                          aria-label="Upload images"
                          title="Upload images"
                        />
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
                    </div>
                  )}
                  {mode === "video" && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Video URL</label>
                      <Input
                        {...register("videoUrl")}
                        placeholder="https://..."
                      />
                      {errors.videoUrl && (
                        <p className="text-2xs text-red-500">
                          {String(errors.videoUrl.message)}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Tags (comma separated)
                    </label>
                    <Input
                      onChange={(e) =>
                        setValue(
                          "tags",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                          { shouldValidate: false }
                        )
                      }
                      placeholder="news, update, release"
                    />
                  </div>
                  <div className="sm:col-span-2 text-2xs subtle">
                    Author will default to the current user.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 flex items-center justify-between">
            <div className="text-2xs subtle">Use arrows to navigate</div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button
                  type="button"
                  variant="accent"
                  onClick={() =>
                    canNext(step) && setStep((s) => Math.min(2, s + 1))
                  }
                  disabled={!canNext(step)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="primary">
                  Publish
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
