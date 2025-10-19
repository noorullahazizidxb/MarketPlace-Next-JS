"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ads/switch";
import { PlacementSelect } from "@/components/ads/placement-select";
import { useApiMutation } from "@/lib/api-hooks";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import Image from "next/image";

type AdPlacement =
  | "HOME_PAGE_1ST"
  | "HOME_PAGE_2ND"
  | "HOME_PAGE_3RD"
  | "DETAIL_PAGE_1ST"
  | "DETAIL_PAGE_2ND"
  | "DETAIL_PAGE_SIDEBAR";

interface AdEntity {
  id: number;
  title: string;
  body?: string | null;
  imageUrl?: string | null;
  placement: AdPlacement;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function timeAgo(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString();
}

export default function AdCard({
  ad,
  onUpdated,
  onEdit,
}: {
  ad: AdEntity;
  onUpdated?: () => void;
  onEdit?: (ad: AdEntity) => void;
}) {
  const putMutation = useApiMutation<any>("put", `/ads/${ad.id}`);
  const patchMutation = useApiMutation<any>("put", `/ads/${ad.id}`);
  const deleteMutation = useApiMutation<any>("delete", `/ads/${ad.id}`);
  const [localPlacement, setLocalPlacement] = React.useState<AdPlacement>(
    ad.placement
  );
  const [localActive, setLocalActive] = React.useState<boolean>(ad.isActive);

  const handlePlacement = async (p: AdPlacement) => {
    try {
      await patchMutation.mutateAsync({ placement: p });
      setLocalPlacement(p);
      onUpdated?.();
    } catch {}
  };

  const handleToggle = async (v: boolean) => {
    try {
      await patchMutation.mutateAsync({ isActive: v });
      setLocalActive(v);
      onUpdated?.();
    } catch {}
  };

  const handleDelete = async () => {
    // older flow replaced by confirm modal
    try {
      await deleteMutation.mutateAsync(undefined);
      onUpdated?.();
    } catch {}
  };

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmAndDelete = async () => {
    try {
      await deleteMutation.mutateAsync(undefined);
      setConfirmOpen(false);
      onUpdated?.();
    } catch (e) {
      // swallow - callers handle errors elsewhere
      setConfirmOpen(false);
    }
  };

  return (
    <Card className="relative group overflow-hidden p-0 flex flex-col border border-white/10 hover:border-primary/40 transition-colors">
      <div className="relative h-40 w-full bg-gradient-to-br from-black/30 to-black/60 flex items-center justify-center overflow-hidden">
        {ad.imageUrl ? (
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              priority={false}
            />
          </div>
        ) : (
          <ImageIcon className="size-10 text-white/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-full text-[10px] font-medium tracking-wide bg-black/40 backdrop-blur-md border border-white/10 text-white/80">
            {localPlacement.replace(/_/g, " ")}
          </span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-[10px] font-medium tracking-wide backdrop-blur-md border text-white/80",
              localActive
                ? "bg-emerald-500/20 border-emerald-400/30"
                : "bg-red-500/20 border-red-400/30"
            )}
          >
            {localActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight line-clamp-1 pr-6">
            {ad.title}
          </h3>
          {ad.body && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {ad.body}
            </p>
          )}
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Created {timeAgo(ad.createdAt)}</span>
            <span>Updated {timeAgo(ad.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <PlacementSelect
              value={localPlacement}
              onChange={(p: AdPlacement) => handlePlacement(p)}
              size="sm"
            />
            <Switch
              checked={localActive}
              onCheckedChange={(v: boolean) => handleToggle(v)}
              aria-label="Toggle active"
            />
            <div className="flex items-center gap-1 ml-auto">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2"
                aria-label="Edit ad"
                onClick={() => onEdit?.(ad)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-red-400 hover:text-red-300"
                aria-label="Delete ad"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <h3 className="text-lg font-semibold">Delete ad</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Delete this ad? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => confirmAndDelete()}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
