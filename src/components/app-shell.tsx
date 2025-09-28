"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Topbar } from "@/components/topbar";
import BottomNavigation from "@/components/BottomNavigation";
import { PageTransition } from "@/components/page-transition";
import Loading from "@/components/loading";
import { useAppStore } from "@/store/app.store";

const PUBLIC_PATH_PREFIXES = [
  "/listings",
  "/about",
  "/contact",
  "/sign-in",
  "/sign-up",
];

export function AppShell({ children }: PropsWithChildren) {
  const { isAdmin, user, loading } = useAuth();
  const appReady = useAppStore((s) => s.appReady);
  const pathname = usePathname();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const isPublicRoute = (() => {
    if (!pathname) return true;
    if (pathname === "/") return true;
    return PUBLIC_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  })();

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

  useEffect(() => {
    if (loading) return;
    // Don't redirect away from auth pages (sign-in/sign-up etc.)
    if (hideChrome) {
      setRedirecting(false);
      return;
    }
    if (!user && !isPublicRoute) {
      setRedirecting(true);
      router.replace("/sign-in");
      return;
    }
    setRedirecting(false);
  }, [user, loading, isPublicRoute, router, hideChrome]);

  if (!appReady || loading || redirecting)
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
          <Navbar className="hidden md:block" />
          <main id="main-content" className="flex-1 container-padded py-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hidden md:block">
        <Topbar />
      </div>
      <main id="main-content" className="flex-1 container-padded py-6">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNavigation />
    </div>
  );
}
