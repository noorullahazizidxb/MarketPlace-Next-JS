"use client";

import * as React from "react";
import { CalendarIcon, Clock3, X } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (nextValue: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  withTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fromYear?: number;
  toYear?: number;
  className?: string;
  buttonClassName?: string;
  timeLabel?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const toTimeValue = (d?: Date) =>
  d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "";

const formatTriggerLabel = (d: Date | undefined, withTime: boolean) => {
  if (!d) return "";
  const datePart = new Intl.DateTimeFormat("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(d);
  if (!withTime) return datePart;
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  return `${datePart}  ${timePart}`;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  withTime = false,
  minDate,
  maxDate,
  fromYear,
  toYear,
  className,
  buttonClassName,
  timeLabel = "Time",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const minBoundary = React.useMemo(() => {
    if (!minDate) return undefined;
    const d = new Date(minDate); d.setHours(0, 0, 0, 0); return d;
  }, [minDate]);

  const maxBoundary = React.useMemo(() => {
    if (!maxDate) return undefined;
    const d = new Date(maxDate); d.setHours(23, 59, 59, 999); return d;
  }, [maxDate]);

  const disabledMatcher = React.useMemo(() => {
    const rules: Matcher[] = [];
    if (minBoundary) rules.push({ before: minBoundary });
    if (maxBoundary) rules.push({ after: maxBoundary });
    return rules.length ? rules : undefined;
  }, [minBoundary, maxBoundary]);

  const mergeDateWithTime = React.useCallback(
    (selected: Date) => {
      if (!withTime) return selected;
      const merged = new Date(selected);
      if (value) merged.setHours(value.getHours(), value.getMinutes(), 0, 0);
      else merged.setHours(0, 0, 0, 0);
      return merged;
    },
    [value, withTime],
  );

  const handleDateSelect = React.useCallback(
    (d: Date | undefined) => {
      if (!d) { onChange?.(undefined); if (!withTime) setOpen(false); return; }
      onChange?.(mergeDateWithTime(d));
      if (!withTime) setOpen(false);
    },
    [mergeDateWithTime, onChange, withTime],
  );

  const handleTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [h, m] = e.target.value.split(":");
      const hours = Number(h); const minutes = Number(m);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
      const next = value ? new Date(value) : new Date();
      next.setHours(hours, minutes, 0, 0);
      onChange?.(next);
    },
    [onChange, value],
  );

  const hasValue = Boolean(value);
  const triggerLabel = value ? formatTriggerLabel(value, withTime) : "";

  return (
    <div className={cn("space-y-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Floating-label trigger — matches TextInputField pattern exactly */}
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "group relative w-full rounded-xl border bg-background text-left",
              "shadow-sm outline-none transition-all duration-200",
              "px-4 pb-2 pt-5",
              "border-border/60 hover:border-border",
              "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-1",
              "disabled:cursor-not-allowed disabled:opacity-60",
              buttonClassName,
            )}
          >
            {/* Calendar icon */}
            <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-foreground">
              <CalendarIcon className="app-icon-sm" aria-hidden />
            </span>

            {/* Floating label */}
            <span
              className={cn(
                "pointer-events-none absolute start-10 transition-all duration-200",
                hasValue
                  ? "top-1.5 app-text-heading-sm text-foreground/70"
                  : "top-1/2 -translate-y-1/2 text-muted-foreground",
              )}
              style={{ fontSize: hasValue
                  ? "var(--text-label)"
                  : "var(--text-body)" }}
            >
              {placeholder}
            </span>

            {/* Value */}
            <span
              className={cn(
                "block truncate ps-6 app-text-label text-foreground",
                !hasValue && "opacity-0 select-none",
              )}
            >
              {triggerLabel || placeholder}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto rounded-2xl border-border/60 p-0 shadow-xl">
          <div className="overflow-hidden rounded-2xl bg-popover">
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleDateSelect}
                disabled={disabledMatcher}
                fromYear={fromYear}
                toYear={toYear}
                autoFocus
              />
            </div>

            {/* Time picker section */}
            {withTime && (
              <div className="border-t border-border/50 bg-muted/20 px-4 py-3 space-y-2">
                <Label
                  className="inline-flex items-center gap-1.5 app-text-caption uppercase tracking-wide text-muted-foreground"
                >
                  <Clock3 className="app-icon-xs" />
                  {timeLabel}
                </Label>
                <Input
                  type="time"
                  value={toTimeValue(value)}
                  onChange={handleTimeChange}
                  className="rounded-xl border-border/60 focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </div>
            )}

            {/* Reset */}
            {hasValue && (
              <div className="border-t border-border/50 px-3 pb-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-muted-foreground hover:text-destructive"
                  onClick={() => { onChange?.(undefined); setOpen(false); }}
                >
                  <X className="app-icon-xs" aria-hidden />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}