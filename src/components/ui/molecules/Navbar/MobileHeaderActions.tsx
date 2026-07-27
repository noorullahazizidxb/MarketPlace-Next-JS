"use client";

import React from "react";
import { Button } from "../../atoms/Button";

import { AuthSkeleton } from "./shared";
import { AuthDropdown } from "./AuthDropdown";
import { NavbarAuth } from "./navbar.types";
import { NAVBAR_AUTH_MODAL_STEPS, type NavbarAuthModalStep } from "./navbar.constants";

interface Props {
  auth: NavbarAuth;
  onOpenAuthModal: (step: NavbarAuthModalStep) => void;
  onLogout: () => Promise<void>;
}

export function MobileHeaderActions({ auth, onOpenAuthModal, onLogout }: Props) {
  const { isLoggedIn, isLoading } = auth;

  if (isLoading) return <AuthSkeleton />;

  if (isLoggedIn) {
    return (
      <AuthDropdown
        compact
        auth={auth}
        onOpenAuthModal={onOpenAuthModal}
        onLogout={onLogout}
      />
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      className="min-h-[var(--ctrl-h-sm)] shrink-0 px-3"
      onClick={() => onOpenAuthModal(NAVBAR_AUTH_MODAL_STEPS.signIn)}
    >
      Login/Register
    </Button>
  );
}
