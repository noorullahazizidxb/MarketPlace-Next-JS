"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useStories,
  useStoriesSocket,
  useDeleteStory,
} from "@/lib/stories-hooks";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { Badge } from "@/components/ui/atoms/shadcn/badge";
import { Search } from "lucide-react";
import { asset } from "@/lib/assets";
import { ImageSlider } from "@/components/ui/image-slider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Image from "next/image";

type Story = {
  id: string;
  title: string;
  description?: string;
  images?: Array<{ url?: string | null } | string | null>;
  videoUrl?: string | null;
  user?: { id?: string; fullName?: string; photo?: string | null };
  createdAt?: string;
  status?: "PUBLISHED" | "DRAFT";
};

const Hero: React.FC<{
  q: string;
  setQ: (s: string) => void;
  onCreate: () => void;
}> = ({ q, setQ, onCreate }) => (
  <div className="relative overflow-hidden rounded-3xl border border-[var(--border)]">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,color-mix(in oklab, var(--primary) 20%, transparent),transparent_60%),_linear-gradient(to_bottom_right,var(--card),color-mix(in oklab, var(--card) 80%, transparent))]" />
    <div className="p-[var(--space-card)] sm:p-[var(--space-card)] md:p-[var(--space-card)] grid gap-[var(--space-gap)]">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="app-text-h2 sm:app-text-h1 font-extrabold tracking-tight"
      >
        Admin Stories
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="subtle"
      >
        Manage, review, and publish stories with a modern workflow.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34 }}
        className="flex items-center gap-2"
      >
        <TextInputField
          label="Search stories"
          value={q}
          onChange={setQ}
          icon={<Search className="size-4" />}
          className="h-11 rounded-xl bg-[var(--input)]/20 border-[var(--border)]/60"
        />
        <Button variant="accent" onClick={onCreate}>
          + Create Story
        </Button>
      </motion.div>
    </div>
  </div>
);

const StoryCard: React.FC<{
  s: Story;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}> = ({ s, onEdit, onDelete, onView }) => (
  <motion.article
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
    className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)] shadow-token-lg"
  >
    <button
      type="button"
      onClick={onView}
      className="block w-full"
      aria-label={`View story ${s.title}`}
    >
      <ImageSlider
        images={(s.images ?? []).filter(Boolean) as any}
        aspect="16/9"
        heightClass="h-80"
      />
    </button>
    <div className="p-[var(--space-card)]">
      <div className="flex items-center gap-2 app-text-caption subtle">
        <Link
          href={s.user?.id ? `/profile/${s.user.id}` : "#"}
          onClick={(e) => {
            if (!s.user?.id) e.preventDefault();
          }}
          className="flex items-center gap-2"
        >
          <div className="size-7 rounded-full overflow-hidden bg-[color-mix(in oklab, var(--muted) 20%, transparent)] grid place-items-center">
            {s.user?.photo ? (
              <Image
                src={asset(s.user.photo)}
                alt={s.user.fullName || "avatar"}
                width={28}
                height={28}
                className="size-7 object-cover"
              />
            ) : (
              <div className="app-text-micro font-semibold">
                {(s.user?.fullName || "S").slice(0, 1)}
              </div>
            )}
          </div>
          <span className="font-medium">{s.user?.fullName || "System"}</span>
        </Link>
        {s.createdAt && <span aria-hidden>·</span>}
        {s.createdAt && (
          <time dateTime={s.createdAt}>
            {new Date(s.createdAt).toLocaleDateString()}
          </time>
        )}
        {s.status && (
          <Badge variant="muted" className="ml-auto normal-case tracking-normal">
            {s.status}
          </Badge>
        )}
      </div>
      <h3 className="mt-2 app-text-body font-semibold line-clamp-2">{s.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" onClick={onView} size="sm">
          View
        </Button>
        <Button variant="accent" onClick={onEdit} size="sm">
          Edit
        </Button>
        <Button
          variant="secondary"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  </motion.article>
);

function useAdminGate() {
  const { roles } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!roles?.includes("ADMIN")) router.replace("/sign-in");
  }, [roles, router]);
  return roles?.includes("ADMIN");
}

export default function AdminStoriesIndexPage() {
  const isAdmin = useAdminGate();
  const [q, setQ] = React.useState("");
  const router = useRouter();
  // React Query + Socket realtime
  const { data, isLoading } = useStories();
  useStoriesSocket(true);
  const items = React.useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return q.trim()
      ? list.filter((s) => s.title?.toLowerCase().includes(q.toLowerCase()))
      : list;
  }, [data, q]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-[var(--space-section)] app-shell-page" data-app-page="admin-stories">
      <Hero
        q={q}
        setQ={setQ}
        onCreate={() => router.push("/admin/stories/create")}
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-section)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-[var(--muted)]/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-section)]"
        >
          <AnimatePresence>
            {items.map((s) => (
              <StoryRow key={s.id} story={s} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function StoryRow({ story }: { story: Story }) {
  const router = useRouter();
  const del = useDeleteStory(story.id);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const onDelete = () => setConfirmOpen(true);
  const onEdit = () => {
    // Navigate to multi-step form with initial values via query params or state
    const qp = new URLSearchParams();
    qp.set("id", story.id);
    if (story.title) qp.set("title", story.title);
    if (story.description) qp.set("description", story.description);
    if (story.videoUrl || "") qp.set("videoUrl", String(story.videoUrl || ""));
    router.push(`/admin/stories/create?${qp.toString()}`);
  };
  return (
    <>
      <StoryCard
        s={story}
        onView={() => {}}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete story?"
        description="This will remove the story permanently."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={async () => {
          await del.mutateAsync({} as any);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
