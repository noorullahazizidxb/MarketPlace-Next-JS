"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import React from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  action,
  isLoading,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("p-5 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium tracking-wide text-[hsl(var(--foreground))]/90">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--foreground))]/50">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="relative min-h-[180px] flex-1">
        {isLoading && (
          <div className="absolute inset-0 grid place-items-center bg-[hsl(var(--card))]/40 backdrop-blur-sm rounded-xl">
            <Loader2 className="size-5 animate-spin text-[hsl(var(--primary))]" />
          </div>
        )}
        {children}
      </div>
    </Card>
  );
}
