"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { usePrefetchOnIdle } from "@/lib/use-prefetch-on-idle";
import { useUIStore } from "@/store/ui.store";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Topbar } from "@/components/layout/topbar";
import BottomNavigation from "@/components/ui/BottomNavigation";
import { PageTransition } from "@/components/ui/page-transition";
import Loading from "@/components/ui/loading";
import { useAppStore } from "@/store/app.store";
import SiteFooter from "@/components/layout/site-footer";
import { Partners } from "@/components/ui/partners";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import { AnimatedBg } from "@/components/ui/animated-bg";
import { useRealtimeSocial } from "../../hooks/useRealtimeSocial";

const PUBLIC_PATH_PREFIXES = [
  "/listings",
  "/about",
  "/contact",
  "/sign-in",
  "/sign-up",
];

export function AppShell({ children }: PropsWithChildren) {
  const { isAdmin, user, loading, token } = useAuth();
  // Initialize realtime socket listeners (blogs/stories)
  useRealtimeSocial(token ?? undefined);
  const appReady = useAppStore((s) => s.appReady);
  const hideChromeGlobal = useAppStore((s) => s.hideChrome);
  const pathname = usePathname();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const density = useUIStore((s) => s.density);

  useEffect(() => {
    // reflect density as data attribute for global CSS hooks
    if (typeof document !== "undefined") {
      document.documentElement.dataset.density = density;
    }
  }, [density]);
  usePrefetchOnIdle(
    ["/listings/create", "/my-listings", "/profile", "/pendings", "/about"],
    true
  );

  const isPublicRoute = (() => {
    if (!pathname) return true;
    if (pathname === "/") return true;
    return PUBLIC_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  })();
  const isHome =
    pathname === "/" || (pathname ? pathname.startsWith("/listings") : false);

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
    if (hideChrome) {
      setRedirecting(false);
      return;
    }
    // Restrict /admin/* routes to admins only
    try {
      if (pathname && pathname.startsWith("/admin") && !isAdmin) {
        setRedirecting(true);
        router.replace("/listings");
        return;
      }
    } catch (_) {}
    if (!user && !isPublicRoute) {
      setRedirecting(true);
      router.replace("/sign-in");
    }
  }, [loading, hideChrome, user, isPublicRoute, router, pathname]);

  useEffect(() => {
    // Reset redirecting state after pathname changes
    setRedirecting(false);
  }, [pathname]);

  if (loading || redirecting)
    return (
      <div
        className="fixed inset-0 grid place-items-center overflow-hidden bg-[hsl(var(--background))]"
        aria-busy="true"
        aria-live="polite"
      >
        <Loading size={24} />
      </div>
    );

  // Do not render the app until the theme has loaded (appReady). Show a blocking loader for all routes.
  if (!appReady) {
    return (
      <div
        className="fixed inset-0 grid place-items-center overflow-hidden bg-[hsl(var(--background))]"
        aria-busy="true"
        aria-live="polite"
      >
        <Loading size={24} />
      </div>
    );
  }

  if (hideChrome || hideChromeGlobal) {
    return (
      <main id="main-content" className="flex-1" dir="ltr">
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }
  if (isAdmin) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        {appReady && <AnimatedBg />}
        <Sidebar />
        <div className="flex flex-col min-h-screen min-w-0 w-full">
          <Navbar className="hidden md:block" />
          <main
            id="main-content"
            className="flex-1 container-padded py-6"
            dir="ltr"
          >
            <PageTransition>{children}</PageTransition>
          </main>
          {appReady && (
            <>
              <Partners />
              <SiteFooter />
            </>
          )}
        </div>
        {appReady && <BottomNavigation />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {appReady && <AnimatedBg />}
      <div className="hidden md:block">
        <Topbar />
      </div>
      <main
        id="main-content"
        className="flex-1 container-padded py-6"
        dir="ltr"
      >
        <PageTransition>{children}</PageTransition>
      </main>
      {appReady && (
        <>
          <Partners />
          <SiteFooter />
        </>
      )}
      {appReady && <BottomNavigation />}
    </div>
  );
}
