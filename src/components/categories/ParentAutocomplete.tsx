"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCategories } from "./useCategoryData";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "../ui/command";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ParentAutocompleteProps {
  value: number | null;
  onChange: (val: number | null) => void;
  disabledIds?: number[]; // prevent selecting itself or descendants when editing
  placeholder?: string;
}

export const ParentAutocomplete: React.FC<ParentAutocompleteProps> = ({
  value,
  onChange,
  disabledIds = [],
  placeholder,
}) => {
  const [query, setQuery] = useState("");
  const { flat, isLoading } = useCategories(query || undefined);
  const selected = flat.find((c) => c.id === value) || null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Command className="rounded-xl border bg-[hsl(var(--card))]/60">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={placeholder || "Search categories..."}
            />
            <CommandList className="max-h-64">
              <CommandEmpty>
                {isLoading ? "Loading…" : "No results"}
              </CommandEmpty>
              {flat.map((cat) => {
                const disabled = disabledIds.includes(cat.id);
                return (
                  <CommandItem
                    key={cat.id}
                    value={cat.path}
                    disabled={disabled}
                    onSelect={() => !disabled && onChange(cat.id)}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      disabled && "opacity-50"
                    )}
                  >
                    <span className="inline-flex items-center justify-center size-5 rounded-md border text-[10px] font-medium bg-[hsl(var(--muted))/0.4]">
                      {cat.depth + 1}
                    </span>
                    <span className="flex-1 truncate">{cat.path}</span>
                    {value === cat.id && (
                      <Check className="size-4 text-[hsl(var(--accent))]" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </div>
        {value != null && (
          <button
            onClick={() => onChange(null)}
            className="size-8 rounded-lg border inline-flex items-center justify-center hover:bg-[hsl(var(--muted))/0.4]"
            aria-label="Clear parent"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {selected && <p className="text-2xs subtle">Selected: {selected.path}</p>}
    </div>
  );
};
