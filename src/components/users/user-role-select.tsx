"use client";
import React, { useState } from "react";
import { Check, Loader2, ShieldAlert } from "lucide-react";
import { useApiMutationDynamic } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/cn";
import type { BaseUser, RoleOption } from "./types";
import { ROLE_BADGE_CLASSES, ROLE_OPTIONS, primaryRole } from "./roles";

/**
 * Inline role editor for the admin users table.
 * Authorization and the "last admin" rule are enforced by the API (PATCH /users/:id/role);
 * the server's message is shown by the HTTP message middleware.
 */
export function UserRoleSelect({ user, onChanged }: { user: BaseUser; onChanged?: () => void }) {
  const current = primaryRole(user.roles);
  const [draft, setDraft] = useState<RoleOption>(current);
  const { user: me } = useAuth();
  const changeRole = useApiMutationDynamic<any>("patch");
  const dirty = draft !== current;
  const isSelf = me?.id === user.id;

  const save = async () => {
    if (!dirty) return;
    if (isSelf && current === "ADMIN" && !window.confirm("You are removing your own admin access. Continue?")) {
      setDraft(current);
      return;
    }
    try {
      await changeRole.mutateAsync({ url: `/users/${user.id}/role`, body: { role: draft } });
      onChanged?.();
    } catch {
      setDraft(current);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label={`Role for ${user.fullName || user.email}`}
        value={draft}
        disabled={changeRole.isPending}
        onChange={(e) => setDraft(e.target.value as RoleOption)}
        className={cn(
          "h-8 rounded-full border px-2.5 app-text-micro font-semibold uppercase tracking-wide bg-transparent cursor-pointer",
          ROLE_BADGE_CLASSES[draft] ?? "border-[var(--border)]",
        )}
      >
        {ROLE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {dirty && (
        <button
          type="button"
          onClick={save}
          disabled={changeRole.isPending}
          aria-label="Save role"
          title={isSelf ? "Changing your own role" : "Save role"}
          className="size-8 grid place-items-center rounded-full border border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)]/10 disabled:opacity-50"
        >
          {changeRole.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isSelf ? (
            <ShieldAlert className="size-4" />
          ) : (
            <Check className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}
