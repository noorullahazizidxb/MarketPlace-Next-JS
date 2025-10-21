"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useApiGet } from "@/lib/api-hooks";
import BlogCard from "@/components/blogs/BlogCard";
import { useAuth } from "@/lib/use-auth";
import BlogViewer from "@/components/blogs/BlogViewer";
import { useLanguage } from "@/components/providers/language-provider";
import { BlogHero } from "@/components/blogs/BlogHero";
import StoriesBar from "@/components/stories/StoriesBar";
import { HiddenListingsSlider } from "@/components/listings/HiddenListingsSlider";
import { RelatedListingsSlider } from "@/components/listings/RelatedListingsSlider";
import { useApiGet as useListingsGet } from "@/lib/api-hooks";

export default function BlogsPage() {
  const { data: blogs, isLoading } = useApiGet(["blogs"], "/blogs");
  const { data: listingsData } = useListingsGet(
    ["listings", "all"],
    "/listings"
  );
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<any | null>(null);
  const [q, setQ] = React.useState("");
  const onOpen = (blog: any) => {
    setActive(blog);
    setOpen(true);
  };
  const norm = (s: any) => (typeof s === "string" ? s.toLocaleLowerCase() : "");
  const filtered = React.useMemo(() => {
    const term = norm(q.trim());
    if (!term) return blogs || [];
    const list = blogs || [];
    return list.filter((b: any) => {
      const title = norm(b?.title);
      const desc = norm(b?.excerpt || b?.description || b?.content);
      const author = norm(
        b?.author?.fullName || b?.author?.username || b?.author?.name
      );
      return (
        title.includes(term) || desc.includes(term) || author.includes(term)
      );
    });
  }, [blogs, q]);
  return (
    <div className="space-y-6">
      <BlogHero
        value={q}
        onChange={setQ}
        canCreate={!!user}
        onCreate={() => router.push("/blogs/create")}
      />
      {/* Reused components from listings page */}
      <StoriesBar />
      {Array.isArray(listingsData) && listingsData.length > 0 && (
        <HiddenListingsSlider items={listingsData as any} />
      )}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-[hsl(var(--muted))]/10 animate-pulse"
            />
          ))}
        </div>
      )}
      {/* Row pattern: 1) two equal, 2) three equal, 3) two with left wide (2/3) + right narrow (1/3) - repeat */}
      <div className="space-y-6">
        {(() => {
          const rows: { type: "two" | "three" | "wide"; items: any[] }[] = [];
          const list = filtered || [];
          let i = 0;
          let patternIdx = 0; // 0 -> two, 1 -> three, 2 -> wide
          while (i < list.length) {
            const type =
              patternIdx === 0 ? "two" : patternIdx === 1 ? "three" : "wide";
            const take = type === "two" ? 2 : type === "three" ? 3 : 2;
            rows.push({ type: type as any, items: list.slice(i, i + take) });
            i += take;
            patternIdx = (patternIdx + 1) % 3;
          }
          return rows.map((row, idx) => {
            if (row.type === "two") {
              // two equal columns
              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {row.items.map((b: any) => (
                    <div key={b.id} className="">
                      <BlogCard
                        blog={b}
                        onOpen={onOpen}
                        variant="overlay"
                        imageHeightClass="h-64 md:h-80 lg:h-96"
                      />
                    </div>
                  ))}
                </div>
              );
            }
            if (row.type === "three") {
              // three equal columns
              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                  {row.items.map((b: any) => (
                    <div key={b.id} className="">
                      <BlogCard blog={b} onOpen={onOpen} />
                    </div>
                  ))}
                </div>
              );
            }
            // wide: left card spans 2/3, right card spans 1/3 on sm+; on small screens stack
            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {row.items.map((b: any, j: number) => (
                  <div
                    key={b.id}
                    className={j === 0 ? "sm:col-span-2" : "sm:col-span-1"}
                  >
                    <BlogCard
                      blog={b}
                      onOpen={onOpen}
                      variant={j === 0 ? "overlay" : "default"}
                      imageHeightClass={
                        j === 0 ? "h-72 md:h-[22rem] lg:h-[26rem]" : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            );
          });
        })()}
        {!isLoading && (filtered?.length ?? 0) === 0 && (
          <div className="card p-6">
            {q.trim() ? t("noResults") || "No results" : t("noBlogsYet")}
          </div>
        )}
      </div>
      {/* Related listings slider (placed before the partners section in layout) */}
      {Array.isArray(listingsData) && listingsData.length > 0 && (
        <RelatedListingsSlider currentId={0} />
      )}

      <BlogViewer open={open} blog={active} onClose={() => setOpen(false)} />
    </div>
  );
}
