"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/lib/api-hooks";
import { mutate } from "swr";
import { useAuth } from "@/lib/use-auth";

export default function FollowButton({
  targetId,
  initialFollowing = false,
}: {
  targetId: string;
  initialFollowing?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);
  const label = following ? "Following" : "Follow";
  const followMut = useApiMutation("get", `/users/${targetId}/follow`);
  const { user } = useAuth();

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
      <Button
        disabled={busy}
        variant={following ? "secondary" : "primary"}
        className="min-w-[120px] h-10 rounded-xl"
        onClick={async () => {
          const next = !following;
          // optimistic UI
          setFollowing(next);
          try {
            setBusy(true);
            // optimistic mutate: add/remove current user in followers array
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

            const res: any = await followMut.mutateAsync({});
            // revalidate from server to ensure canonical state
            mutate(["users", targetId]);
          } catch (err) {
            // rollback visual state on error
            setFollowing(!next);
            mutate(["users", targetId]);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "…" : label}
      </Button>
    </motion.div>
  );
}
