"use client";

import { useMemo, useState } from "react";
import { Check, Clock3 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

interface TimePickerProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const isValidTime = (v?: string) => Boolean(v && /^\d{2}:\d{2}$/.test(v));
const getParts = (v?: string) => {
  if (!isValidTime(v)) return { hour: "00", minute: "00" };
  const [h = "00", m = "00"] = v!.split(":");
  return { hour: h, minute: m };
};

// ── Column ────────────────────────────────────────────────────────────────────

function TimeColumn({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* Column label */}
      <div
        className="px-1 app-text-caption uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </div>

      {/* Scrollable list */}
      <ScrollArea className="h-56 rounded-xl border border-border/50 bg-muted/20 p-1.5">
        <div className="flex flex-col gap-0.5">
          {values.map((v) => {
            const active = selected === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onSelect(v)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all duration-150",
                  active
                    ? "brand-gradient hover-gradient text-brand-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="tabular-nums app-text-label">{v}</span>
                {active && <Check className="app-icon-xs shrink-0" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TimePicker({
  label,
  value,
  onChange,
  className,
  error,
  helperText,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const currentValue = useMemo(() => (isValidTime(value) ? value! : ""), [value]);
  const { hour, minute } = useMemo(() => getParts(currentValue), [currentValue]);
  const hasError = Boolean(error);

  const handleHourSelect = (h: string) => onChange?.(`${h}:${minute}`);
  const handleMinuteSelect = (m: string) => { onChange?.(`${hour}:${m}`); setOpen(false); };

  return (
    <div className={cn("space-y-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Floating-label trigger — matches TextInputField pattern */}
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "group relative w-full rounded-xl border bg-background text-left",
              "shadow-sm outline-none transition-all duration-200",
              "px-4 pb-2 pt-5",
              hasError
                ? "border-destructive/40 focus-visible:ring-destructive/30 focus-visible:ring-1"
                : "border-border/60 hover:border-border focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-1",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {/* Clock icon */}
            <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-foreground">
              <Clock3 className="app-icon-sm" />
            </span>

            {/* Floating label */}
            <span
              className={cn(
                "pointer-events-none absolute start-10 transition-all duration-200",
                currentValue
                  ? "top-1.5 text-foreground/70 app-text-heading-sm"
                  : "top-1/2 -translate-y-1/2 text-muted-foreground",
              )}
              style={{ fontSize: currentValue
                  ? "var(--text-label)"
                  : "var(--text-body)" }}
            >
              {label}
            </span>

            {/* Selected value */}
            <span
              className={cn(
                "block ps-6 app-text-stat tabular-nums text-foreground",
                !currentValue && "opacity-0 select-none",
              )}
            >
              {currentValue || "00:00"}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[22rem] rounded-2xl border-border/60 p-0 shadow-xl"
        >
          <div className="overflow-hidden rounded-2xl bg-popover">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
              <span className="brand-gradient hover-gradient flex app-icon-md items-center justify-center rounded-lg shadow-sm">
                <Clock3 className="text-brand-foreground app-icon-xs" />
              </span>
              <div>
                <p className="app-text-heading-sm text-foreground">
                  Select time
                </p>
                <p className="app-text-label text-muted-foreground">
                  Choose hour then minute to confirm.
                </p>
              </div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-2 gap-3 p-4">
              <TimeColumn label="Hour" values={HOURS} selected={hour} onSelect={handleHourSelect} />
              <TimeColumn label="Minute" values={MINUTES} selected={minute} onSelect={handleMinuteSelect} />
            </div>

            {/* Footer: live preview */}
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5">
              <span className="app-text-label text-muted-foreground">
                Current value
              </span>
              <span
                className="app-text-heading tabular-nums text-foreground"
              >
                {hour}:{minute}
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Validation */}
      {error ? (
        <p className="ps-1 app-text-label text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p className="ps-1 app-text-label text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}