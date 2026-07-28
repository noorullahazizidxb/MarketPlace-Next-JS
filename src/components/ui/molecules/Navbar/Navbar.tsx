"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../sheet";
import { MegaMenu } from "../../landing/mega-menu";
import { ModeToggle } from "../../mode-toggle";
import { Button } from "../../atoms/Button";
import { Logo } from "../../atoms/logo";

import { NAV_ITEMS, type NavbarAuthModalStep } from "./navbar.constants";
import { useBrandName } from "./use-brand-name";
import { GUEST_AUTH, type NavbarProps } from "./navbar.types";
import { getLocalizedHomeHref, handleNavClick } from "./navbar.utils";

import { AuthDropdown } from "./AuthDropdown";
import { MobileHeaderActions } from "./MobileHeaderActions";
import {
  MobileNavItem,
  MobileSolutionsMenu,
  MobileSheetHeader,
} from "./MobileNav";
import Link from "next/link";

/* ── Desktop nav link ──────────────────────────────────── */
const NAV_LINK_CLASS =
  "inline-flex min-h-[var(--ctrl-h)] w-max items-center justify-center px-4 py-2 app-text-body transition-colors hover:text-primary focus:text-primary focus:outline-none";

function DesktopNavItem({ item }: { item: (typeof NAV_ITEMS)[number] }) {
  if (item.hasMegaMenu) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent px-4 py-2 app-text-body hover:bg-transparent hover:text-primary focus:bg-transparent">
          {item.name}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <MegaMenu />
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={item.href}
          className={NAV_LINK_CLASS}
          onClick={(e) => handleNavClick(e, item.href)}
        >
          {item.name}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

/* ── Navbar ────────────────────────────────────────────── */
export function Navbar({ onOpenAuthModal, auth, navbarActions }: NavbarProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

  const resolvedAuth = auth ?? GUEST_AUTH;
  const { isAdmin, isLoggedIn } = resolvedAuth;

  const homeHref = useMemo(() => getLocalizedHomeHref(pathname), [pathname]);
  const brandName = useBrandName();

  const navItems = useMemo(() => {
    return NAV_ITEMS.map((item) =>
      item.name === "Home" ? { ...item, href: homeHref } : item,
    );
  }, [homeHref]);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const handleOpenAuthModal = useCallback(
    (step: NavbarAuthModalStep) => {
      onOpenAuthModal?.(step);
    },
    [onOpenAuthModal],
  );

  const handleLogout = useCallback(async () => {
    await resolvedAuth.logout();
    window.location.reload();
  }, [resolvedAuth]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-transparent backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-2 md:px-8 lg:px-10">
          <Link href={homeHref} className="flex min-w-0 items-center">
            <Logo size={36} />

            <span className="truncate mt-1.5  max-w-[7.5rem] font-bold sm:max-w-none">
              {brandName}
            </span>
          </Link>

          <NavigationMenu className="hidden md:block xl:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <DesktopNavItem key={item.name} item={item} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {navbarActions}
            <ModeToggle variant="ghost" />

            <div className="hidden items-center space-x-2 md:flex">
              {isLoggedIn && isAdmin && (
                <Button variant="ghost" size="sm" className="min-h-[var(--ctrl-h-sm)] px-3">
                  <a
                    href="/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <LayoutDashboard className="mr-2 app-icon-sm" />
                    Admin Panel
                  </a>
                </Button>
              )}

              <AuthDropdown
                auth={resolvedAuth}
                onOpenAuthModal={handleOpenAuthModal}
                onLogout={handleLogout}
              />
            </div>

            <div className="flex items-center gap-1.5 md:hidden">
              {isLoggedIn && isAdmin && (
                <Button variant="ghost" size="sm" className="min-h-[var(--ctrl-h-sm)] w-9 shrink-0">
                  <a href="/admin" className="flex items-center justify-center">
                    <LayoutDashboard className="app-icon-md" />
                    <span className="sr-only">Dashboard</span>
                  </a>
                </Button>
              )}

              <MobileHeaderActions
                auth={resolvedAuth}
                onOpenAuthModal={handleOpenAuthModal}
                onLogout={handleLogout}
              />

              {/* <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="min-h-[var(--ctrl-h-sm)] w-9 shrink-0"
                  >
                    <Menu className="app-icon-md" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:w-[400px] [&>button]:hidden"
                >
                  <MobileSheetHeader onClose={closeSheet} />

                  <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                    {navItems.map((item) =>
                      item.hasMegaMenu ? (
                        <MobileSolutionsMenu
                          key={item.name}
                          open={isSolutionsOpen}
                          onOpenChange={setIsSolutionsOpen}
                          onClose={closeSheet}
                        />
                      ) : (
                        <MobileNavItem
                          key={item.name}
                          item={item}
                          onClose={closeSheet}
                        />
                      ),
                    )}
                  </nav>
                </SheetContent>
              </Sheet> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
