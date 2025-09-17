"use client";
import { useState, useMemo } from "react";
import { usePendingListings } from "@/lib/use-pending-listings";
import { useApiMutation } from "@/lib/api-hooks";
import { ApprovalCard } from "@/components/approval-card";
import { Button } from "@/components/ui/button";

export default function PendingsPageClient() {
  const { listings, loading, error, refresh, connected } = usePendingListings();
  const emitAll = useApiMutation("post", "/listings/for-approval/emit-all");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return listings.filter((l: any) => {
      const byQ =
        !ql ||
        [l.title, l.description, l.user?.name, l.user?.email]
          .filter(Boolean)
          .some((s) => String(s).toLowerCase().includes(ql));
      const byCat = category === "all" || l.category?.name === category;
      return byQ && byCat;
    });
  }, [listings, q, category]);

  return (
    <div className="min-h-screen p-6">
      <div className="glass rounded-2xl p-6 border border-[hsl(var(--border))] w-full max-w-8xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Pending Approvals</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs subtle mr-3">
              Socket: {connected ? "connected" : "disconnected"}
            </span>
            <Button onClick={refresh} className="mr-2">
              Refresh
            </Button>
            <Button
              onClick={() => emitAll.mutate({})}
              disabled={emitAll.isPending}
              title="Admin-only manual broadcast trigger"
            >
              Emit All
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pending listings..."
            className="h-10 rounded-xl px-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
          />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="h-10 rounded-xl px-3 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
          >
            <option value="all">All categories</option>
            {Array.from(
              new Set(
                listings.map((l: any) => l.category?.name).filter(Boolean)
              )
            ).map((c: any) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {loading && <div className="subtle">Loading pending listings…</div>}
          {error && (
            <div className="text-red-400">Failed to load pending listings</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="subtle">No pending listings at the moment.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {filtered.map((l: any) => (
              <ApprovalCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
