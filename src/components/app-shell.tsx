"use client";

import { PropsWithChildren } from "react";
import { useAuth } from "@/lib/use-auth";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Topbar } from "@/components/topbar";
import { PageTransition } from "@/components/page-transition";
import Loading from "@/components/loading";
import { useAppStore } from "@/store/app.store";

export function AppShell({ children }: PropsWithChildren) {
  const { isAdmin } = useAuth();
  const appReady = useAppStore((s) => s.appReady);
  const pathname = usePathname();

  // If we're on an auth-related page, do not render Topbar/Sidebar/footer-like chrome
  const hideChrome =
    pathname &&
    [
      "/sign-in",
      "/sign-up",
      "/reset-password",
      "/forgot-password",
      "/verify-email",
    ].includes(pathname);

  if (!appReady)
    return (
      <div className="min-h-screen grid place-items-center">
        <Loading size={24} />
      </div>
    );

  if (hideChrome) {
    return (
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }
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
