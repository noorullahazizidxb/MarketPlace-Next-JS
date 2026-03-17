"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit & { token?: string }) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init?.headers as any) };
  if (init?.token) headers["Authorization"] = init.token.startsWith("Bearer ") ? init.token : `Bearer ${init.token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  let json: any = undefined;
  try { json = text ? JSON.parse(text) : undefined; } catch {}
  if (!res.ok) {
    const message = json?.message || text || `Request failed: ${res.status}`;
    throw { status: res.status, message } as { status: number; message: string };
  }
  return json as T;
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: any, token?: string) => request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}), token }),
  put: <T>(path: string, body?: any, token?: string) => request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}), token }),
};

// Sketch types per spec
export type User = { id: string; fullName?: string; photo?: string };
export type Story = { id: string; title: string; description: string; videoUrl?: string | null; createdAt: string; userId: string; user?: User; images?: Array<{ id?: number; url: string; position?: number; alt?: string }>; };
export type BlogComment = { id: number; body: string; authorId: string; author?: User; createdAt: string; tempId?: string; pending?: boolean };
export type Blog = { id: string; title: string; content: string; images?: string[]; likes: number; shares: number; authorId: string; author?: User; createdAt: string; updatedAt: string; comments?: BlogComment[] };

// React Query hooks (token injection from a higher auth hook recommended)
export function useStories(token?: string) {
  return useQuery({ queryKey: ["stories"], queryFn: () => api.get<Story[]>("/api/stories", token), staleTime: 10_000 });
}
export function useBlogs(token?: string) {
  return useQuery({ queryKey: ["blogs"], queryFn: () => api.get<Blog[]>("/api/blogs", token), staleTime: 10_000 });
}
export function useBlog(id?: string, token?: string) {
  return useQuery({ queryKey: ["blog", id], enabled: !!id, queryFn: () => api.get<Blog>(`/api/blogs/${id}`, token) });
}

export function useCreateBlog(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Blog>) => api.post<Blog>(`/api/blogs`, body, token),
    onSuccess: (b) => {
      qc.setQueryData<Blog[]>(["blogs"], (prev = []) => [b, ...prev]);
    },
  });
}
export function useUpdateBlog(id: string, token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Blog>) => api.put<Blog>(`/api/blogs/${id}`, body, token),
    onSuccess: (b) => {
      qc.setQueryData<Blog[]>(["blogs"], (prev = []) => prev.map((x) => (x.id === b.id ? { ...x, ...b } : x)));
      qc.setQueryData<Blog>(["blog", id], (prev) => ({ ...(prev || {} as any), ...b }));
    },
  });
}

export function useLike(blogId: string, token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<Blog>(`/api/blogs/${blogId}/likes`, {}, token),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["blogs"] });
      await qc.cancelQueries({ queryKey: ["blog", blogId] });
      const prevList = qc.getQueryData<Blog[]>(["blogs"]) || [];
      const prevDetail = qc.getQueryData<Blog>(["blog", blogId]);
      qc.setQueryData<Blog[]>(["blogs"], (list = []) => list.map((b) => (b.id === blogId ? { ...b, likes: (b.likes ?? 0) + 1 } : b)));
      qc.setQueryData<Blog>(["blog", blogId], (b) => (b ? { ...b, likes: (b.likes ?? 0) + 1 } : b));
      return { prevList, prevDetail } as const;
    },
    onError: (_err, _v, ctx) => {
      qc.setQueryData(["blogs"], ctx?.prevList);
      qc.setQueryData(["blog", blogId], ctx?.prevDetail);
    },
    onSuccess: (server) => {
      if (!server) return;
      qc.setQueryData<Blog[]>(["blogs"], (list = []) => list.map((b) => (b.id === blogId ? { ...b, likes: server.likes } : b)));
      qc.setQueryData<Blog>(["blog", blogId], (b) => (b ? { ...b, likes: server.likes } : b));
    },
  });
}

export function useShare(blogId: string, token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<Blog>(`/api/blogs/${blogId}/shares`, {}, token),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["blogs"] });
      await qc.cancelQueries({ queryKey: ["blog", blogId] });
      const prevList = qc.getQueryData<Blog[]>(["blogs"]) || [];
      const prevDetail = qc.getQueryData<Blog>(["blog", blogId]);
      qc.setQueryData<Blog[]>(["blogs"], (list = []) => list.map((b) => (b.id === blogId ? { ...b, shares: (b.shares ?? 0) + 1 } : b)));
      qc.setQueryData<Blog>(["blog", blogId], (b) => (b ? { ...b, shares: (b.shares ?? 0) + 1 } : b));
      return { prevList, prevDetail } as const;
    },
    onError: (_err, _v, ctx) => {
      qc.setQueryData(["blogs"], ctx?.prevList);
      qc.setQueryData(["blog", blogId], ctx?.prevDetail);
    },
    onSuccess: (server) => {
      if (!server) return;
      qc.setQueryData<Blog[]>(["blogs"], (list = []) => list.map((b) => (b.id === blogId ? { ...b, shares: server.shares } : b)));
      qc.setQueryData<Blog>(["blog", blogId], (b) => (b ? { ...b, shares: server.shares } : b));
    },
  });
}

export function useAddComment(blogId: string, token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { body: string }) => api.post<BlogComment>(`/api/blogs/${blogId}/comments`, body, token),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["blog", blogId] });
      const prevDetail = qc.getQueryData<Blog>(["blog", blogId]);
      const temp: BlogComment = {
        id: -1,
        tempId: `tmp_${Date.now()}`,
        body: vars.body,
        authorId: "me",
        author: prevDetail?.author, // assume self
        createdAt: new Date().toISOString(),
        pending: true,
      };
      qc.setQueryData<Blog>(["blog", blogId], (b) =>
        b ? { ...b, comments: [temp, ...(b.comments || [])] } : b
      );
      // also bump list comment counter
      qc.setQueryData<Blog[]>(["blogs"], (list = []) => list.map((x) => (x.id === blogId ? { ...x, comments: [{ id: -1, body: "", authorId: "" } as any, ...(x.comments || [])] } : x)));
      return { prevDetail, tempId: temp.tempId } as const;
    },
    onError: (_err, _v, ctx) => {
      qc.setQueryData<Blog>(["blog", blogId], ctx?.prevDetail);
    },
    onSuccess: (server, _vars, ctx) => {
      // replace temp with server comment by tempId
      qc.setQueryData<Blog>(["blog", blogId], (b) => {
        if (!b) return b;
        const next = { ...b } as Blog;
        next.comments = (next.comments || []).map((c) => (c.tempId && c.tempId === ctx?.tempId ? { ...server } : c));
        return next;
      });
    },
  });
}
