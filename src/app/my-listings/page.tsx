"use client";

import { useMemo, useState } from "react";
import { ListingCard, type Listing } from "@/components/ui/listing-card";
import { useAuthStore } from "@/store/auth.store";
import { useListingsStore } from "@/store/listings.store";
import { useApiMutation } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { RefreshCw, PencilLine, Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toastError, toastInfo, toastSuccess } from "@/lib/toast";
// minimal classnames merger
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MyListingsPage() {
  const session = useAuthStore((s) => s.session);

  const items: Listing[] = useMemo(() => {
    const u = session?.user ?? {};
    return Array.isArray(u.listings) ? u.listings : [];
  }, [session?.user]);

  if (!session) return <p className="subtle">Loading session…</p>;

  return (
    <div className="space-y-4">
      <h2 className="heading-xl">My listings</h2>
      <div className="card p-4">
        {items.length === 0 ? (
          <p className="subtle">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ListingWithActions key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingWithActions({ listing }: { listing: Listing }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setListings = useListingsStore((s) => s.set);
  const profileFetch = useApiMutation<any>("get", "/auth/profile");
  const renewMutation = useApiMutation<any>("post", `/renew/redeem`);
  const deleteMutation = useApiMutation<any>(
    "delete",
    `/listings/${listing.id}`
  );
  const [hover, setHover] = useState(false);

  const refreshProfile = async () => {
    try {
      const r = await profileFetch.mutateAsync(undefined as any);
      const body = (r as any)?.data ?? r;
      const user = body?.user ?? body?.data?.user ?? body;
      const listings =
        user?.listings || body?.listings || body?.data?.listings || [];
      setUser(user || null);
      setListings(Array.isArray(listings) ? listings : []);
    } catch (e) {
      console.warn("Failed to refresh profile", e);
    }
  };
  const authToken = useAuthStore((s) => s.session?.token);

  const onRenew = async () => {
    try {
      const tokens = Array.isArray((listing as any)?.renewTokens)
        ? (listing as any).renewTokens
        : [];
      if (tokens.length === 0) {
        toastInfo("No renew tokens available for this listing.");
        return;
      }
      const sorted = tokens
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
        );
      const chosen = sorted[0];
      const tokenValue = chosen?.token;
      if (!tokenValue) {
        toastError("No valid token found.");
        return;
      }
      try {
        if (authToken) {
          const mod = await import("@/lib/axiosClient");
          mod.setCachedToken(authToken);
        }
      } catch {}
      await renewMutation.mutateAsync({ token: tokenValue });
      await refreshProfile();
      toastSuccess("Listing renewed successfully");
    } catch (e) {
      console.warn("Renew failed", e);
      toastError("Renew failed: " + String((e as any)?.message || e));
    }
  };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const onDelete = async () => setConfirmOpen(true);
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(undefined as any);
      await refreshProfile();
      toastSuccess("Listing deleted");
    } catch (e) {
      toastError("Failed to delete listing");
    }
  };

  return (
    <div
      className="relative group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur overflow-hidden shadow-sm hover:shadow-lg transition-all"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute inset-x-2 top-2 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionButton
          onClick={onRenew}
          icon={RefreshCw}
          label="Renew"
          loading={renewMutation.isPending}
          variant="accent"
        />
        <ActionButton
          onClick={() => {
            try {
              const url = `/listings/create?edit=${encodeURIComponent(
                String(listing.id)
              )}`;
              window.location.href = url;
            } catch {}
          }}
          icon={PencilLine}
          label="Edit"
        />
        <ActionButton
          onClick={onDelete}
          icon={Trash2}
          label="Delete"
          loading={deleteMutation.isPending}
          variant="destructive"
        />
      </div>
      <div className={cn("transition-all", hover ? "scale-[1.015]" : "")}>
        <ListingCard listing={listing} />
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete listing"
        description="This action cannot be undone. The listing will be permanently removed."
        tone="danger"
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          await confirmDelete();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  loading,
  disabled,
  variant = "default",
}: {
  onClick?: () => void;
  icon: any;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "accent" | "destructive";
}) {
  const base =
    "inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-medium shadow-sm border backdrop-blur transition-all disabled:opacity-50";
  const variants: Record<string, string> = {
    default:
      "bg-[hsl(var(--background))]/70 border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/40",
    accent:
      "bg-[hsl(var(--accent))]/20 border-[hsl(var(--accent))]/40 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/30",
    destructive:
      "bg-red-500/15 border-red-500/30 text-red-500 hover:bg-red-500/25",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(base, variants[variant])}
    >
      {loading ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <Icon className="size-3" />
      )}
      <span>{label}</span>
    </button>
  );
}
