import type { RoleOption } from "./types";

export const ROLE_OPTIONS: ReadonlyArray<{ value: RoleOption; label: string; description: string }> = [
  { value: "USER", label: "User", description: "Standard account with listing access." },
  { value: "REPRESENTATIVE", label: "Representative", description: "Manages regional listings & WhatsApp regions." },
  { value: "ADMIN", label: "Admin", description: "Full administrative privileges." },
];

export const ROLE_BADGE_CLASSES: Record<string, string> = {
  ADMIN: "bg-destructive/10 text-destructive border-destructive/40 dark:text-destructive",
  USER: "bg-info/10 text-info border-info/35 dark:text-info",
  REPRESENTATIVE: "bg-warning/10 text-warning border-warning/40 dark:text-warning",
};

/** Backend may send roles as strings or `{ role }` objects. */
export function roleNames(roles: unknown[] | undefined): string[] {
  return (roles || [])
    .map((r: any) => (typeof r === "string" ? r : r?.role || r?.name || ""))
    .filter(Boolean);
}

/** Highest-privilege role is treated as the user's primary role. */
export function primaryRole(roles: unknown[] | undefined): RoleOption {
  const names = roleNames(roles);
  if (names.includes("ADMIN")) return "ADMIN";
  if (names.includes("REPRESENTATIVE")) return "REPRESENTATIVE";
  return "USER";
}
