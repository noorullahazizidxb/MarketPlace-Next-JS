"use client";

import { PropsWithChildren, useMemo } from "react";
import { useAuth } from "@/lib/use-auth";
import { useLocalMutation } from "@/lib/api-hooks";
import { useLanguage } from "@/components/providers/language-provider";
import { AdminBaseLayout } from "@/components/ui/templates/admin-base-layout";
import { buildAdminNavGroups } from "@/components/layout/admin-nav";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { ThemeToggle } from "@/theme/theme-toggle";
import { asset } from "@/lib/assets";
import BottomNavigation from "@/components/ui/BottomNavigation";
import { MobileQuickBar } from "@/components/ui/MobileQuickBar";
import { AnimatedBg } from "@/components/ui/animated-bg";

/**
 * Admin chrome via AdminBaseLayout + AppSidebar.
 * Menu items come from buildAdminNavGroups (same routes as legacy layout/sidebar).
 */
export function AdminShell({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const logout = useLocalMutation("post", "/api/logout");
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
    <div className="relative isolate min-h-screen flex flex-col">
      <AnimatedBg />
      <div className="relative z-10 flex-1 min-h-0">
        <AdminBaseLayout
          navGroups={navGroups}
          user={sidebarUser}
          onLogout={() => logout.mutate(undefined as any)}
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
