"use client";
import React from "react";
import { useAuth } from "@/lib/use-auth";
import { ShieldCheck } from "lucide-react";
import UsersDashboard from "@/components/users/users-dashboard";
import { useLanguage } from "@/components/providers/language-provider";

// Thin access-control wrapper. Logic and UI live in modular components.
export default function AdminUsersPage() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("ADMIN");
  const { t } = useLanguage();
  if (!isAdmin) {
    return (
      <div className="container-padded py-16">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <ShieldCheck className="mx-auto size-12 text-[hsl(var(--accent))]" />
          <h1 className="text-2xl font-semibold">{t("notAuthorized")}</h1>
          <p className="subtle">{t("adminPrivilegesNeeded")}</p>
        </div>
      </div>
    );
  }
  return <UsersDashboard />;
}
