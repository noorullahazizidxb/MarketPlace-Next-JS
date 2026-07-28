"use client";

import React from "react";
import { LogIn, LogOut } from "lucide-react";
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
  onClose: () => void;
}

export function MobileAuthSection({
  auth,
  onOpenAuthModal,
  onLogout,
  onClose,
}: Props) {
  const { user, isLoggedIn, roleType, isLoading } = auth;

  if (isLoading) return <AuthSkeleton />;

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onOpenAuthModal(NAVBAR_AUTH_MODAL_STEPS.signIn);
          onClose();
        }}
      >
        <LogIn className="mr-2 app-icon-sm" />
        Login / Sign Up
      </Button>
    );
  }

  const menuItems = getMenuItems(roleType);

  return (
    <div className="space-y-2">
      <div className="mb-4 flex items-center gap-3 px-1">
        <UserAvatar className="app-text-heading" />
        <UserInfoBlock user={user} />
      </div>

      {menuItems.map((item) => (
        <Button
          key={item.href}
          variant="outline"
          className="w-full justify-start"
        >
          {item.authStep ? (
            // Modal-triggering items: no navigation
            <span
              role="button"
              className="flex items-center"
              onClick={() => {
                onOpenAuthModal(item.authStep!);
                onClose();
              }}
            >
              <item.icon className="mr-2 app-icon-sm" />
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              onClick={onClose}
              className="flex items-center"
            >
              <item.icon className="mr-2 app-icon-sm" />
              {item.label}
            </Link>
          )}
        </Button>
      ))}

      <Button
        variant="ghost"
        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        onClick={async () => {
          onClose();
          await onLogout();
        }}
      >
        <LogOut className="mr-2 app-icon-sm" />
        Log out
      </Button>
    </div>
  );
}
