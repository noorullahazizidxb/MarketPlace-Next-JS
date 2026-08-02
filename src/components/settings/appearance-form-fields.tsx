"use client";

import type { ReactNode } from "react";
import type { Control } from "react-hook-form";
import type { ThemeMode } from "@repo/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/atoms/shadcn/form";
import { RadioGroupItem } from "@/components/ui/atoms/shadcn/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/shadcn/select";
import type { AppearanceFormValues } from "@/components/settings/appearance-settings-config";

export function ThemePreviewCard({
  value,
  title,
  previewClassName,
}: {
  value: ThemeMode;
  title: string;
  previewClassName: string;
}) {
  return (
    <FormItem>
      <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
        <FormControl>
          <RadioGroupItem value={value} className="sr-only" />
        </FormControl>
        <div className="rounded-md border-2 border-muted p-4 transition-colors hover:border-accent">
          <div className="space-y-2">
            <div className={`h-20 w-20 rounded-md border p-3 ${previewClassName}`}>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-foreground/25" />
                <div className="h-2 w-1/2 rounded bg-foreground/35" />
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground/35" />
                  <div className="h-2 flex-1 rounded bg-foreground/25" />
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground/45" />
                  <div className="h-2 flex-1 rounded bg-foreground/35" />
                </div>
              </div>
            </div>
            <span className="app-text-body">{title}</span>
          </div>
        </div>
      </FormLabel>
    </FormItem>
  );
}
type AppearanceSelectFieldName =
  | "fontFamily"
  | "fontFamilyEn"
  | "fontFamilyFa"
  | "fontFamilyAr"
  | "fontFamilyTr"
  | "headingTextDecoration"
  | "sidebarWidth"
  | "contentWidth";

export function AppearanceSelectField({
  control,
  name,
  label,
  icon,
  placeholder,
  options,
}: {
  control: Control<AppearanceFormValues>;
  name: AppearanceSelectFieldName;
  label: string;
  icon: ReactNode;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1.5">
            {icon}
            {label}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
