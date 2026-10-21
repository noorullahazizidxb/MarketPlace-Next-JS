"use client";

import { PropsWithChildren, useMemo } from "react";
import { useAuth } from "@/lib/use-auth";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { useLanguage } from "@/components/providers/language-provider";
import { AdminBaseLayout } from "@/components/ui/templates/admin-base-layout";
import { buildAdminNavGroups } from "@/components/layout/admin-nav";
import { LanguageDropdown } from "@/components/ui/molecules/language-dropdown";
import { ThemeToggle } from "@/components/ui/molecules/theme-toggle";
import { asset } from "@/lib/assets";
import BottomNavigation from "@/components/ui/organisms/BottomNavigation";
import { MobileQuickBar } from "@/components/ui/organisms/MobileQuickBar";
import { AnimatedBg } from "@/components/ui/atoms/animated-bg";

/**
 * Admin chrome via AdminBaseLayout + AppSidebar.
 * Menu items come from buildAdminNavGroups (same routes as legacy layout/sidebar).
 */
export function AdminShell({ children }: PropsWithChildren) {
  const { user } = useAuth();
  // Shared sign-out flow: clears client stores + query cache, revokes the refresh token, redirects.
  const { signOut } = useSignOut();
  const { t, locale } = useLanguage();
  const direction = locale === "fa" ? "rtl" : "ltr";

  const navGroups = useMemo(() => buildAdminNavGroups(t as any), [t]);

  const sidebarUser = useMemo(
    () => ({
      name: user?.fullName || user?.name || user?.email || "Admin",
      email: user?.email || "",
      avatar: asset(user?.avatarUrl || user?.photo || "/favicon.svg"),
    }),
    [user],
  );

  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-x-clip">
      <AnimatedBg />
      <div className="relative z-10 flex-1 min-h-0">
        <AdminBaseLayout
          navGroups={navGroups}
          user={sidebarUser}
          onLogout={signOut}
          homeUrl="/admin"
          direction={direction}
          showThemeCustomizer={true}
          sidebarBrandSubtitle="Marketplace"
          headerRightSlot={
            <div className="flex items-center gap-2">
              <LanguageDropdown className="hidden sm:inline-flex" />
              <ThemeToggle />
            </div>
          }
          mobileHeaderSlot={<LanguageDropdown />}
          userMenuLabels={{
            account: t("profile") || "Profile",
            billing: t("myListings") || "My listings",
            notifications: t("notifications") || "Notifications",
            signOutSecurely: "Sign out securely",
            logOut: "Log out",
          }}
        >
          {children}
        </AdminBaseLayout>
      </div>
      <BottomNavigation />
      <MobileQuickBar />
    </div>
  );
}
