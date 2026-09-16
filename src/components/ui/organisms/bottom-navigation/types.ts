import type React from "react";

export type BottomNavDescriptor = {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  show?: (ctx: { isAuthed: boolean; isAdmin: boolean }) => boolean;
  onClick?: () => void;
};

export type BottomNavigationProps = {
  isAdmin?: boolean;
  className?: string;
  items?: BottomNavDescriptor[];
  forceVisible?: boolean;
};

export type NavAuthContext = {
  isAuthed: boolean;
  isAdmin: boolean;
};
