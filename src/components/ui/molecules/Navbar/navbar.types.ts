import type { ReactNode } from "react";

import type { NavbarAuthModalStep } from "./navbar.constants";

/** Mirrors `@repo/auth` `AuthUserRoleType` — UI does not depend on auth package. */
export type NavbarRoleType = "admin" | "user" | "visitor" | "counter";

export interface NavbarAuthUser {
  fullName: string;
  email: string;
  companyName: string;
  initials: string;
}

export interface NavbarAuth {
  user: NavbarAuthUser;
  roleType: NavbarRoleType;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  currency: string;
  logout: () => Promise<void> | void;
}

export interface NavbarProps {
  auth?: NavbarAuth;
  /** Opens the app-level auth modal (e.g. from `@repo/auth` `openAuthModal`). */
  onOpenAuthModal?: (step: NavbarAuthModalStep) => void;
  navbarActions?: ReactNode;
}

export const GUEST_AUTH: NavbarAuth = {
  user: { fullName: "Guest", email: "", companyName: "", initials: "G" },
  roleType: "visitor",
  isLoggedIn: false,
  isAdmin: false,
  isLoading: false,
  currency: "USD",
  logout: () => Promise.resolve(),
};
