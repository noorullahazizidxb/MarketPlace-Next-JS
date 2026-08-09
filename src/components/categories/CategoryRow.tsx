"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { CategoryTreeNode, CategoryEntity } from "./types";
import { cn } from "@/lib/cn";
import { useUpdateCategory, useDeleteCategory } from "./useCategoryData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/atoms/shadcn/switch";
import { Badge } from "@/components/ui/atoms/shadcn/badge";
import Image from "next/image";
import { asset } from "@/lib/assets";

interface CategoryRowProps {
  node: CategoryTreeNode;
  onChanged: () => void;
  depth: number;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  node,
  onChanged,
  depth,
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const update = useUpdateCategory(node.id, onChanged);
  const del = useDeleteCategory(node.id, onChanged);

  return (
    <div className="border rounded-xl bg-[var(--card)]/70 backdrop-blur divide-y">
      <div className="flex items-center gap-3 p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={open ? "Collapse" : "Expand"}
          onClick={toggle}
          className="size-8 p-0 rounded-lg border"
        >
          <motion.span animate={{ rotate: open ? 90 : 0 }}>
            <ChevronRight className="size-4" />
          </motion.span>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/** Indentation using utility classes mapping */}
            <span
              className={cn(
                "font-medium app-text-body truncate",
                [
                  "",
                  "pl-2",
                  "pl-4",
                  "pl-6",
                  "pl-8",
                  "pl-10",
                  "pl-12",
                  "pl-14",
                  "pl-16",
                ][depth] || "pl-16"
              )}
            >
              {node.name}
            </span>
            {!node.isActive && (
              <Badge variant="warning" className="normal-case tracking-normal">
                Inactive
              </Badge>
            )}
          </div>
          <p className="app-text-micro subtle">/{node.slug}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 app-text-micro">
          <span>{node.children?.length ?? 0} sub</span>
          <span>{node.listings?.length ?? 0} listings</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={node.isActive}
            onCheckedChange={(v: boolean) => update.submit({ isActive: v })}
            aria-label="Toggle active"
          />
          <Button
            size="sm"
            variant="ghost"
            aria-label="Edit"
            className="size-9 p-0"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Delete"
            onClick={() => del.remove()}
            className="size-9 p-0"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6 bg-[color-mix(in oklab, var(--muted) 25%, transparent)]">
              {/* Listings preview */}
              {(node.listings?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <p className="app-text-micro font-semibold uppercase tracking-wide">
                    Listings ({node.listings?.length})
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {node.listings?.slice(0, 6).map((ls) => (
                      <div
                        key={ls.id}
                        className="rounded-xl border p-3 space-y-2 bg-[var(--card)]/70"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex -space-x-2">
                            {ls.images?.slice(0, 2).map((im) => (
                              <div
                                key={im.id}
                                className="size-10 rounded-lg overflow-hidden border"
                              >
                                <Image
                                  src={asset(im.url)}
                                  alt={im.alt || "img"}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="app-text-caption font-medium truncate">
                              {ls.title}
                            </p>
                            <p className="app-text-micro subtle">
                              {ls.status || "—"}{" "}
                              {ls.price != null && <span>· ${ls.price}</span>}
                            </p>
                          </div>
                        </div>
                        {ls.representatives &&
                          ls.representatives.length > 0 && (
                            <p className="app-text-micro subtle">
                              Reps:{" "}
                              {ls.representatives
                                .map((r) => r.representative?.fullName)
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Children categories */}
              {(node.children?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <p className="app-text-micro font-semibold uppercase tracking-wide">
                    Sub Categories ({node.children?.length})
                  </p>
                  <div className="space-y-2">
                    {node.children?.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 p-2 rounded-lg border bg-[var(--card)]/60"
                      >
                        <span className="app-text-caption font-medium flex-1 truncate">
                          {c.name}
                        </span>
                        <span className="app-text-micro subtle">/{c.slug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
