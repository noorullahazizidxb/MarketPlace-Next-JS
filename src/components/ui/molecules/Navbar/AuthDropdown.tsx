"use client";

import React from "react";
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Button } from "../../atoms/Button";

import { AuthSkeleton, UserAvatar, UserInfoBlock } from "./shared";
import { NavbarAuth } from "./navbar.types";
import {
  NAVBAR_AUTH_MODAL_STEPS,
  type NavbarAuthModalStep,
} from "./navbar.constants";
import { getMenuItems } from "./menu-items";
import Link from "next/link";

interface Props {
  auth: NavbarAuth;
  onOpenAuthModal: (step: NavbarAuthModalStep) => void;
  onLogout: () => Promise<void>;
  /** Avatar + chevron only — for mobile header */
  compact?: boolean;
}

export function AuthDropdown({
  auth,
  onOpenAuthModal,
  onLogout,
  compact = false,
}: Props) {
  const { user, isLoggedIn, roleType, isLoading } = auth;

  if (isLoading) return <AuthSkeleton />;

  if (!isLoggedIn) {
    return (
      <Button
        variant="primary"
        onClick={() => onOpenAuthModal(NAVBAR_AUTH_MODAL_STEPS.signIn)}
      >
        <LogIn className="mr-2 app-icon-sm" />
        Sign In
      </Button>
    );
  }

  const menuItems = getMenuItems(roleType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex min-h-[var(--ctrl-h-sm)] items-center hover:bg-accent ${compact ? "gap-1 px-2" : "gap-2 px-3"}`}
        >
          <UserAvatar />
          {!compact && (
            <span className="max-w-[120px] truncate app-text-body">
              {user.fullName}
            </span>
          )}
          <ChevronDown className="app-icon-xs shrink-0 text-muted-foreground" />
          {compact && <span className="sr-only">{user.fullName}</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <UserInfoBlock user={user} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            // authStep items trigger a modal; others navigate via href
            {...(item.authStep
              ? {
                  onSelect: (e) => {
                    e.preventDefault();
                    onOpenAuthModal(item.authStep!);
                  },
                }
              : { asChild: true })}
            className="cursor-pointer"
          >
            {item.authStep ? (
              <>
                <item.icon className="mr-2 app-icon-sm" />
                {item.label}
              </>
            ) : (
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 app-icon-sm" />
                {item.label}
              </Link>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 app-icon-sm" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
