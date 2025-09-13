"use client";

import { PropsWithChildren } from "react";
import { useAuth } from "@/lib/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/page-transition";

export function AppShell({ children }: PropsWithChildren) {
  const { isAdmin } = useAuth();
  if (isAdmin) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main id="main-content" className="flex-1 container-padded py-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main id="main-content" className="flex-1 container-padded py-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
