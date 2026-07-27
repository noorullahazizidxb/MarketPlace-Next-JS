import {
  LayoutDashboard,
  Layers3,
  PlusCircle,
  User,
  Layers,
  Bell,
  Megaphone,
  List,
  LayoutGrid,
  Info,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { SidebarNavGroup } from "@/components/ui/organisms/app-sidebar";

export type AdminNavTranslator = (key: string) => string;

export function buildAdminNavGroups(t: AdminNavTranslator): SidebarNavGroup[] {
  const items: { href: string; label: string; Icon: LucideIcon }[] = [
    { href: "/admin", label: t("dashboard"), Icon: LayoutDashboard },
    { href: "/listings", label: t("listings"), Icon: Layers3 },
    { href: "/blogs", label: "Blogs", Icon: Info },
    { href: "/admin/notifications", label: t("notifications"), Icon: Bell },
    { href: "/admin/ads", label: t("advertisements"), Icon: Megaphone },
    { href: "/admin/contacts", label: t("contacts"), Icon: Mail },
    { href: "/admin/users", label: t("usersManagement"), Icon: User },
    {
      href: "/admin/categories",
      label: t("categories") || "Categories",
      Icon: Layers,
    },
    { href: "/pendings", label: t("pendingLists"), Icon: List },
    {
      href: "/admin/manage-content-status",
      label: "Content Status",
      Icon: LayoutGrid,
    },
    { href: "/listings/create", label: t("newListing"), Icon: PlusCircle },
    { href: "/admin/stories", label: t("stories"), Icon: Megaphone },
    { href: "/settings/appearance", label: t("themes"), Icon: Layers },
  ];

  return [
    {
      label: t("dashboard") || "Admin",
      items: items.map((item) => ({
        title: item.label,
        url: item.href,
        icon: item.Icon,
      })),
    },
  ];
}
