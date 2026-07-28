"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  buildDiscreteRangeValues,
  nearestDiscreteIndex,
  snapToDiscreteRange,
} from "../../lib/discrete-range";
import { Button } from "./button";

export interface RemRangeSliderProps {
  /** Accessible label */
  label: string;
  /** Current value */
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Short description of what this token does */
  description?: string;
  /** Optional icon rendered beside the label */
  icon?: React.ReactNode;
  className?: string;
  /** Unit suffix shown next to the value. Pass empty string for unitless (e.g. font-weight). Defaults to "rem". */
  unit?: string;
}

const VALUE_BADGE_CLASS =
  "min-w-12 rounded-md border border-border/60 bg-primary/10 px-1 py-0.5 text-center font-mono app-text-micro tabular-nums text-primary";

function parseNumericInput(raw: string): number | null {
  const cleaned = raw.trim().toLowerCase().replace(/rem/g, "").trim();
  if (!cleaned) return null;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatRangeValue(value: number, unit: string): string {
  return unit === "" ? String(Math.round(value)) : value.toFixed(3);
}

function EditableRangeValue({
  value,
  min,
  max,
  discreteValues,
  label,
  onChange,
  unit = "rem",
}: {
  value: number;
  min: number;
  max: number;
  discreteValues: number[];
  label: string;
  onChange: (next: number) => void;
  unit?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplay = (next: number) => formatRangeValue(next, unit);

  const clampAndSnap = useCallback(
    (raw: number) => {
      const clamped = Math.min(max, Math.max(min, raw));
      return snapToDiscreteRange(discreteValues, clamped);
    },
    [discreteValues, max, min],
  );

  const commit = useCallback(() => {
    const parsed = parseNumericInput(draft);
    if (parsed !== null) {
      onChange(clampAndSnap(parsed));
    }
    setIsEditing(false);
  }, [clampAndSnap, draft, onChange]);

  const cancel = useCallback(() => {
    setIsEditing(false);
    setDraft(formatDisplay(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const startEditing = useCallback(() => {
    setDraft(formatDisplay(value));
    setIsEditing(true);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
        }}
        className={cn(
          VALUE_BADGE_CLASS,
          "h-7 w-20 bg-background outline-none ring-2 ring-primary/30",
        )}
        aria-label={`Edit ${label} value${unit ? ` in ${unit}` : ""}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className={cn(
        VALUE_BADGE_CLASS,
        "cursor-text transition-colors hover:border-primary/40 hover:bg-primary/15",
      )}
      aria-label={`${label}: ${formatDisplay(value)}${unit ? ` ${unit}` : ""}. Click to edit manually.`}
    >
      {formatDisplay(value)}
      {unit ? <>&thinsp;{unit}</> : null}
    </button>
  );
}

/**
 * Token range slider with discrete snap points across min → max.
 * +/- buttons and the track move one selectable step at a time (metric-aware via `step`).
 * The center value badge accepts manual entry and snaps to the nearest allowed point.
 */
export function RemRangeSlider({
  label,
  value,
  onChange,
  min = 0.5,
  max = 1.5,
  step = 0.005,
  description,
  icon,
  className,
  unit = "rem",
}: RemRangeSliderProps) {
  const id = useId();

  const discreteValues = useMemo(
    () => buildDiscreteRangeValues(min, max, step),
    [max, min, step],
  );

  const currentIndex = useMemo(
    () => nearestDiscreteIndex(discreteValues, value),
    [discreteValues, value],
  );

  const snappedValue = discreteValues[currentIndex] ?? value;
  const maxIndex = Math.max(0, discreteValues.length - 1);
  const progressPct = `${maxIndex === 0 ? 0 : (currentIndex / maxIndex) * 100}%`;

  // Align external values that land between discrete steps (e.g. legacy saved data).
  useEffect(() => {
    if (discreteValues.length === 0) return;
    const aligned = snapToDiscreteRange(discreteValues, value);
    const epsilon = Math.max(Math.abs(step) * 0.01, Number.EPSILON);
    if (Math.abs(aligned - value) > epsilon) {
      onChange(aligned);
    }
  }, [discreteValues, onChange, step, value]);

  const emitDiscreteValue = useCallback(
    (index: number) => {
      const next = discreteValues[Math.min(maxIndex, Math.max(0, index))];
      if (next !== undefined) onChange(next);
    },
    [discreteValues, maxIndex, onChange],
  );

  const handleIndexChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      emitDiscreteValue(Number(event.target.value));
    },
    [emitDiscreteValue],
  );

  const handleDecrease = useCallback(() => {
    emitDiscreteValue(currentIndex - 1);
  }, [currentIndex, emitDiscreteValue]);

  const handleIncrease = useCallback(() => {
    emitDiscreteValue(currentIndex + 1);
  }, [currentIndex, emitDiscreteValue]);

  const stepLabel = unit ? `${step} ${unit}` : String(step);
  const showTickMarks = discreteValues.length > 1 && discreteValues.length <= 50;

  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 rounded-xl border border-border/50 bg-background/70 px-2.5 py-2",
        "shadow-sm transition-shadow hover:shadow-md hover:border-primary/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {icon && (
            <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors [&_svg]:app-icon-xs">
              {icon}
            </span>
          )}
          <label
            htmlFor={id}
            className="truncate app-text-caption text-foreground cursor-pointer select-none"
          >
            {label}
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-5 shrink-0"
            onClick={handleDecrease}
            disabled={currentIndex <= 0}
            aria-label={`Decrease ${label} by one step (${stepLabel})`}
          >
            <Minus className="app-icon-xs" aria-hidden />
          </Button>

          <EditableRangeValue
            value={snappedValue}
            min={min}
            max={max}
            discreteValues={discreteValues}
            label={label}
            onChange={onChange}
            unit={unit}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-5 shrink-0"
            onClick={handleIncrease}
            disabled={currentIndex >= maxIndex}
            aria-label={`Increase ${label} by one step (${stepLabel})`}
          >
            <Plus className="app-icon-xs" aria-hidden />
          </Button>
        </div>
      </div>

      {description && (
        <p className="app-text-micro leading-snug text-muted-foreground/80 line-clamp-2">
          {description}
        </p>
      )}

      <div className="relative flex items-center gap-1.5">
        <span className="w-8 shrink-0 text-right font-mono app-text-micro text-muted-foreground/60 tabular-nums">
          {formatRangeValue(min, unit)}
        </span>

        <div className="relative flex-1">
          {showTickMarks && (
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 justify-between px-[0.5625rem]"
              aria-hidden
            >
              {discreteValues.map((mark, index) => (
                <span
                  key={`${mark}-${index}`}
                  className={cn(
                    "w-px rounded-full bg-muted-foreground/35",
                    index === currentIndex ? "h-2.5 bg-primary/70" : "h-1.5",
                  )}
                />
              ))}
            </div>
          )}

          <input
            id={id}
            type="range"
            min={0}
            max={maxIndex}
            step={1}
            value={currentIndex}
            onChange={handleIndexChange}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={snappedValue}
            aria-valuetext={
              unit
                ? `${formatRangeValue(snappedValue, unit)} ${unit}`
                : formatRangeValue(snappedValue, unit)
            }
            className="rem-range-slider-input relative z-10 w-full"
            style={
              {
                "--range-fill": progressPct,
              } as React.CSSProperties
            }
          />
        </div>

        <span className="w-8 shrink-0 font-mono app-text-micro text-muted-foreground/60 tabular-nums">
          {formatRangeValue(max, unit)}
        </span>
      </div>
    </div>
  );
}
