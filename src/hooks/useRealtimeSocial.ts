"use client";
import { useEffect } from "react";
import { initSocket, getSocket } from "@/lib/socket";
import { mutate as swrMutate } from "swr";

type BlogUpdatedPayload = { id: string; blog: any };
type NewCommentPayload = { blogId: string; comment: any };
type CountPayload = { blogId: string; likes?: number; shares?: number };

export function useRealtimeSocial(token?: string) {
  useEffect(() => {
    const sock = initSocket(token);

    const normalizeComment = (raw: any) => {
      const authorRaw = raw?.author || raw?.user || {};
      const authorId = raw?.authorId || raw?.userId || authorRaw?.id;
      const fullName =
        authorRaw?.fullName ||
        authorRaw?.name ||
        raw?.authorName ||
        raw?.userName ||
        raw?.name ||
        "";
      const photo = authorRaw?.photo || authorRaw?.avatar || raw?.authorPhoto || raw?.userPhoto || null;
      const author = {
        id: authorId ? String(authorId) : undefined,
        fullName,
        photo,
      };
      return { ...raw, author };
    };

    const announce = (msg: string) => {
      try {
        const region =
          document.getElementById("aria-live-region") ||
          document.createElement("div");
        region.id = "aria-live-region";
        region.setAttribute("aria-live", "polite");
        region.className = "sr-only";
        region.textContent = msg;
        if (!document.getElementById("aria-live-region"))
          document.body.appendChild(region);
        setTimeout(() => (region.textContent = ""), 1200);
      } catch {}
    };

    sock.on("storyCreated", (s: any) => {
      swrMutate(["stories"], (prev: any[] = []) => {
        if (prev.find((x) => String(x.id) === String(s.id))) return prev;
        announce("New story added");
        return [s, ...prev];
      }, false);
    });

    sock.on("blogUpdated", (p: BlogUpdatedPayload | any) => {
      const b = (p as any).blog || (p as any);
      if (!b?.id) return;
      // Update list: replace if exists, otherwise prepend
      swrMutate(
        ["blogs"],
        (prev: any[] = []) => {
          const idx = prev.findIndex((x) => String(x.id) === String(b.id));
          if (idx >= 0) return prev.map((x) => (String(x.id) === String(b.id) ? { ...x, ...b } : x));
          return [b, ...prev];
        },
        false
      );
      // Update detail cache
      swrMutate(["blogs", b.id], (prev: any) => ({ ...(prev || {}), ...b }), false);
    });

    // New blog created event - replace temporary placeholder or prepend
    sock.on("blogCreated", (payload: any) => {
      const b = payload?.data || payload || {};
      if (!b?.id) return;
      swrMutate(
        ["blogs"],
        (prev: any[] = []) => {
          // If a temporary entry exists (id starts with tmp_), replace it by matching title/content or remove it
          const tmpIdx = prev.findIndex((x) => String(x.id).startsWith("tmp_") && (String(x.title) === String(b.title) || String(x.content) === String(b.content)));
          if (tmpIdx >= 0) {
            const next = [...prev];
            next[tmpIdx] = b;
            return next;
          }
          // otherwise prepend if not present
          if (!prev.find((x) => String(x.id) === String(b.id))) return [b, ...prev];
          return prev;
        },
        false
      );
      // update detail cache
      swrMutate(["blogs", b.id], b, false);
    });

    sock.on("newComment", (p: NewCommentPayload) => {
      if (!p?.blogId) return;
      const incoming = normalizeComment(p.comment);
      swrMutate(
        ["blogs", p.blogId],
        (prev: any) => {
          if (!prev) return prev;
          const exists = (prev.comments || [])
            .slice(0, 10)
            .some((c: any) => String(c.id) === String(incoming?.id) || (c.body === incoming?.body && (c.authorId || c.author?.id) === (incoming?.authorId || incoming?.author?.id)));
          if (exists) return prev;
          const next = { ...prev } as any;
          next.comments = [incoming, ...(prev.comments || [])];
          next.counts = { ...(prev.counts || {}) };
          next.counts.comments = (next.counts.comments || 0) + 1;
          return next;
        },
        false
      );
      swrMutate(
        ["blogs"],
        (prev: any[] = []) => {
          // update the list item so BlogViewer gets fresh blog object with new comment
          return prev.map((x) => {
            if (String(x.id) !== String(p.blogId)) return x;
            const seen = (x.comments || [])
              .slice(0, 10)
              .some((c: any) => String(c.id) === String(incoming?.id) || (c.body === incoming?.body && (c.authorId || c.author?.id) === (incoming?.authorId || incoming?.author?.id)));
            return {
              ...x,
              comments: seen ? x.comments : [incoming, ...(x.comments || [])],
              counts: { ...(x.counts || {}), comments: (x.counts?.comments || 0) + 1 },
            };
          });
        },
        false
      );
    });

    sock.on("newLike", (p: CountPayload) => {
      if (!p?.blogId) return;
      if (typeof p.likes === "number") {
        swrMutate(
          ["blogs"],
          (prev: any[] = []) =>
            prev.map((x) =>
              String(x.id) === String(p.blogId)
                ? { ...x, counts: { ...(x.counts || {}), likes: p.likes } }
                : x
            ),
          false
        );
        swrMutate(
          ["blogs", p.blogId],
          (b: any) => (b ? { ...b, counts: { ...(b.counts || {}), likes: p.likes } } : b),
          false
        );
      } else {
        // No authoritative count provided; revalidate to fetch canonical value instead of blind +1
        swrMutate(["blogs", p.blogId]);
        swrMutate(["blogs"]);
      }
    });

    sock.on("newShare", (p: CountPayload) => {
      if (!p?.blogId) return;
      if (typeof p.shares === "number") {
        swrMutate(
          ["blogs"],
          (prev: any[] = []) =>
            prev.map((x) =>
              String(x.id) === String(p.blogId)
                ? { ...x, counts: { ...(x.counts || {}), shares: p.shares } }
                : x
            ),
          false
        );
        swrMutate(
          ["blogs", p.blogId],
          (b: any) => (b ? { ...b, counts: { ...(b.counts || {}), shares: p.shares } } : b),
          false
        );
      } else {
        swrMutate(["blogs", p.blogId]);
        swrMutate(["blogs"]);
      }
    });

    return () => {
      try {
        getSocket()?.off("storyCreated");
        getSocket()?.off("blogUpdated");
        getSocket()?.off("newComment");
        getSocket()?.off("newLike");
        getSocket()?.off("newShare");
      } catch {}
    };
  }, [token]);
}
