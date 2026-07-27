import {
  LayoutDashboard,
  HelpCircle,
  Lock,
  Settings,
  FileText,
  type LucideIcon,
  AlertTriangle,
  User,
} from "lucide-react";

import {
  NAVBAR_AUTH_MODAL_STEPS,
  type NavbarAuthModalStep,
} from "./navbar.constants";
import type { NavbarRoleType } from "./navbar.types";

export interface MenuItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If set, clicking opens the auth modal with this step instead of navigating */
  authStep?: NavbarAuthModalStep;
}

const SHARED: MenuItemConfig[] = [
  { label: "User Panel", href: "/user-panel", icon: LayoutDashboard },
  { label: "Support", href: "/support", icon: HelpCircle },
  // {
  //   label: "Change Password",
  //   href: "/change-password",
  //   icon: Lock,
  //   authStep: NAVBAR_AUTH_MODAL_STEPS.recoverPassword,
  // },
//   { label: "Track Orders",    href: "/contract-reports",                icon: ShoppingCart },
];

const ADMIN: MenuItemConfig[] = [
  { label: "Contract Report",  href: "/contract-reports",  icon: FileText },
  { label: "Automation(AddContract)",  href: "/automation",  icon: FileText },
  { label: "Error Logs",  href: "/error-logs",  icon: AlertTriangle },
  // { label: "Manage Users",  href: "admin/manage-users",  icon: Users },

  { label: "Settings",         href: "/settings",          icon: Settings },
];

const VISITOR: MenuItemConfig[] = [
  { label: "MY Purchases",  href: "/contract-reports",  icon: FileText },
  { label: "User Treasury",    href: "/user-treasury",     icon: User },
];

function getRoleSpecificItems(roleType: NavbarRoleType): MenuItemConfig[] {
  switch (roleType) {
    case "admin":
    case "counter":
      return ADMIN;
    case "visitor":
      return VISITOR;
    case "user":
    default:
      return [];
  }
}

/** Returns deduplicated menu items for the given parseToken roleType. */
export function getMenuItems(roleType: NavbarRoleType): MenuItemConfig[] {
  const seen = new Set<string>();
  return [...SHARED, ...getRoleSpecificItems(roleType)].filter(({ href }) => {
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}