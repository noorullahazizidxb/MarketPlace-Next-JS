"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, Sun, Moon, Globe } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "@/lib/theme/theme-context";
import { cn } from "@/lib/cn";

// ─── Navbar V2: Glassmorphic centered pill navigation ───────────────────────

export function NavbarGlass({ className = "" }: { className?: string }) {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { t, locale } = useLanguage();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/listings", label: t("listings" as any) || "Listings" },
    { href: "/blogs", label: t("blogs" as any) || "Blogs" },
    { href: "/about", label: t("about" as any) || "About" },
  ];

  return (
    <header
      className={cn("sticky top-0 z-40 w-full py-3 px-4", className)}
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-border/50 bg-background/70 px-5 py-2.5 backdrop-blur-xl shadow-glass">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Home"
        >
          <div className="size-8 overflow-hidden rounded-full ring-1 ring-border/40">
            <Image
              src="/brand/devminds-logo.png"
              alt="DevMinds"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden sm:block font-semibold app-text-label tracking-tight">
            DevMinds
          </span>
        </Link>

        {/* Pill nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 app-text-label font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Search"
            className="grid size-8 place-items-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid size-8 place-items-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
          <button
            type="button"
            aria-label="Open menu"
            onClick={toggleMobileMenu}
            className="md:hidden grid size-8 place-items-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Navbar V3: Minimal top bar ──────────────────────────────────────────────

export function NavbarMinimal({ className = "" }: { className?: string }) {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { locale } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-12 items-center justify-between gap-3 border-b border-border/40 bg-background/95 px-4 backdrop-blur",
        className,
      )}
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <Link
        href="/"
        aria-label="Home"
        className="flex items-center gap-2 group"
      >
        <Image
          src="/brand/devminds-logo.png"
          alt=""
          width={24}
          height={24}
          className="opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <span className="hidden sm:block app-text-label font-semibold tracking-tight">
          DevMinds
        </span>
      </Link>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-3.5" />
          ) : (
            <Moon className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          aria-label="Language"
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
        >
          <Globe className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Menu"
          onClick={toggleMobileMenu}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          <Menu className="size-3.5" />
        </button>
      </div>
    </header>
  );
}

// ─── Navbar V4: Full-width with category bar ─────────────────────────────────

export function NavbarFullwidth({ className = "" }: { className?: string }) {
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { t, locale } = useLanguage();
  const { theme, setTheme } = useTheme();

  const categories = [
    "Electronics",
    "Automotive",
    "Real Estate",
    "Services",
    "Jobs",
    "Fashion",
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background",
        className,
      )}
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      {/* Top bar */}
      <div className="flex h-14 items-center gap-4 px-[var(--space-page-x)]">
        <button
          type="button"
          aria-label="Menu"
          onClick={toggleMobileMenu}
          className="sm:hidden grid size-9 place-items-center rounded-xl border border-border text-muted-foreground"
        >
          <Menu className="size-5" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="Home"
        >
          <div className="size-9 overflow-hidden rounded-xl ring-1 ring-border/40">
            <Image
              src="/brand/devminds-logo.png"
              alt="DevMinds"
              width={36}
              height={36}
              className="object-contain p-0.5"
              priority
            />
          </div>
          <span className="hidden sm:block font-bold app-text-heading-sm tracking-tight">
            DevMinds
          </span>
        </Link>

        <div className="flex-1 mx-4 hidden md:block">
          <div className="flex h-9 items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 text-muted-foreground app-text-body">
            <Search className="size-4 shrink-0" />
            <span>{t("search" as any) || "Search marketplace…"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Category strip */}
      <div className="hidden md:flex h-9 items-center gap-0.5 overflow-x-auto border-t border-border/60 bg-muted/30 px-[var(--space-page-x)] no-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/listings?category=${cat.toLowerCase()}`}
            className="shrink-0 rounded-md px-3 py-1 app-text-caption font-medium text-muted-foreground whitespace-nowrap transition-colors hover:bg-background hover:text-foreground"
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}
