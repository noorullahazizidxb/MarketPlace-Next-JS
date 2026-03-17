"use client";
import React, { useState, useMemo } from "react";
import { useCategories } from "./useCategoryData";
import { CategoryRow } from "./CategoryRow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryCreateWizard } from "./CategoryCreateWizard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  onChanged?: () => void;
}

export const CategoriesTable: React.FC<Props> = ({ onChanged }) => {
  const [query, setQuery] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const { flat, isLoading, reload } = useCategories();
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return flat;
    return flat.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [flat, query]);

  const refresh = () => {
    reload();
    onChanged?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-64"
          />
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="inline-flex items-center gap-1">
              <Plus className="size-4" /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <h3 className="text-sm font-semibold mb-4">Create Category</h3>
            <CategoryCreateWizard
              onCreated={refresh}
              onClose={() => setOpenCreate(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {isLoading && <p className="text-xs subtle">Loading categories…</p>}
        <AnimatePresence initial={false}>
          {filtered.map((node) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <CategoryRow node={node} depth={node.depth} onChanged={refresh} />
            </motion.div>
          ))}
        </AnimatePresence>
        {!isLoading && filtered.length === 0 && (
          <p className="text-xs subtle">No categories match that search.</p>
        )}
      </div>
    </div>
  );
};
