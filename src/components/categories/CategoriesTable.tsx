"use client";
import React, { useState, useMemo } from "react";
import { useCategories } from "./useCategoryData";
import { CategoryRow } from "./CategoryRow";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atoms/shadcn/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/shadcn/dialog";
import { Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryCreateWizard } from "./CategoryCreateWizard";

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
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [flat, query]);

  const refresh = () => {
    reload();
    onChanged?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="w-64 max-w-full">
          <TextInputField
            label="Search categories"
            value={query}
            onChange={setQuery}
            icon={<Search className="size-4" />}
          />
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="inline-flex items-center gap-1">
              <Plus className="size-4" /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl md:w-[min(92vw,36rem)] lg:w-[min(92vw,36rem)] xl:w-[min(92vw,36rem)]">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <CategoryCreateWizard
              onCreated={refresh}
              onClose={() => setOpenCreate(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {isLoading && <p className="text-xs subtle">Loading categories…</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {filtered.map((node) => (
                <TableRow key={node.id} className="hover:bg-transparent border-0">
                  <TableCell className="p-0 pb-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CategoryRow
                        node={node}
                        depth={node.depth}
                        onChanged={refresh}
                      />
                    </motion.div>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {!isLoading && filtered.length === 0 && (
          <p className="text-xs subtle">No categories match that search.</p>
        )}
      </div>
    </div>
  );
};
