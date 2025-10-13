export interface Story {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  videoUrl?: string | null;
  author?: { id: string; name?: string; avatarUrl?: string | null };
  createdAt?: string;
}

export interface BlogSummary {
  id: string;
  title: string;
  excerpt?: string;
  author?: { id: string; name?: string; avatarUrl?: string | null };
  createdAt?: string;
  counts?: { likes: number; comments: number; shares: number };
}

export interface BlogDetail extends BlogSummary {
  content?: string;
  updatedAt?: string;
}

export interface CommentItem {
  id: string;
  blogId: string;
  author?: { id: string; name?: string; avatarUrl?: string | null };
  body: string;
  createdAt?: string;
}
