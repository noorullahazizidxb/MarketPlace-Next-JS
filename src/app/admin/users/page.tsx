"use client";
import React from "react";
import { useAuth } from "@/lib/use-auth";
import { ShieldCheck } from "lucide-react";
import UsersDashboard from "@/components/users/users-dashboard";

// Thin access-control wrapper. Logic and UI live in modular components.
export default function AdminUsersPage() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("ADMIN");
  if (!isAdmin) {
    return (
      <div className="container-padded py-16">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <ShieldCheck className="mx-auto size-12 text-[hsl(var(--accent))]" />
          <h1 className="text-2xl font-semibold">Not Authorized</h1>
          <p className="subtle">
            You need administrator privileges to access the Users dashboard.
          </p>
        </div>
      </div>
    );
  }
  return <UsersDashboard />;
}
