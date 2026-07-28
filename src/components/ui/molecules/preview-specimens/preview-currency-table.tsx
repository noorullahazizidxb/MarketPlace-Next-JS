"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "../../atoms/shadcn/badge";

/** Simplified specimen from apps/admin/widgets/currency-convert/currency-rates-table.tsx */
export function PreviewCurrencyTable({ showPairColumn = true }: { showPairColumn?: boolean }) {
  return (
    <div className="admin-table-dense min-w-0 max-w-full overflow-hidden rounded-lg border border-border/50">
      <table className="w-full min-w-0 border-separate border-spacing-0">
        <thead className="bg-muted/35 text-left app-typo-eyebrow uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            {showPairColumn ? (
              <th
                data-slot="table-head"
                className="ui-table-pair-col px-(--table-cell-px) py-(--table-cell-py) app-text-label"
              >
                Pair
              </th>
            ) : null}
            <th data-slot="table-head" className="px-(--table-cell-px) py-(--table-cell-py) app-text-label">
              Amount
            </th>
            <th data-slot="table-head" className="px-(--table-cell-px) py-(--table-cell-py) app-text-label">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            {showPairColumn ? (
              <td
                data-slot="table-cell"
                className="ui-table-pair-col px-(--table-cell-px) py-(--table-cell-py) align-top"
              >
                <div className="flex items-center gap-2">
                  <div className="flex app-icon-lg shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm">
                    <ArrowRight className="app-icon-xs text-muted-foreground" aria-hidden />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 app-typo-page-subtitle text-foreground">
                      <span>USD</span>
                      <span className="text-muted-foreground">→</span>
                      <span>IRR</span>
                    </div>
                    <p className="app-typo-filter-label text-muted-foreground">USD to IRR</p>
                  </div>
                </div>
              </td>
            ) : null}
            <td data-slot="table-cell" className="px-(--table-cell-px) py-(--table-cell-py) align-top">
              <p className="app-typo-stat-value tabular-nums text-foreground">1.234567890000</p>
            </td>
            <td data-slot="table-cell" className="px-(--table-cell-px) py-(--table-cell-py) align-top">
              <Badge variant="default" className="app-text-badge">
                Active
              </Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
