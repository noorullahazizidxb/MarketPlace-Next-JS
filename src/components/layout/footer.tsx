"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CircleUserRound,
  Info,
  LayoutList,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/molecules/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useComponentVariants } from "@/hooks/use-component-variants";
import type { FooterVariant } from "@/lib/theme/types";

const exploreLinks = [
  { href: "/listings", key: "listings", Icon: LayoutList },
  { href: "/blogs", key: "blogs", Icon: BookOpen },
  { href: "/about", key: "about", Icon: Info },
] as const;

const accountLinks = [
  { href: "/profile", key: "profile", Icon: CircleUserRound },
  { href: "/my-listings", key: "myListings", Icon: LayoutList },
  { href: "/contact", key: "contact", Icon: MessageSquareText },
] as const;

export default function Footer({
  variantOverride,
}: {
  variantOverride?: FooterVariant;
}) {
  const { locale, t } = useLanguage();
  const { variants } = useComponentVariants();
  const variant = variantOverride ?? variants.footer;
  const year = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer
        className="mt-[var(--space-section)] border-t border-border/70 bg-background/80"
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <div className="container-padded flex flex-wrap items-center justify-between gap-3 py-4 app-text-caption text-muted-foreground">
          <p>© {year} {t("marketplace")}. {t("allRightsReserved")}</p>
          <nav aria-label={t("explore")} className="flex flex-wrap gap-4">
            {exploreLinks.map(({ href, key }) => (
              <Link key={href} href={href} className="hover:text-foreground">
                {t(key)}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  if (variant === "compact") {
    return (
      <footer
        className="mt-[var(--space-section)] border-t border-border/70 bg-background/80"
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <div className="container-padded flex flex-wrap items-center justify-between gap-4 py-5">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 app-text-label font-semibold"
            aria-label={t("marketplace")}
          >
            <span className="modern-navbar-logo size-8">
              <Image
                src="/brand/devminds-logo.png"
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </span>
            {t("marketplace")}
          </Link>
          <nav aria-label={t("explore")} className="flex flex-wrap gap-4 app-text-caption">
            {exploreLinks.map(({ href, key }) => (
              <Link key={href} href={href} className="app-footer-link">
                {t(key)}
              </Link>
            ))}
          </nav>
          <p className="app-text-caption text-muted-foreground">
            © {year} {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    );
  }

  if (variant === "editorial") {
    return (
      <footer
        className="relative mt-[var(--space-section)] overflow-hidden border-t border-border/70 bg-background/80"
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_65%)]" />
        <div className="container-padded relative py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="app-text-caption uppercase app-tracking-caps text-primary">
              {t("explore")}
            </span>
            <h2 className="mt-2 app-text-heading font-semibold">
              {t("marketplace")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl app-text-body text-muted-foreground">
              {t("platformMissionShort")}
            </p>
            <nav aria-label={t("explore")} className="mt-6 flex flex-wrap justify-center gap-3">
              {exploreLinks.map(({ href, key, Icon }) => (
                <Link key={href} href={href} className="app-footer-link rounded-full border border-border bg-background/70 px-4 py-2">
                  <Icon className="app-icon-xs" />
                  {t(key)}
                </Link>
              ))}
            </nav>
          </div>
          <p className="mt-8 border-t border-border/70 pt-4 text-center app-text-caption text-muted-foreground">
            © {year} {t("marketplace")}. {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="relative mt-[var(--space-section)] border-t border-border/70 bg-background/80"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_68%)]" />
      <div className="app-footer-shell">
        <div className="app-footer-surface">
          <div className="app-footer-grid">
            <section className="min-w-0">
              <Link
                href="/listings"
                className="inline-flex items-center gap-[var(--space-gap)]"
                aria-label={t("marketplace")}
              >
                <span className="modern-navbar-logo">
                  <Image
                    src="/brand/devminds-logo.png"
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span>
                  <strong className="block app-text-heading-sm">
                    {t("marketplace")}
                  </strong>
                  <span className="app-text-caption text-muted-foreground">
                    {t("premiumTagline")}
                  </span>
                </span>
              </Link>
              <p className="mt-[var(--space-gap)] max-w-md app-text-body text-muted-foreground">
                {t("platformMissionShort")}
              </p>
              <div className="mt-[var(--space-gap)] flex flex-wrap gap-[var(--space-gap)]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/45 px-3 py-1 app-text-caption text-muted-foreground">
                  <ShieldCheck className="app-icon-xs text-primary" />
                  Safer community discovery
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/45 px-3 py-1 app-text-caption text-muted-foreground">
                  <Sparkles className="app-icon-xs text-primary" />
                  Modern local marketplace
                </span>
              </div>
            </section>

            <nav aria-label={t("explore")}>
              <h2 className="app-text-label uppercase app-tracking-caps">
                {t("explore")}
              </h2>
              <ul className="mt-[var(--space-gap)] space-y-1">
                {exploreLinks.map(({ href, key, Icon }) => (
                  <li key={href}>
                    <Link href={href} className="app-footer-link">
                      <Icon className="app-icon-xs" />
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section>
              <h2 className="app-text-label uppercase app-tracking-caps">
                {t("profile")}
              </h2>
              <ul className="mt-[var(--space-gap)] space-y-1">
                {accountLinks.map(({ href, key, Icon }) => (
                  <li key={href}>
                    <Link href={href} className="app-footer-link">
                      <Icon className="app-icon-xs" />
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild size="sm" className="mt-[var(--space-gap)]">
                <Link href="/listings/create">
                  Create listing
                  <ArrowUpRight className="app-icon-xs" />
                </Link>
              </Button>
            </section>
          </div>

          <div className="flex flex-col gap-[var(--space-gap)] border-t border-border/70 px-[var(--space-card)] py-[var(--space-filter)] app-text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {t("marketplace")}.{" "}
              {t("allRightsReserved")}
            </p>
            <a
              href="mailto:Noorullah.azizi2040@gmail.com"
              className="app-footer-link"
            >
              <Mail className="app-icon-xs" />
              Noorullah.azizi2040@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
