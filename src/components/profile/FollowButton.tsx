"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import { useAuth } from "@/lib/use-auth";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";

export default function FollowButton({
  targetId,
  initialFollowing = false,
}: {
  targetId: string;
  initialFollowing?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);
  const followMut = useApiMutation("get", `/users/${targetId}/follow`);
  const { user } = useAuth();

  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <button
        disabled={busy}
        onClick={async () => {
          const next = !following;
          setFollowing(next);
          try {
            setBusy(true);
            const me = {
              id: user?.id ?? "me",
              fullName: (user as any)?.fullName || (user as any)?.name || "You",
              photo: (user as any)?.photo || null,
            };
            mutate(
              ["users", targetId],
              (prev: any) => {
                if (!prev) return prev;
                const nextObj = { ...(prev || {}) };
                nextObj.followers = Array.isArray(nextObj.followers)
                  ? [...nextObj.followers]
                  : [];
                const exists = nextObj.followers.some(
                  (f: any) => String(f.id) === String(me.id)
                );
                if (next && !exists) {
                  nextObj.followers = [me, ...nextObj.followers];
                } else if (!next && exists) {
                  nextObj.followers = nextObj.followers.filter(
                    (f: any) => String(f.id) !== String(me.id)
                  );
                }
                return nextObj;
              },
              false
            );
            await followMut.mutateAsync({});
            mutate(["users", targetId]);
          } catch {
            setFollowing(!next);
            mutate(["users", targetId]);
          } finally {
            setBusy(false);
          }
        }}
        className={`
          relative inline-flex items-center gap-2 px-5 h-10 rounded-2xl text-sm font-semibold
          border transition-all duration-300 overflow-hidden
          disabled:opacity-60 disabled:cursor-not-allowed
          ${following
            ? "bg-[hsl(var(--muted))]/30 border-[hsl(var(--border))]/60 text-[hsl(var(--foreground))]/80 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            : "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]/50 text-[hsl(var(--primary-foreground))] shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.5)] hover:shadow-[0_6px_28px_-4px_hsl(var(--primary)/0.6)] hover:brightness-110"
          }
        `}
      >
        {/* shimmer */}
        {!following && (
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        <AnimatePresence mode="wait">
          {busy ? (
            <motion.span key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Loader2 className="size-4 animate-spin" />
            </motion.span>
          ) : following ? (
            <motion.span key="following" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
              <UserCheck className="size-4" />
              Following
            </motion.span>
          ) : (
            <motion.span key="follow" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Follow
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}


