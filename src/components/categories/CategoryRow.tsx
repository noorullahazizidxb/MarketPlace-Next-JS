"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { CategoryTreeNode, CategoryEntity } from "./types";
import { cn } from "@/lib/cn";
import { useUpdateCategory, useDeleteCategory } from "./useCategoryData";
import { Button } from "@/components/ui/button";
import { Switch } from "../ui/switch";
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
    <div className="border rounded-xl bg-[hsl(var(--card))]/70 backdrop-blur divide-y">
      <div className="flex items-center gap-3 p-3">
        <button
          aria-label={open ? "Collapse" : "Expand"}
          onClick={toggle}
          className="size-8 rounded-lg border inline-flex items-center justify-center hover:bg-[hsl(var(--muted))/0.4]"
        >
          <motion.span animate={{ rotate: open ? 90 : 0 }}>
            <ChevronRight className="size-4" />
          </motion.span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/** Indentation using utility classes mapping */}
            <span
              className={cn(
                "font-medium text-sm truncate",
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
              <span className="text-2xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600">
                Inactive
              </span>
            )}
          </div>
          <p className="text-2xs subtle">/{node.slug}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-2xs">
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
            <Trash2 className="size-4 text-red-500" />
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
            <div className="p-4 space-y-6 bg-[hsl(var(--muted))/0.25]">
              {/* Listings preview */}
              {(node.listings?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <p className="text-2xs font-semibold uppercase tracking-wide">
                    Listings ({node.listings?.length})
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {node.listings?.slice(0, 6).map((ls) => (
                      <div
                        key={ls.id}
                        className="rounded-xl border p-3 space-y-2 bg-[hsl(var(--card))]/70"
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
                            <p className="text-xs font-medium truncate">
                              {ls.title}
                            </p>
                            <p className="text-2xs subtle">
                              {ls.status || "—"}{" "}
                              {ls.price != null && <span>· ${ls.price}</span>}
                            </p>
                          </div>
                        </div>
                        {ls.representatives &&
                          ls.representatives.length > 0 && (
                            <p className="text-[10px] subtle">
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
                  <p className="text-2xs font-semibold uppercase tracking-wide">
                    Sub Categories ({node.children?.length})
                  </p>
                  <div className="space-y-2">
                    {node.children?.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 p-2 rounded-lg border bg-[hsl(var(--card))]/60"
                      >
                        <span className="text-xs font-medium flex-1 truncate">
                          {c.name}
                        </span>
                        <span className="text-2xs subtle">/{c.slug}</span>
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
