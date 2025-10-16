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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { asset } from "@/lib/assets";
import { ImageSlider } from "@/components/ui/image-slider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,hsl(var(--primary)/0.2),transparent_60%),_linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/80)]" />
    <div className="p-6 sm:p-8 md:p-10 grid gap-4">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl font-extrabold tracking-tight"
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
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stories..."
          className="h-11 rounded-xl bg-[hsl(var(--input))]/20 border-[hsl(var(--border))]/60"
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
    className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--card))] shadow-[0_6px_24px_-10px_rgba(0,0,0,0.45)]"
  >
    <button type="button" onClick={onView} className="block w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <ImageSlider
        images={(s.images ?? []).filter(Boolean) as any}
        aspect="16/9"
        heightClass="h-40"
      />
    </button>
    <div className="p-4">
      <div className="flex items-center gap-2 text-xs subtle">
        <div className="size-7 rounded-full overflow-hidden bg-[hsl(var(--muted))/0.2] grid place-items-center">
          {s.user?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(s.user.photo)}
              alt={s.user.fullName || "avatar"}
              className="w-7 h-7 object-cover"
            />
          ) : (
            <div className="text-[10px] font-semibold">
              {(s.user?.fullName || "S").slice(0, 1)}
            </div>
          )}
        </div>
        <span className="font-medium">{s.user?.fullName || "System"}</span>
        {s.createdAt && <span aria-hidden>·</span>}
        {s.createdAt && (
          <time dateTime={s.createdAt}>
            {new Date(s.createdAt).toLocaleDateString()}
          </time>
        )}
        {s.status && (
          <span className="ml-auto inline-flex items-center px-2 h-6 rounded-lg text-[10px] font-semibold bg-[hsl(var(--muted))/0.35]">
            {s.status}
          </span>
        )}
      </div>
      <h3 className="mt-2 text-base font-semibold line-clamp-2">{s.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" onClick={onView} size="sm">
          View
        </Button>
        <Button variant="accent" onClick={onEdit} size="sm">
          Edit
        </Button>
        <Button
          variant="secondary"
          className="text-red-500 hover:text-red-600"
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
    <div className="space-y-6">
      <Hero
        q={q}
        setQ={setQ}
        onCreate={() => router.push("/admin/stories/create")}
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-[hsl(var(--muted))]/10 animate-pulse"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
