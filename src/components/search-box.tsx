"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSWRGet } from "@/lib/api-hooks";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type SearchHit = any;
type SearchResponse = { total: number; hits: SearchHit[] };

type Props = {
  className?: string;
  placeholder?: string;
  perPage?: number;
  onSubmitNavigate?: boolean; // when true, pressing Enter navigates to /listings?search=...
  onSubmitClose?: () => void; // optional callback to close a surrounding dialog/modal after submit
};

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function SearchBox({
  className,
  placeholder = "Search",
  perPage = 5,
  onSubmitNavigate = true,
  onSubmitClose,
}: Props) {
  const [q, setQ] = useState("");
  const debounced = useDebounced(q, 350);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Construct absolute URL to ensure requests go to backend, not Next.js local API
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const searchURL = (apiBase ? apiBase.replace(/\/$/, "") : "") + "/search";

  // Always send the request to backend (requirement), even if q is empty
  const page = 1;
  const { data, isLoading } = useSWRGet<SearchResponse>(
    ["search", debounced, page, perPage],
    searchURL,
    { q: debounced, page, perPage },
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const hits = data?.hits ?? [];

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="glass rounded-2xl px-3 h-10 flex items-center gap-2">
        <svg
          className="size-4 text-foreground/60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="bg-transparent outline-none text-sm w-40 sm:w-56"
          placeholder={placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmitNavigate) {
              const qp = new URLSearchParams();
              if (q) qp.set("search", q);
              router.push(`/listings?${qp.toString()}`);
              setOpen(false);
              try {
                onSubmitClose?.();
              } catch {}
            }
          }}
          aria-label="Search"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 p-3 mt-2 z-50 rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-xl">
          <div className="p-2 text-xs subtle flex items-center justify-between">
            <span>
              {isLoading
                ? "Searching..."
                : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
            </span>
            <span>Press Enter to view all</span>
          </div>
          {hits.length > 0 && (
            <ul className="max-h-72 overflow-auto divide-y divide-[hsl(var(--border))]/60">
              {hits.map((h: any, idx: number) => (
                <li key={h.id ?? idx} className="hover:bg-[hsl(var(--muted))]">
                  <button
                    type="button"
                    className="w-full  [border-radius:0.75rem] last:mb-0 text-left px-3 py-2 text-sm"
                    onClick={() => {
                      const qp = new URLSearchParams();
                      if (h.id) {
                        qp.set("id", String(h.id));
                      } else if (h.title) {
                        qp.set("search", h.title);
                      } else if (q) {
                        qp.set("search", q);
                      }
                      router.push(`/listings?${qp.toString()}`);
                      setOpen(false);
                      try {
                        onSubmitClose?.();
                      } catch {}
                    }}
                  >
                    <div className="font-medium line-clamp-1">
                      {h.title ?? "Untitled"}
                    </div>
                    {h.description && (
                      <div className="text-xs subtle line-clamp-1">
                        {h.description}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
