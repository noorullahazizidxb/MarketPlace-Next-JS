"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ImageSlider } from "@/components/ui/image-slider";
import CommentsInline from "./CommentsInline";
import { Portal } from "@/components/ui/portal";
import { useApiGet } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";

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
  const { user, roles } = useAuth();
  const router = useRouter();
  const isAuthor =
    !!user &&
    source &&
    (source.author?.id === user.id || source.userId === user.id);
  const canDelete = isAuthor || (roles || []).includes("ADMIN");
  const del = useApiMutation(
    "delete",
    source ? `/blogs/${source.id}` : "/blogs/__noop__"
  );
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const onEdit = () => {
    if (!source) return;
    const params = new URLSearchParams();
    params.set("id", String(source.id));
    if (source.title) params.set("title", source.title);
    if (source.content) params.set("content", source.content);
    router.push(`/blogs/create?${params.toString()}`);
  };
  const onDelete = async () => {
    if (!source) return;
    try {
      await del.mutateAsync({} as any);
    } catch {}
    try {
      const { getSocket } = await import("@/lib/socket");
      getSocket()?.emit?.("blogDeleted", { id: source.id });
    } catch {}
    setConfirmOpen(false);
  };
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
                {isAuthor && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="accent" size="sm" onClick={onEdit}>
                      Edit
                    </Button>
                    {canDelete && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setConfirmOpen(true)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
                <CommentsInline
                  blogId={String(source?.id)}
                  comments={source?.comments}
                />
              </div>
              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete blog?"
                description="This will permanently remove the blog and its images."
                confirmLabel="Delete"
                tone="danger"
                onConfirm={onDelete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
