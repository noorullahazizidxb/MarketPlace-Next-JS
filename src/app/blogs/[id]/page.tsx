"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiGet, useApiMutation } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, roles } = useAuth();
  const { data: blog, isLoading } = useApiGet(["blogs", id], `/blogs/${id}`);
  const isAuthor =
    !!user && (blog?.author?.id === user?.id || blog?.userId === user?.id);
  const canDelete = isAuthor || (roles || []).includes("ADMIN");
  const del = useApiMutation("delete", `/blogs/${id}`);
  const addComment = useApiMutation("post", `/blogs/${id}/comments`);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const onEdit = () => {
    if (!blog) return;
    const params = new URLSearchParams();
    params.set("id", String(blog.id));
    if (blog.title) params.set("title", blog.title);
    if (blog.content) params.set("content", blog.content);
    router.push(`/blogs/create?${params.toString()}`);
  };
  const onDelete = async () => {
    try {
      await del.mutateAsync({} as any);
    } catch { }
    try {
      const { getSocket } = await import("@/lib/socket");
      getSocket()?.emit?.("blogDeleted", { id });
    } catch { }
    setConfirmOpen(false);
    router.push("/blogs");
  };
  const [comment, setComment] = React.useState("");
  const onPostComment = async () => {
    if (!user) return;
    if (!comment.trim()) return;
    try {
      await addComment.mutateAsync({ body: comment.trim() });
      setComment("");
    } catch { }
  };

  const { t } = useLanguage();
  if (isLoading) return <div className="p-6">{t("loading")}</div>;
  if (!blog) return <div className="p-6">{t("blogNotFound")}</div>;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="heading-xl">{blog.title}</h1>
            <p className="prose prose-invert leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>
          </div>
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Button variant="accent" onClick={onEdit}>
                {t("edit")}
              </Button>
              {canDelete && (
                <Button
                  variant="secondary"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setConfirmOpen(true)}
                >
                  {t("delete")}
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="space-y-3">
        <h3 className="font-semibold">{t("blogCommentsTitle")}</h3>
        {user ? (
          <div className="flex items-center gap-2">
            <input
              className="input flex-1"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("blogCommentsPlaceholder")}
              aria-label={t("blogCommentsPlaceholder")}
            />
            <button className="btn" onClick={onPostComment}>
              {t("post")}
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 px-4 py-3 text-sm text-[hsl(var(--foreground))/0.76]">
            {t("signInToComment")}
          </div>
        )}
        <div className="space-y-2">
          {blog.comments?.map((c: any) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/5"
            >
              <div className="text-sm font-medium">
                {c.author?.name || "Anon"}
              </div>
              <div className="text-sm">{c.body}</div>
            </div>
          ))}
        </div>
      </section>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("blogDeleteConfirmTitle")}
        description={t("blogDeleteConfirmBody")}
        confirmLabel={t("delete")}
        tone="danger"
        onConfirm={onDelete}
      />
    </div>
  );
}
