"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "../../lib/cn";
import { Button, buttonVariants } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  previewRange?: DateRange;
  /** Tighter cell grid for narrow popovers (e.g. mobile range picker, two months). */
  density?: "default" | "compact";
  /** The year to start the year dropdown. Defaults to 1940. */
  fromYear?: number;
  /** The year to end the year dropdown. Defaults to 2050. */
  toYear?: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE_DEFAULT = "[--cell-size:--spacing(9)]";
const CELL_SIZE_COMPACT = "[--cell-size:min(1.05rem,2.85vw)]";
const PREVIEW_START_MODIFIER = "range_preview_start";
const PREVIEW_MIDDLE_MODIFIER = "range_preview_middle";
const PREVIEW_END_MODIFIER = "range_preview_end";

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const isSameDay = (left: Date, right: Date) =>
  startOfDay(left).getTime() === startOfDay(right).getTime();

const getOrderedPreviewRange = (range?: DateRange) => {
  if (!range?.from || !range.to) return null;

  const from = startOfDay(range.from);
  const to = startOfDay(range.to);

  return from.getTime() <= to.getTime() ? { from, to } : { from: to, to: from };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<"div"> & {
  rootRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.ComponentProps<"svg"> & {
  orientation?: "left" | "right" | "up" | "down";
}) {
  const shared = cn("admin-icon-sm", className);

  if (orientation === "left")
    return <ChevronLeftIcon className={shared} {...props} />;
  if (orientation === "right")
    return <ChevronRightIcon className={shared} {...props} />;

  return <ChevronDownIcon className={shared} {...props} />;
}

function CalendarWeekNumber({
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}

// ─── Dropdown (DropdownMenu-based, theme-aware for admin + customer MFEs) ─────
// Replaces the native <select> to match the project's unified popover styling.
// Both admin (globals.css) and customer (globalsasad.css) expose the same
// CSS variable names (--popover, --accent, etc.), so this renders consistently
// in both MFEs without any extra branching.

function Dropdown({
  value,
  onChange,
  options,
}: React.ComponentProps<"select"> & {
  options?: { value: string | number; label: string; disabled?: boolean }[];
}) {
  const current = options?.find((o) => String(o.value) === String(value));

  // Synthesize a ChangeEvent<HTMLSelectElement> so react-day-picker's
  // Dropdown contract is satisfied without modifying the DayPicker API.
  const handleSelect = (optionValue: string | number) => {
    if (!onChange) return;
    const syntheticEvent = {
      target: { value: String(optionValue) },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative z-10 inline-flex min-min-h-[var(--ctrl-h-sm)] cursor-pointer items-center gap-1 rounded-lg px-2 pr-1.5",
            "admin-text-body text-foreground",
            "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
          aria-label={current?.label}
        >
          {current?.label}
          <ChevronDownIcon
            className="admin-icon-xs text-muted-foreground/70"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
        {options?.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={option.disabled}
            data-selected={String(option.value) === String(value)}
            className={cn(
              "cursor-pointer",
              String(option.value) === String(value) &&
                "bg-accent admin-text-heading-sm text-accent-foreground",
            )}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);
  const previewModifiers = modifiers as Record<string, boolean | undefined>;

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-preview-start={previewModifiers[PREVIEW_START_MODIFIER]}
      data-range-preview-middle={previewModifiers[PREVIEW_MIDDLE_MODIFIER]}
      data-range-preview-end={previewModifiers[PREVIEW_END_MODIFIER]}
      className={cn(
        // layout
        "flex aspect-square size-auto w-full min-w-(--cell-size)",
        "flex-col gap-1 leading-none font-normal",
        "hover:bg-accent hover:text-accent-foreground",

        // single selected
        "data-[selected-single=true]:bg-primary",
        "data-[selected-single=true]:text-foreground",
        "data-[selected-single=true]:rounded-xl",
        "data-[selected-single=true]:shadow-sm",

        // range start
        "data-[range-start=true]:bg-primary/90",
        "data-[range-start=true]:text-primary-foreground",
        "data-[range-start=true]:rounded-l-xl",
        "data-[range-start=true]:rounded-r-none",

        // range middle
        "data-[range-middle=true]:bg-primary/10",
        "data-[range-middle=true]:text-foreground",
        "data-[range-middle=true]:rounded-none",

        // range end
        "data-[range-end=true]:bg-primary/90",
        "data-[range-end=true]:text-primary-foreground",
        "data-[range-end=true]:rounded-r-xl",
        "data-[range-end=true]:rounded-l-none",

        // range preview
        "data-[range-preview-start=true]:bg-primary/70",
        "data-[range-preview-start=true]:text-primary-foreground",
        "data-[range-preview-start=true]:rounded-l-xl",
        "data-[range-preview-start=true]:rounded-r-none",
        "data-[range-preview-middle=true]:bg-accent/60",
        "data-[range-preview-middle=true]:text-foreground",
        "data-[range-preview-middle=true]:rounded-none",
        "data-[range-preview-end=true]:bg-primary/70",
        "data-[range-preview-end=true]:text-primary-foreground",
        "data-[range-preview-end=true]:rounded-r-xl",
        "data-[range-preview-end=true]:rounded-l-none",

        // focused ring
        "group-data-[focused=true]/day:relative",
        "group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2",
        "group-data-[focused=true]/day:ring-ring",
        "group-data-[focused=true]/day:ring-offset-1",

        // event badge
        "[&>span]:admin-text-badge [&>span]:opacity-60",

        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
// NOTE: react-day-picker v9 does NOT update day modifiers on mouse hover by itself.
// Range hover preview (range_middle / range_end) requires the consumer to track
// the hovered day via onDayMouseEnter and pass it as selected.to in return-selection
// mode. See range-date-picker.tsx for the authoritative implementation.
// The range_middle / range_end classNames below are applied to the td cell wrapper
// (via DayPicker's `classNames` prop) and to the inner DayButton (via data attributes),
// providing the visual highlight when `selected.to` is set to the hovered day.

export function Calendar({
  className,
  classNames,
  modifiers,
  modifiersClassNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  fromYear = 1940,
  toYear = 2050,
  formatters,
  components,
  previewRange,
  density = "default",
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const startMonth = React.useMemo(
    () => (props.startMonth ? props.startMonth : new Date(fromYear, 0)),
    [props.startMonth, fromYear],
  );
  const endMonth = React.useMemo(
    () => (props.endMonth ? props.endMonth : new Date(toYear, 11)),
    [props.endMonth, toYear],
  );

  const orderedPreviewRange = React.useMemo(
    () => getOrderedPreviewRange(previewRange),
    [previewRange],
  );

  const previewModifiers = React.useMemo(() => {
    if (!orderedPreviewRange) return modifiers;

    return {
      ...modifiers,
      [PREVIEW_START_MODIFIER]: (date: Date) =>
        isSameDay(date, orderedPreviewRange.from),
      [PREVIEW_MIDDLE_MODIFIER]: (date: Date) => {
        const time = startOfDay(date).getTime();
        return (
          time > orderedPreviewRange.from.getTime() &&
          time < orderedPreviewRange.to.getTime()
        );
      },
      [PREVIEW_END_MODIFIER]: (date: Date) =>
        isSameDay(date, orderedPreviewRange.to),
    };
  }, [modifiers, orderedPreviewRange]);

  const cellSizeClass =
    density === "compact" ? CELL_SIZE_COMPACT : CELL_SIZE_DEFAULT;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn(
        "bg-background p-3 group/calendar",
        cellSizeClass,
        density === "compact" && "p-2",
        // transparent inside cards / popovers
        "[[data-slot=card-content]_&]:bg-transparent",
        "[[data-slot=popover-content]_&]:bg-transparent",
        // RTL chevron flip
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        // ── Structure ──────────────────────────────────────────────────────
        root: cn("w-fit", defaultClassNames.root),

        months: cn(
          density === "compact"
            ? "relative flex w-full max-w-[min(100vw-0.5rem,40rem)] flex-row flex-nowrap justify-center gap-x-1 gap-y-2 overflow-x-auto overscroll-x-contain px-0.5 [scrollbar-width:thin]"
            : "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),

        month: cn(
          density === "compact"
            ? "flex w-auto min-w-0 flex-col gap-2"
            : "flex w-full flex-col gap-4",
          defaultClassNames.month,
        ),

        // ── Navigation ─────────────────────────────────────────────────────
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_previous,
        ),

        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_next,
        ),

        // ── Caption ────────────────────────────────────────────────────────
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),

        caption_label: cn(
          "select-none admin-text-body",
          captionLayout !== "label" && [
            "flex min-h-[var(--ctrl-h-sm)] items-center gap-1",
            "rounded-lg pl-2 pr-1",
            "hover:bg-accent transition-colors",
            "[&>svg]:admin-icon-xs [&>svg]:text-muted-foreground",
          ],
          defaultClassNames.caption_label,
        ),

        // ── Dropdowns ──────────────────────────────────────────────────────
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 admin-text-body",
          defaultClassNames.dropdowns,
        ),

        dropdown_root: cn(
          "relative inline-flex rounded-lg",
          defaultClassNames.dropdown_root,
        ),

        dropdown: cn(
          "pointer-events-none absolute inset-0 opacity-0",
          defaultClassNames.dropdown,
        ),

        // ── Grid ───────────────────────────────────────────────────────────
        table: "w-full border-collapse",

        weekdays: cn("flex", defaultClassNames.weekdays),

        weekday: cn(
          "flex-1 select-none rounded-md",
          "admin-text-label text-muted-foreground",
          defaultClassNames.weekday,
        ),

        week: cn("mt-1.5 flex w-full", defaultClassNames.week),

        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),

        week_number: cn(
          "select-none admin-text-caption text-muted-foreground",
          defaultClassNames.week_number,
        ),

        // ── Day cell ───────────────────────────────────────────────────────
        day: cn(
          "relative aspect-square h-full w-full p-0 text-center select-none",
          "group/day",
          defaultClassNames.day,
        ),

        // ── Range styling ──────────────────────────────────────────────────
        range_start: cn(
          "bg-primary/10 rounded-l-xl",
          defaultClassNames.range_start,
        ),

        range_middle: cn(
          "bg-accent/40 rounded-none",
          defaultClassNames.range_middle,
        ),

        range_end: cn(
          "bg-primary/10 rounded-r-xl",
          defaultClassNames.range_end,
        ),

        // ── State variants ─────────────────────────────────────────────────
        today: cn(
          "rounded-xl admin-text-heading-sm",
          "bg-accent text-accent-foreground",
          "data-[selected=true]:bg-primary/50 data-[selected=true]:text-primary-foreground",
          defaultClassNames.today,
        ),

        outside: cn(
          "opacity-30 aria-selected:opacity-60",
          defaultClassNames.outside,
        ),

        disabled: cn(
          "opacity-30 cursor-not-allowed",
          defaultClassNames.disabled,
        ),

        hidden: cn("invisible", defaultClassNames.hidden),

        // ── Consumer overrides ─────────────────────────────────────────────
        ...classNames,
      }}
      modifiers={previewModifiers}
      modifiersClassNames={{
        [PREVIEW_START_MODIFIER]: "bg-primary/10 rounded-l-xl",
        [PREVIEW_MIDDLE_MODIFIER]: "bg-accent/60 rounded-none",
        [PREVIEW_END_MODIFIER]: "bg-primary/10 rounded-r-xl",
        ...modifiersClassNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        Dropdown: Dropdown,
        ...components,
      }}
      {...props}
    />
  );
}
