"use client";

import { cloneElement, isValidElement, useCallback, useId, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "@repo/hooks";
import { TbPlaneArrival, TbPlaneDeparture } from "react-icons/tb";
import { cn } from "../../lib/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverAnchor } from "./popover";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveField = "departure" | "return";

type RangeDatePickerValue = {
  start?: string | null;
  end?: string | null;
};

export interface RangeDatePickerProps {
  value?: RangeDatePickerValue;
  onChange?: (next: RangeDatePickerValue) => void;
  className?: string;
  buttonClassName?: string;
  error?: string;
  helperText?: string;
  roundTrip?: boolean;
  disableReturn?: boolean;
  /** @deprecated Use departureLabel / returnLabel */
  label?: string;
  departureLabel?: string;
  returnLabel?: string;
  departurePlaceholder?: string;
  returnPlaceholder?: string;
  placeholder?: string;
  /**
   * Decorative icon to render for both departure and return fields.
   * When not provided, defaults to plane departure/arrival icons.
   */
  icon?: ReactNode;
  disabled?: boolean;
  allowPastDates?: boolean;
  fromYear?: number;
  toYear?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const toDate = (v?: string | null): Date | undefined => {
  if (!v) return undefined;
  const norm = v.includes("T") ? v : `${v}T00:00:00`;
  const d = new Date(norm);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const toDateOnly = (d?: Date | null): string | null => {
  if (!d) return null;
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const startOfDay = (d: Date) => { const n = new Date(d); n.setHours(0, 0, 0, 0); return n; };
const isBeforeDay = (a: Date, b: Date) => startOfDay(a).getTime() < startOfDay(b).getTime();

const formatDisplay = (d?: Date) =>
  d
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d)
    : "";

const normalizeStr = (v?: string | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null;

// ── Shared class strings ──────────────────────────────────────────────────────

/** Outer pill frame — border/radius/background */
const FRAME_CLS =
  "flex min-h-[var(--ctrl-h)] overflow-hidden border border-border/60 bg-background transition-all duration-200";

/** Individual trigger button */
const TRIGGER_CLS =
  "flex min-w-0 flex-1 items-center gap-2 px-[var(--ctrl-px)] py-2 text-left outline-none transition-all duration-200";

/** Floating micro-label above the date value */
const MICRO_LABEL_CLS =
  "block app-text-micro uppercase leading-none tracking-wider text-muted-foreground";

/** Clear (×) button inside each field */
const CLEAR_BTN_CLS =
  "flex app-icon-md shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive";

// ── Component ─────────────────────────────────────────────────────────────────

export function RangeDatePicker({
  value,
  onChange,
  className,
  buttonClassName,
  error,
  helperText,
  roundTrip = true,
  disableReturn = false,
  departureLabel = "Departure",
  returnLabel = "Return",
  departurePlaceholder,
  returnPlaceholder,
  placeholder = "Add date",
  icon,
  disabled = false,
  allowPastDates = false,
  fromYear,
  toYear,
}: RangeDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>("departure");
  const [previewDate, setPreviewDate] = useState<Date | null>(null);
  const groupId = useId();

  const showReturn = roundTrip && !disableReturn;

  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  }, []);

  const departureDate = useMemo(() => toDate(value?.start), [value?.start]);
  const returnDate = useMemo(() => toDate(value?.end), [value?.end]);
  const existingStart = useMemo(() => normalizeStr(value?.start), [value?.start]);
  const existingEnd = useMemo(() => normalizeStr(value?.end), [value?.end]);
  const departureText = formatDisplay(departureDate);
  const returnText = formatDisplay(returnDate);
  const hasError = Boolean(error);

  const calendarSelected = useMemo<DateRange | undefined>(() => {
    if (!departureDate) return undefined;
    return { from: departureDate, to: returnDate ?? undefined };
  }, [departureDate, returnDate]);

  const calendarPreview = useMemo<DateRange | undefined>(() => {
    if (
      activeField !== "return" || !departureDate ||
      !previewDate || returnDate || isBeforeDay(previewDate, departureDate)
    ) return undefined;
    return { from: departureDate, to: previewDate };
  }, [activeField, departureDate, previewDate, returnDate]);

  const calendarDisabled = useMemo(() =>
    activeField === "return" && departureDate
      ? { before: departureDate }
      : allowPastDates
        ? undefined
        : { before: today },
    [activeField, departureDate, today, allowPastDates]
  );

  // Live status for instruction bar
  const [liveStatus, setLiveStatus] = useState("");

  const isMobile = useIsMobile();
  const compactCalendar = isMobile && showReturn;

  const popoverWidthClass =
    compactCalendar ? "w-[min(100vw-0.5rem,40rem)] max-w-[100vw]" : "w-auto";

  const openWithField = useCallback((field: ActiveField) => {
    if (disabled) return;
    setActiveField(field);
    setPreviewDate(null);
    setOpen(true);
  }, [disabled]);

  const renderTriggerIcon = useCallback(
    (field: ActiveField) => {
      const isActive = open && activeField === field;
      const colorCls = isActive ? "text-violet-500" : "text-muted-foreground/70";

      if (icon && isValidElement(icon)) {
        const existingClassName = (icon.props as { className?: string }).className;
        return cloneElement(icon as ReactElement<{ className?: string; "aria-hidden"?: boolean }>, {
          className: cn(existingClassName, "app-icon-sm shrink-0 transition-colors", colorCls),
          "aria-hidden": true,
        });
      }

      if (icon) {
        return (
          <span className={cn("shrink-0 transition-colors", colorCls)} aria-hidden="true">
            {icon}
          </span>
        );
      }

      const FallbackIcon = field === "departure" ? TbPlaneDeparture : TbPlaneArrival;
      return <FallbackIcon className={cn("app-icon-sm shrink-0 transition-colors", colorCls)} aria-hidden="true" />;
    },
    [activeField, icon, open],
  );

  const renderTabIcon = useCallback(
    (field: ActiveField) => {
      if (icon && isValidElement(icon)) {
        const existingClassName = (icon.props as { className?: string }).className;
        return cloneElement(icon as ReactElement<{ className?: string; "aria-hidden"?: boolean }>, {
          className: cn(existingClassName, "app-icon-xs"),
          "aria-hidden": true,
        });
      }

      if (icon) {
        return (
          <span className="app-icon-xs" aria-hidden="true">
            {icon}
          </span>
        );
      }

      const FallbackIcon = field === "departure" ? TbPlaneDeparture : TbPlaneArrival;
      return <FallbackIcon className="app-icon-xs" aria-hidden="true" />;
    },
    [icon],
  );

  const handleDayMouseEnter = useCallback((day: Date) => {
    if (activeField === "return" && departureDate && !isBeforeDay(day, departureDate)) {
      setPreviewDate(day);
    }
  }, [activeField, departureDate]);

  const handleDayMouseLeave = useCallback(() => setPreviewDate(null), []);

  const handleDayClick = useCallback((day: Date) => {
    if (activeField === "departure") {
      const next = toDateOnly(day);
      const cleared = { start: next, end: null };
      onChange?.(cleared);
      setLiveStatus(`Departure set to ${formatDisplay(day)}. Now pick return.`);
      if (showReturn) { setActiveField("return"); setPreviewDate(null); }
      else setOpen(false);
    } else {
      if (departureDate && isBeforeDay(day, departureDate)) {
        const next = toDateOnly(day);
        onChange?.({ start: next, end: existingEnd });
        setLiveStatus(`Return before departure — departure updated to ${formatDisplay(day)}.`);
        setActiveField("return");
      } else {
        const next = toDateOnly(day);
        onChange?.({ start: existingStart, end: next });
        setLiveStatus(`Return set to ${formatDisplay(day)}.`);
        setOpen(false);
      }
    }
  }, [activeField, departureDate, existingStart, existingEnd, onChange, showReturn]);

  const handleClearDeparture = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    onChange?.({ start: null, end: existingEnd });
    setLiveStatus("Departure cleared.");
  }, [existingEnd, onChange]);

  const handleClearReturn = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    onChange?.({ start: existingStart, end: null });
    setLiveStatus("Return cleared.");
  }, [existingStart, onChange]);

  const handleClear = useCallback(() => {
    onChange?.({ start: null, end: null });
    setLiveStatus("All dates cleared.");
  }, [onChange]);

  return (
    <div className={cn("space-y-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div
            data-control-shell
            className={cn(
              FRAME_CLS,
              // Focus-within ring — matches TextInputField
              "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30",
              hasError && "border-destructive/40",
              disabled && "opacity-60 pointer-events-none",
            )}
            role="group"
            aria-label="Date range"
          >
            {/* ── Departure ── */}
            <button
              type="button"
              onClick={() => openWithField("departure")}
              aria-label={`Select ${departureLabel} date`}
              aria-expanded={open && activeField === "departure"}
              aria-haspopup="dialog"
              aria-controls={`rdp-calendar-${groupId}`}
              disabled={disabled}
              className={cn(
                TRIGGER_CLS,
                !disabled && "hover:bg-accent/30 cursor-pointer",
                disabled && "cursor-default",
                "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring/30",
                // Active-field highlight
                open && activeField === "departure" && "bg-violet-500/5",
                buttonClassName,
              )}
            >
              {renderTriggerIcon("departure")}
              <span className="min-w-0 flex-1 overflow-hidden">
                <span
                  className={MICRO_LABEL_CLS}
                >
                  {departureLabel}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate leading-snug",
                    !departureText
                      ? "text-muted-foreground/60"
                      : cn(
                        "app-text-label",
                        open && activeField === "departure"
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-foreground",
                      ),
                  )}
                >
                  {departureText || (departurePlaceholder ?? placeholder)}
                </span>
              </span>
              {departureText && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear departure date"
                  className={CLEAR_BTN_CLS}
                  onClick={handleClearDeparture}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClearDeparture(e); }}
                >
                  <X className="app-icon-xs" aria-hidden />
                </span>
              )}
            </button>

            {/* ── Divider ── */}
            {showReturn && <div className="my-2 w-px shrink-0 bg-border/60" aria-hidden="true" />}

            {/* ── Return ── */}
            {showReturn && (
              <button
                type="button"
                onClick={() => openWithField("return")}
                aria-label={`Select ${returnLabel} date`}
                aria-expanded={open && activeField === "return"}
                aria-haspopup="dialog"
                aria-controls={`rdp-calendar-${groupId}`}
                disabled={disabled}
                className={cn(
                  TRIGGER_CLS,
                  !disabled && "hover:bg-accent/30 cursor-pointer",
                  disabled && "cursor-default",
                  "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring/30",
                  open && activeField === "return" && "bg-violet-500/5",
                  buttonClassName,
                )}
              >
                {renderTriggerIcon("return")}
                <span className="min-w-0 flex-1 overflow-hidden">
                  <span
                    className={MICRO_LABEL_CLS}
                  >
                    {returnLabel}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate leading-snug",
                      !returnText
                        ? "text-muted-foreground/60"
                        : cn(
                          "app-text-label",
                          open && activeField === "return"
                            ? "text-violet-600 dark:text-violet-400"
                            : "text-foreground",
                        ),
                    )}
                  >
                    {returnText || (returnPlaceholder ?? placeholder)}
                  </span>
                </span>
                {returnText && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Clear return date"
                    className={CLEAR_BTN_CLS}
                    onClick={handleClearReturn}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClearReturn(e); }}
                  >
                    <X className="app-icon-xs" aria-hidden />
                  </span>
                )}
              </button>
            )}

            {/* ── Global clear ── */}
            {(departureText || returnText) && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear selected dates"
                className={cn(
                  "flex shrink-0 items-center self-stretch border-l border-border/50 px-3 min-h-[2.5rem]",
                  "text-muted-foreground/50 transition-colors",
                  "hover:bg-destructive/5 hover:text-destructive",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring/30",
                )}
              >
                <X className="app-icon-sm" aria-hidden="true" />
              </button>
            )}
          </div>
        </PopoverAnchor>

        {/* ── Calendar popover ── */}
        <PopoverContent
          id={`rdp-calendar-${groupId}`}
          role="dialog"
          aria-label={
            activeField === "departure"
              ? `Select ${departureLabel} date`
              : `Select ${returnLabel} date`
          }
          align="start"
          sideOffset={6}
          className={cn(
            "rounded-2xl border-border/60 p-0 shadow-2xl",
            popoverWidthClass,
          )}
        >
          <div
            className={cn(
              "overflow-hidden rounded-2xl bg-popover",
              compactCalendar && "max-h-[min(72dvh,32rem)] overflow-y-auto overflow-x-auto",
            )}
          >
            {/* Top accent strip */}
            <div className="app-hero-accent w-full brand-gradient" />

            {/* Field-switcher tabs */}
            {showReturn && (
              <div
                role="tablist"
                aria-label="Select date field"
                className="flex border-b border-border/50"
              >
                {([
                  { field: "departure" as const, label: departureLabel, text: departureText },
                  { field: "return" as const, label: returnLabel, text: returnText },
                ] as const).map(({ field, label, text }) => (
                  <button
                    key={field}
                    role="tab"
                    type="button"
                    aria-selected={activeField === field}
                    onClick={() => setActiveField(field)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2",
                      "border-b-2 px-4 py-2.5 transition-colors",
                      "app-text-caption uppercase tracking-wide",
                      activeField === field
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {renderTabIcon(field)}
                    <span>{label}</span>
                    {text && (
                      <span className="font-normal normal-case tracking-normal text-muted-foreground">
                        {text}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Instruction bar */}
            <div className="border-b border-border/50 bg-muted/20 px-4 py-2">
              <p
                className="text-muted-foreground"
                aria-live="polite"
              >
                {liveStatus ||
                  (activeField === "departure"
                    ? "Click a day to set your departure date."
                    : departureText
                      ? `Departing ${departureText} — pick your return.`
                      : "Pick your return date.")}
              </p>
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              numberOfMonths={showReturn ? 2 : 1}
              density={compactCalendar ? "compact" : "default"}
              selected={calendarSelected}
              previewRange={calendarPreview}
              defaultMonth={calendarSelected?.from ?? today}
              disabled={calendarDisabled}
              fromYear={fromYear}
              toYear={toYear}
              onDayClick={(day: Date) => handleDayClick(day)}
              onDayMouseEnter={handleDayMouseEnter}
              onDayMouseLeave={handleDayMouseLeave}
              className={cn("bg-background", compactCalendar ? "p-2" : "p-3")}
            />

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5">
              <p
                className="text-muted-foreground"
              >
                {!departureText
                  ? "Select a departure date"
                  : showReturn && !returnText
                    ? "Now select a return date"
                    : departureText && returnText
                      ? `${departureText}  →  ${returnText}`
                      : departureText}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={handleClear}
                aria-label="Clear all selected dates"
              >
                <X className="app-icon-xs" aria-hidden="true" />
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Validation / helper text */}
      {error ? (
        <p
          className="mt-1 ps-4 text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          className="mt-1 ps-4 text-muted-foreground"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}