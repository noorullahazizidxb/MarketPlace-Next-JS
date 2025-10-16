"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axiosClient";
import { initSocket, getSocket } from "./socket";
import { useAuth } from "./use-auth";

// Minimal Story shape per spec
export type Story = {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  videoUrl?: string | null;
  createdAt?: string;
  user?: { id: string; fullName?: string; photo?: string | null };
};

// Query keys
export const qk = {
  stories: ["stories"] as const,
  story: (id: string) => ["stories", id] as const,
};

// GET list
export function useStories() {
  return useQuery({
    queryKey: qk.stories,
    queryFn: () => api.get<Story[]>("/stories"),
    staleTime: 30_000,
  });
}

// GET single
export function useStory(id?: string) {
  return useQuery({
    queryKey: id ? qk.story(id) : ["stories", null],
    enabled: !!id,
    queryFn: () => api.get<Story>(`/stories/${id}`),
  });
}

// POST /stories — optimistic prepend
export function useCreateStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.post<Story>("/stories", body),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: qk.stories });
      const prev = qc.getQueryData<Story[]>(qk.stories) || [];
      const tempId = `tmp_${Date.now()}`;
      const optimistic: Story = {
        id: tempId,
        title: (vars?.get ? vars.get("title") : vars?.title) ?? "Untitled",
        description: (vars?.get ? vars.get("description") : vars?.description) ?? "",
        images: [],
        videoUrl: vars?.get ? (vars.get("videoUrl") || null) : vars?.videoUrl ?? null,
        createdAt: new Date().toISOString(),
        user: undefined,
      };
      qc.setQueryData<Story[]>(qk.stories, [optimistic, ...prev]);
      return { prev, tempId } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(qk.stories, ctx.prev);
    },
    onSuccess: (server, _vars, ctx) => {
      // Replace optimistic with server
      qc.setQueryData<Story[]>(qk.stories, (list = []) => {
        if (!ctx) return [server, ...list];
        return list.map((s) => (s.id === ctx.tempId ? server : s));
      });
      if (server?.id) qc.setQueryData(qk.story(server.id), server);
    },
  });
}

// PUT /stories/:id — optimistic patch
export function useUpdateStory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: any) => api.put<Story>(`/stories/${id}`, body),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: qk.stories });
      await qc.cancelQueries({ queryKey: qk.story(id) });
      const prevList = qc.getQueryData<Story[]>(qk.stories) || [];
      const prevDetail = qc.getQueryData<Story>(qk.story(id));
      const patch: Partial<Story> = {
        title: vars?.title ?? (vars?.get ? vars.get("title") : undefined),
        description: vars?.description ?? (vars?.get ? vars.get("description") : undefined),
        videoUrl: (vars?.get ? vars.get("videoUrl") : vars?.videoUrl) ?? undefined,
      };
      qc.setQueryData<Story[]>(qk.stories, prevList.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      if (prevDetail) qc.setQueryData<Story>(qk.story(id), { ...prevDetail, ...patch });
      return { prevList, prevDetail } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData(qk.stories, ctx.prevList);
      qc.setQueryData(qk.story(id), ctx.prevDetail);
    },
    onSuccess: (server) => {
      if (!server) return;
      qc.setQueryData<Story[]>(qk.stories, (list = []) => list.map((s) => (s.id === server.id ? { ...s, ...server } : s)));
      qc.setQueryData<Story>(qk.story(id), (cur) => ({ ...(cur || {} as any), ...server }));
    },
  });
}

// DELETE /stories/:id — optimistic remove
export function useDeleteStory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete<unknown>(`/stories/${id}`),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.stories });
      const prevList = qc.getQueryData<Story[]>(qk.stories) || [];
      qc.setQueryData<Story[]>(qk.stories, prevList.filter((s) => s.id !== id));
      return { prevList } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(qk.stories, ctx.prevList);
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: qk.story(id) });
    },
  });
}

// Socket hook: attach events and reconcile cache
export function useStoriesSocket(enabled = true) {
  const { token } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled || !token) return;
    const sock = initSocket(token);

    const onCreated = (payload: Story) => {
      qc.setQueryData<Story[]>(qk.stories, (prev = []) => {
        if (!payload?.id) return prev;
        if (prev.some((s) => s.id === payload.id)) return prev;
        return [payload, ...prev];
      });
      if (payload?.id) qc.setQueryData(qk.story(payload.id), payload);
    };
    const onUpdated = (payload: { id: string; story: Partial<Story> }) => {
      if (!payload?.id) return;
      qc.setQueryData<Story[]>(qk.stories, (prev = []) => prev.map((s) => (s.id === payload.id ? { ...s, ...(payload.story || {}) } : s)));
      qc.setQueryData<Story>(qk.story(payload.id), (cur) => ({ ...(cur || {} as any), ...(payload.story || {}) }));
    };
    const onDeleted = (payload: { id: string }) => {
      if (!payload?.id) return;
      qc.setQueryData<Story[]>(qk.stories, (prev = []) => prev.filter((s) => s.id !== payload.id));
      qc.removeQueries({ queryKey: qk.story(payload.id) });
    };

    sock.on("storyCreated", onCreated);
    sock.on("storyUpdated", onUpdated as any);
    sock.on("storyDeleted", onDeleted as any);

    return () => {
      try {
        sock.off("storyCreated", onCreated as any);
        sock.off("storyUpdated", onUpdated as any);
        sock.off("storyDeleted", onDeleted as any);
      } catch {}
    };
  }, [enabled, token, qc]);
}

// Generic socket accessor hook if needed by components
export function useSocket() {
  const { token } = useAuth();
  const socket = useMemo(() => (token ? initSocket(token) : getSocket()), [token]);
  return socket;
}
