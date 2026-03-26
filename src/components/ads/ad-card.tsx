"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ads/switch";
import { PlacementSelect } from "@/components/ads/placement-select";
import { useApiMutation } from "@/lib/api-hooks";
import { ImageSpinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Pencil,
  Trash2,
  Image as ImageIcon,
  Clock,
  MapPin,
  Activity,
} from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
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

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const handlePlacement = async (p: AdPlacement) => {
    try {
      await patchMutation.mutateAsync({ placement: p });
      setLocalPlacement(p);
      onUpdated?.();
    } catch { }
  };

  const handleToggle = async (v: boolean) => {
    try {
      await patchMutation.mutateAsync({ isActive: v });
      setLocalActive(v);
      onUpdated?.();
    } catch { }
  };

  const handleDelete = async () => {
    // older flow replaced by confirm modal
    try {
      await deleteMutation.mutateAsync(undefined);
      onUpdated?.();
    } catch { }
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
    <Card className="relative group overflow-hidden p-0 flex flex-col border border-[hsl(var(--border))]/60 hover:border-[hsl(var(--accent))]/40 hover:shadow-[0_8px_32px_-8px_hsl(var(--accent)/0.25)] transition-all duration-300 bg-[hsl(var(--card))]">
      {/* Image area */}
      <div className="relative h-44 w-full bg-gradient-to-br from-[hsl(var(--muted))]/30 to-[hsl(var(--muted))]/10 flex items-center justify-center overflow-hidden">
        {ad.imageUrl ? (
          <>
            {!imgLoaded && <ImageSpinner />}
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              className={cn("object-cover transition-all duration-500", imgLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0")}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority={false}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[hsl(var(--muted-foreground))]/40">
            <ImageIcon className="size-10" />
            <span className="text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))]/80 via-transparent to-transparent" />
        {/* Status badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[hsl(var(--card))]/80 backdrop-blur-md border border-[hsl(var(--border))]/40 text-[hsl(var(--foreground))]/80">
            {localPlacement.replace(/_/g, " ")}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md border",
              localActive
                ? "bg-[hsl(var(--accent))]/15 border-[hsl(var(--accent))]/40 text-[hsl(var(--accent))]"
                : "bg-[hsl(var(--muted))]/30 border-[hsl(var(--muted-foreground))]/20 text-[hsl(var(--muted-foreground))]"
            )}
          >
            <span className={cn("size-1.5 rounded-full", localActive ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted-foreground))]/50")} />
            {localActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-4">
        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-[hsl(var(--foreground))]">
            {ad.title}
          </h3>
          {ad.body && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
              {ad.body}
            </p>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]/70 gap-2">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {timeAgo(ad.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Activity className="size-3" />
            Updated {timeAgo(ad.updatedAt)}
          </span>
        </div>

        {/* Controls */}
        <div className="mt-auto pt-3 border-t border-[hsl(var(--border))]/50 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <PlacementSelect
              value={localPlacement}
              onChange={(p: AdPlacement) => handlePlacement(p)}
              size="sm"
            />
          </div>
          <Switch
            checked={localActive}
            onCheckedChange={(v: boolean) => handleToggle(v)}
            aria-label="Toggle active state"
          />
          <div className="flex items-center gap-1">
            <Tooltip content="Edit ad" side="top">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-lg hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
                aria-label="Edit ad"
                onClick={() => onEdit?.(ad)}
              >
                <Pencil className="size-3.5" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete ad" side="top">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                aria-label="Delete ad"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>Delete Ad</DialogTitle>
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
