import { LayoutDashboard, Settings, Layers3, PlusCircle, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import React from "react";

// Use key instead of raw translated label; consumers should translate via t()
export const adminNavItems = [
  { href: "/", key: "dashboard", Icon: LayoutDashboard },
  { href: "/listings", key: "listings", Icon: Layers3 },
  { href: "/listings/create", key: "newListing", Icon: PlusCircle },
  { href: "/profile", key: "profile", Icon: User },
  { href: "/settings", key: "settings", Icon: Settings },
] as const;

export function AdminNavContainer({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  return React.createElement('div', { dir: locale === 'fa' ? 'rtl' : 'ltr' }, children);
}
