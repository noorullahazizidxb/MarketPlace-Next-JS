"use client";

import { Search } from "lucide-react";
import { Badge } from "../../atoms/shadcn/badge";
import { Switch } from "../../atoms/shadcn/switch";

/** Specimen from manage-users PolicyToggleCard + TextField patterns */
export function PreviewUserControls() {
  return (
    <div className="grid min-w-0 max-w-full gap-3">
      <div className="space-y-2">
        <label className="block admin-text-label text-muted-foreground">Passenger email</label>
        <div
          data-slot="input"
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-background text-muted-foreground"
          style={{
            minHeight: "var(--ctrl-h)",
            paddingInline: "var(--ctrl-px)",
            paddingBlock: "var(--ctrl-py)",
          }}
        >
          <Search className="admin-icon-sm text-muted-foreground" aria-hidden />
          <span className="admin-text-body text-muted-foreground">agent@example.com</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/80 p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 text-left">
            <p className="admin-text-heading-sm text-foreground leading-snug">Booking access</p>
            <p className="admin-text-micro leading-tight text-muted-foreground line-clamp-2">
              Allow this user to create and manage flight bookings.
            </p>
          </div>
          <Switch checked disabled className="scale-75" />
        </div>
        <Badge
          variant="outline"
          className="mt-2 w-fit rounded-full px-2 py-0.5 admin-text-caption uppercase tracking-wide"
          style={{
            minHeight: "var(--badge-h)",
            paddingInline: "var(--badge-px)",
            paddingBlock: "var(--badge-py)",
          }}
        >
          Policy
        </Badge>
      </div>
    </div>
  );
}
