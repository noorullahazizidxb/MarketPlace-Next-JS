"use client";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
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
  mode?: "dropdown" | "sheet"; // sheet = inline results occupy vertical space
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
  mode = "dropdown",
}: Props) {
  const [q, setQ] = useState("");
  const debounced = useDebounced(q, 350);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  // Load recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recent-searches");
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const pushRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecent((prev) => {
      const next = [
        term.trim(),
        ...prev.filter((x) => x !== term.trim()),
      ].slice(0, 8);
      try {
        localStorage.setItem("recent-searches", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

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

  useLayoutEffect(() => {
    const update = () => {
      const el = boxRef.current;
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      setRect(r);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);
  const popupRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const el = popupRef.current;
    if (!el || !rect) return;
    // set absolute positioning via DOM to avoid JSX inline style lint
    el.style.position = "fixed";
    el.style.top = `${Math.round(rect.bottom + 8)}px`;
    el.style.left = `${Math.round(rect.left)}px`;
    el.style.width = `${Math.round(rect.width)}px`;
    el.style.zIndex = "1200";
  }, [rect, open]);

  const hits = data?.hits ?? [];

  const highlight = (text: string): JSX.Element => {
    if (!debounced || debounced.length < 2) return <>{text}</>;
    try {
      const parts = text.split(
        new RegExp(
          `(${debounced.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
          "ig"
        )
      );
      return (
        <>
          {parts.map((p, i) =>
            p.toLowerCase() === debounced.toLowerCase() ? (
              <mark
                key={i}
                className="bg-[hsl(var(--accent))/0.35] text-[hsl(var(--accent))] rounded px-0.5"
              >
                {p}
              </mark>
            ) : (
              <span key={i}>{p}</span>
            )
          )}
        </>
      );
    } catch {
      return <>{text}</>;
    }
  };

  const isSheet = mode === "sheet";

  return (
    <div
      ref={boxRef}
      className={cn(isSheet ? "flex flex-col h-full" : "relative", className)}
    >
      <div className="glass rounded-2xl px-3 h-12 flex items-center gap-3">
        <svg
          className="size-5 text-foreground/60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={cn(
            "bg-transparent outline-none text-sm flex-1 min-w-0",
            isSheet ? "w-full" : "w-40 sm:w-56"
          )}
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
              router.push(`/listings?${qp.toString()}#listings`);
              pushRecent(q);
              setOpen(false);
              try {
                onSubmitClose?.();
              } catch {}
            }
          }}
          aria-label="Search"
        />
      </div>
      {/* Inline sheet mode results */}
      {isSheet && open && (
        <div className="mt-4 flex-1 min-h-0 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm p-3 flex flex-col shadow-[0_4px_24px_-6px_rgba(0,0,0,0.4)] z-[1200] overflow-visible">
          {recent.length > 0 && q.length === 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setQ(r);
                    const qp = new URLSearchParams();
                    qp.set("search", r);
                    router.push(`/listings?${qp.toString()}#listings`);
                    pushRecent(r);
                    setOpen(false);
                    try {
                      onSubmitClose?.();
                    } catch {}
                  }}
                  className="px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-xs hover:bg-[hsl(var(--accent))/0.3]"
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => {
                  setRecent([]);
                  try {
                    localStorage.removeItem("recent-searches");
                  } catch {}
                }}
                className="ml-auto text-[10px] px-2 py-1 rounded-md bg-[hsl(var(--background))/0.06] hover:bg-[hsl(var(--foreground))/0.08]"
              >
                Clear
              </button>
            </div>
          )}
          <div className="p-2 text-xs subtle flex items-center justify-between">
            <span>
              {isLoading
                ? "Searching..."
                : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
            </span>
            <span>Press Enter to view all</span>
          </div>
          {hits.length > 0 && (
            <ul className="overflow-auto divide-y divide-[hsl(var(--border))]/60 flex-1 min-h-0">
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
                      router.push(`/listings?${qp.toString()}#listings`);
                      setOpen(false);
                      try {
                        onSubmitClose?.();
                      } catch {}
                    }}
                  >
                    <div className="font-medium line-clamp-1">
                      {highlight(h.title ?? "Untitled")}
                    </div>
                    {h.description && (
                      <div className="text-xs subtle line-clamp-1">
                        {highlight(h.description)}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Dropdown mode popover results */}
      {!isSheet &&
        open &&
        (() => {
          // Build dropdown content
          const content = (
            <div
              ref={popupRef}
              className="p-5 rounded-2xl overflow-visible border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-xl max-h-[60vh] flex flex-col"
            >
              {recent.length > 0 && q.length === 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setQ(r);
                        const qp = new URLSearchParams();
                        qp.set("search", r);
                        router.push(`/listings?${qp.toString()}#listings`);
                        pushRecent(r);
                        setOpen(false);
                        try {
                          onSubmitClose?.();
                        } catch {}
                      }}
                      className="px-3 py-1 rounded-full bg-[hsl(var(--muted))] text-xs hover:bg-[hsl(var(--accent))/0.3]"
                    >
                      {r}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setRecent([]);
                      try {
                        localStorage.removeItem("recent-searches");
                      } catch {}
                    }}
                    className="ml-auto text-[10px] px-2 py-1 rounded-md bg-[hsl(var(--background))/0.06] hover:bg-[hsl(var(--foreground))/0.08]"
                  >
                    Clear
                  </button>
                </div>
              )}
              <div className="p-2 text-xs subtle flex items-center justify-between">
                <span>
                  {isLoading
                    ? "Searching..."
                    : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
                </span>
                <span>Press Enter to view all</span>
              </div>
              {hits.length > 0 && (
                <ul className="overflow-auto divide-y divide-[hsl(var(--border))]/60 flex-1 min-h-0">
                  {hits.map((h: any, idx: number) => (
                    <li
                      key={h.id ?? idx}
                      className="hover:bg-[hsl(var(--muted))]"
                    >
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
                          router.push(`/listings?${qp.toString()}#listings`);
                          setOpen(false);
                          try {
                            onSubmitClose?.();
                          } catch {}
                        }}
                      >
                        <div className="font-medium line-clamp-1">
                          {highlight(h.title ?? "Untitled")}
                        </div>
                        {h.description && (
                          <div className="text-xs subtle line-clamp-1">
                            {highlight(h.description)}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );

          // If we have a rect (client) render via portal with fixed positioning to avoid stacking context clipping
          if (rect && typeof document !== "undefined") {
            return createPortal(content, document.body);
          }

          // Fallback: render inline absolutely positioned (original behavior)
          return (
            <div className="absolute left-0 right-0 p-3 mt-2 z-[1200] rounded-2xl overflow-visible border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-xl max-h-[60vh] flex flex-col">
              {content}
            </div>
          );
        })()}
    </div>
  );
}
