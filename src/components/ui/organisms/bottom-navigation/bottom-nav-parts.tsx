"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { Button } from "@/components/ui/molecules/button";
import { asset } from "@/lib/assets";

export const UserHeaderCard: React.FC<{ user: any }> = ({ user }) => {
  const { t } = useLanguage();
  if (!user) return null;
  const avatar = asset(user?.photo) || "/favicon.svg";
  const name = user?.fullName || user?.name || user?.email || t("you");
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
      <div className="relative size-12 overflow-hidden rounded-2xl border border-border">
        <Image src={avatar} alt="" fill sizes="48px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="app-text-body font-semibold line-clamp-1">{name}</p>
        {user?.email && (
          <p className="app-text-caption text-muted-foreground line-clamp-1">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

export const ActionTile: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, onClick }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 rounded-2xl border border-transparent bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
  >
    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
      <Icon className="size-5" />
    </span>
    <span className="app-text-caption text-center font-medium leading-tight line-clamp-2">
      {label}
    </span>
  </motion.button>
);

export const LogoutRow: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const { t } = useLanguage();
  const { signOut, isPending } = useSignOut();

  const handleLogout = async () => {
    onDone?.();
    await signOut();
  };

  return (
    <div className="flex justify-end border-t border-border/50 pt-3">
      <Button
        type="button"
        variant="ghost"
        onClick={handleLogout}
        disabled={isPending}
        loading={isPending}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        LeftIcon={LogOut}
      >
        {t("logout")}
      </Button>
    </div>
  );
};
