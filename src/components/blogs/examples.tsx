"use client";
import React from "react";
import { useBlogs, useBlog, useLike, useShare, useAddComment } from "@/lib/api";

export function BlogCardExample({ token }: { token?: string }) {
  const { data = [] } = useBlogs(token);
  return (
    <div className="grid gap-3">
      {data.map((b) => (
        <BlogRow
          key={b.id}
          blogId={b.id}
          token={token}
          title={b.title}
          likes={b.likes}
          shares={b.shares}
        />
      ))}
    </div>
  );
}

function BlogRow({
  blogId,
  token,
  title,
  likes,
  shares,
}: {
  blogId: string;
  token?: string;
  title: string;
  likes: number;
  shares: number;
}) {
  const like = useLike(blogId, token);
  const share = useShare(blogId, token);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">{title}</div>
      <button className="btn" onClick={() => like.mutate()} aria-label="Like">
        ❤️ {likes}
      </button>
      <button className="btn" onClick={() => share.mutate()} aria-label="Share">
        🔗 {shares}
      </button>
    </div>
  );
}

export function BlogDetailExample({
  id,
  token,
}: {
  id: string;
  token?: string;
}) {
  const { data } = useBlog(id, token);
  const addComment = useAddComment(id, token);
  const [v, setV] = React.useState("");
  if (!data) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold">{data.title}</h3>
      <p className="opacity-80">{data.content}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!v.trim()) return;
          addComment.mutate({ body: v.trim() });
          setV("");
        }}
        className="flex gap-2 mt-3"
      >
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="input flex-1"
          placeholder="Write a comment"
          aria-label="Comment"
        />
        <button className="btn" type="submit">
          Post
        </button>
      </form>
      <ul className="mt-3 space-y-2">
        {(data.comments || []).map((c) => (
          <li key={c.tempId || c.id} className="text-sm">
            <span className="opacity-70">
              {c.author?.fullName || "Anonymous"}:
            </span>{" "}
            {c.body}{" "}
            {c.pending ? <em className="opacity-60">(sending...)</em> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
