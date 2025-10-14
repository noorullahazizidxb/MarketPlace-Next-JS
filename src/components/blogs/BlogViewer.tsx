"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ImageSlider } from "@/components/ui/image-slider";
import CommentsInline from "./CommentsInline";
import { Portal } from "@/components/ui/portal";
import { useApiGet } from "@/lib/api-hooks";

export default function BlogViewer({
  open,
  blog,
  onClose,
}: {
  open: boolean;
  blog: any | null;
  onClose: () => void;
}) {
  const blogId = blog ? String(blog.id) : "";
  // Fetch detail if we don't already have comments; avoids redundant GET immediately after local socket update
  const shouldFetch =
    !!blogId && !(blog?.comments && Array.isArray(blog.comments));
  const { data: liveBlog } = useApiGet<any>(
    shouldFetch ? ["blogs", blogId] : null,
    shouldFetch ? `/blogs/${blogId}` : ""
  );
  const source = liveBlog || blog;
  const images = Array.isArray(source?.images)
    ? source?.images.map((u: any) => ({
        url: typeof u === "string" ? u : u?.url,
        alt: source?.title,
      }))
    : source?.image
    ? [{ url: source.image, alt: source?.title }]
    : [];
  return (
    <Portal>
      <AnimatePresence>
        {open && blog && (
          <motion.div
            className="fixed inset-0 z-[60] overflow-hidden flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label={source?.title}
              className="relative w-[min(960px,92vw)] max-h-[90vh] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] z-[61]"
              initial={{ scale: 0.98, opacity: 0.98 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-[hsl(var(--border))]">
                <div className="line-clamp-1 font-semibold">
                  {source?.title}
                </div>
                <button
                  className="icon-btn"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4 max-h-[calc(90vh-64px)] overflow-y-auto">
                <ImageSlider images={images} aspect="16/9" />
                {source?.content && (
                  <p className="text-sm text-[hsl(var(--foreground))]/85 whitespace-pre-line">
                    {source.content}
                  </p>
                )}
                <CommentsInline
                  blogId={String(source?.id)}
                  comments={source?.comments}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
