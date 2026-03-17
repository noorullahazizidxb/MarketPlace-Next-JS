"use client";

import { PropsWithChildren, useEffect } from "react";
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
import HomePromoBanner from "@/components/ui/home-promo-banner";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";
import { AnimatedBg } from "@/components/ui/animated-bg";
import { useRealtimeSocial } from "../../hooks/useRealtimeSocial";

/* --------------  NEW SKELETON IMPORTS  -------------- */
import { HomePromoBannerSkeleton } from "@/components/skeletons/HomePromoBannerSkeleton";
import { ListingsPromoBannerSkeleton } from "@/components/skeletons/ListingsPromoBannerSkeleton";
import { PartnersSkeleton } from "@/components/skeletons/PartnersSkeleton";
/* ---------------------------------------------------- */

const PUBLIC_PATH_PREFIXES = [
  "/blog",
  "/blogs",
  "/listings",
  "/about",
  "/contact",
  "/sign-in",
  "/sign-up",
];

export function AppShell({ children }: PropsWithChildren) {
  const { isAdmin, user, loading, token } = useAuth();
  useRealtimeSocial(token ?? undefined);
  const appReady = useAppStore((s) => s.appReady);
  const hideChromeGlobal = useAppStore((s) => s.hideChrome);
  const pathname = usePathname();
  const router = useRouter();
  const density = useUIStore((s) => s.density);

  useEffect(() => {
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

  const hideChrome =
    pathname &&
    [
      "/sign-in",
      "/sign-up",
      "/reset-password",
      "/forgot-password",
      "/verify-email",
    ].includes(pathname);

  const shouldRedirectAdmin =
    !loading && !!pathname && pathname.startsWith("/admin") && !isAdmin;
  const shouldRedirectAuth =
    !loading && !hideChrome && !user && !isPublicRoute;
  const shouldRedirectRoot = !loading && pathname === "/";
  const redirecting =
    shouldRedirectAdmin || shouldRedirectAuth || shouldRedirectRoot;

  useEffect(() => {
    if (loading) return;
    if (hideChrome) return;
    try {
      if (pathname && pathname.startsWith("/admin") && !isAdmin) {
        router.replace("/listings");
        return;
      }
    } catch { }
    if (!user && !isPublicRoute) {
      router.replace("/sign-in");
    }
  }, [loading, hideChrome, user, isPublicRoute, router, pathname, isAdmin]);

  useEffect(() => {
    if (pathname === "/") {
      if (loading) return;
      const timeoutId = window.setTimeout(() => {
        const isBlogHost = window.location.host.toLowerCase().includes("blog.");
        if (isBlogHost) {
          router.replace("/blog");
          return;
        }
        if (user) {
          router.replace(isAdmin ? "/admin" : "/listings");
          return;
        }
        router.replace("/listings");
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [pathname, loading, user, isAdmin, router]);

  /* ----------  FULL-SCREEN LOADER  ---------- */
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

  /* ----------  THEME NOT READY  ---------- */
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

  /* ----------  AUTH PAGES  ---------- */
  if (hideChrome || hideChromeGlobal) {
    return (
      <main id="main-content" className="flex-1" dir="ltr">
        <PageTransition>{children}</PageTransition>
      </main>
    );
  }

  /* ----------  ADMIN LAYOUT  ---------- */
  if (isAdmin) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        <AnimatedBg />
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
          <>
            {/* skeleton while assets load */}
            {!appReady ? <PartnersSkeleton /> : <Partners />}
            <SiteFooter />
          </>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  /* ----------  NORMAL USER LAYOUT  ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBg />
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

      {/*  SAME ORDER AS BEFORE – swap skeletons while !appReady  */}
      {!appReady ? (
        <>
          <HomePromoBannerSkeleton />
          <PartnersSkeleton />
          <SiteFooter />
        </>
      ) : (
        <>
          <HomePromoBanner />
          <Partners />
          <SiteFooter />
        </>
      )}

      <BottomNavigation />
    </div>
  );
}
