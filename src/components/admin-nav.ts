import { LayoutDashboard, Settings, Layers3, PlusCircle, User } from "lucide-react";

export const adminNavItems = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/listings", label: "Listings", Icon: Layers3 },
  { href: "/listings/create", label: "New Listing", Icon: PlusCircle },
  { href: "/profile", label: "Profile", Icon: User },
  { href: "/settings", label: "Settings", Icon: Settings },
] as const;
