"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../atoms/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/shadcn/select";

export type PaginationPageSize = number | "all";

type ShowingArgs = {
  start: number;
  end: number;
  total: number;
};

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  pageSize?: PaginationPageSize;
  pageSizeOptions?: PaginationPageSize[];
  onPageSizeChange?: (size: PaginationPageSize) => void;
  showPageSize?: boolean;
  showingLabel: (args: ShowingArgs) => string;
  previousLabel: string;
  nextLabel: string;
  allLabel?: string;
  className?: string;
}

export function TablePagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100, "all"],
  onPageSizeChange,
  showPageSize = false,
  showingLabel,
  previousLabel,
  nextLabel,
  allLabel = "All",
  className,
}: TablePaginationProps) {
  if (total <= 0) return null;

  const pageCount = Math.max(1, totalPages || Math.ceil(total / Math.max(perPage, 1)));
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const currentRangeStart = Math.max(0, (currentPage - 1) * perPage + 1);
  const currentRangeEnd = Math.min(currentPage * perPage, total);
  const visibleRangeEnd = pageSize === "all" ? total : currentRangeEnd;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    onPageChange(nextPage);
  };

  const windowSize = 5;
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = startPage + windowSize - 1;
  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(1, endPage - windowSize + 1);
  }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
        className,
      )}
    >
      <div className="order-2 flex flex-wrap items-center gap-2 text-muted-foreground sm:order-1">
        <span className="rounded-lg border border-border/50 bg-muted/30 px-2 py-1 admin-text-label tabular-nums admin-text-label">
          {showingLabel({ start: currentRangeStart, end: visibleRangeEnd, total })}
        </span>

        {showPageSize && onPageSizeChange ? (
          <Select
            value={String(pageSize ?? perPage)}
            onValueChange={(value) =>
              onPageSizeChange(value === "all" ? "all" : Number(value))
            }
          >
            <SelectTrigger className="min-h-[var(--ctrl-h-sm)] min-w-[4.5rem] rounded-lg px-2 py-1 admin-text-action">
              <SelectValue placeholder={String(pageSize ?? perPage)} />
            </SelectTrigger>
            <SelectContent className="min-w-[4.5rem]">
              {pageSizeOptions.map((option) => (
                <SelectItem key={String(option)} value={String(option)}>
                  {option === "all" ? allLabel : String(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className="order-1 w-full sm:order-2 sm:w-auto">
        <nav className="mx-auto flex w-full max-w-full items-center justify-center gap-1 rounded-xl border border-border/60 bg-card/95 p-1 shadow-sm backdrop-blur-sm sm:w-auto sm:rounded-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label={previousLabel}
            className="h-[var(--ctrl-h-sm)] w-[var(--ctrl-h-sm)] rounded-lg sm:rounded-xl"
          >
            <ChevronLeft className="admin-icon-sm" />
          </Button>

          <div className="hidden items-center gap-0.5 px-1 sm:flex">
            {startPage > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  className="h-[var(--ctrl-h-sm)] w-[var(--ctrl-h-sm)] rounded-xl admin-text-label"
                >
                  1
                </Button>
                {startPage > 2 && (
                  <span className="px-1 admin-text-label text-muted-foreground/60">…</span>
                )}
              </>
            )}

            {pages.map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "ghost"}
                size="icon"
                onClick={() => handlePageChange(p)}
                className={cn(
                  "h-[var(--ctrl-h-sm)] w-[var(--ctrl-h-sm)] rounded-xl admin-text-label",
                  p === currentPage &&
                  "bg-primary text-primary-foreground shadow-sm border border-primary/30 hover:bg-primary/90",
                )}
              >
                {p}
              </Button>
            ))}

            {endPage < pageCount && (
              <>
                {endPage < pageCount - 1 && (
                  <span className="px-1 admin-text-label text-muted-foreground/60">…</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(pageCount)}
                  className="h-[var(--ctrl-h-sm)] w-[var(--ctrl-h-sm)] rounded-xl admin-text-label"
                >
                  {pageCount}
                </Button>
              </>
            )}
          </div>

          <div className="px-3 admin-text-stat tabular-nums admin-text-action sm:hidden">
            {currentPage} / {pageCount}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label={nextLabel}
            className="h-[var(--ctrl-h-sm)] w-[var(--ctrl-h-sm)] rounded-lg sm:rounded-xl"
          >
            <ChevronRight className="admin-icon-sm" />
          </Button>
        </nav>
      </div>

      <div className="hidden sm:block sm:order-3 sm:min-w-[0.25rem]" />
    </div>
  );
}
