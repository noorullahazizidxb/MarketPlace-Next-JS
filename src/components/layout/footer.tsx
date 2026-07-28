"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Info,
  Briefcase,
  Users,
  Mail,
  FileText,
  Shield,
  BookOpen,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { useLanguage } from "@/components/providers/language-provider";

const socials = [
  { href: "https://github.com/yourorg", label: "GitHub", Icon: Github },
  {
    href: "https://linkedin.com/company/yourorg",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: "https://twitter.com/yourorg", label: "Twitter", Icon: Twitter },
];

const nav = [
  { href: "/about", key: "about", Icon: Info },
  { href: "/services", key: "services", Icon: Briefcase },
  { href: "/careers", key: "careers", Icon: Users },
  { href: "/contact", key: "contact", Icon: Mail },
];

const resources = [
  { href: "/listings", key: "listings", Icon: LayoutList },
  { href: "/blogs", key: "blog", Icon: BookOpen },
  { href: "/about", key: "about", Icon: Info },
  { href: "/contact", key: "contact", Icon: Mail },
];

export default function Footer() {
  const { locale, t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  return (
    <footer className="relative mt-10 md:mt-12" dir={locale === "fa" ? "rtl" : "ltr"}>
      {/* Background scene — only CSS vars, no hardcoded palette colors */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full blur-3xl opacity-60"
          style={{ background: "conic-gradient(from 180deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--accent) 14%, transparent), color-mix(in oklab, var(--secondary) 14%, transparent))" }}
        />
        <div className="absolute -bottom-14 -left-10 size-56 rounded-full blur-2xl"
          style={{ background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)" }}
        />
        <div className="absolute top-10 right-10 size-44 rounded-full blur-2xl"
          style={{ background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)" }}
        />
      </div>

      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] ring-1 ring-[var(--border)]/20">
          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 overflow-hidden rounded-2xl bg-white shadow-sm shrink-0">
                  <Image src="/brand/devminds-logo.png" alt="DevMinds" width={56} height={56} sizes="56px" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-semibold tracking-tight">
                    {t("marketplace")}
                  </div>
                  <div className="text-xs text-[var(--foreground)]/70">
                    {t("premiumTagline")}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--foreground)]/80">
                {t("platformMissionShort")}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Tooltip content={t("getStarted")} side="top">
                  <Button asChild size="sm" variant="primary">
                    <Link
                      href="/get-started"
                      className="inline-flex items-center gap-1"
                    >
                      {t("getStarted")} <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </Tooltip>
                <Tooltip content={t("contact")} side="top">
                  <Button asChild size="sm" variant="ghost" className="glass">
                    <Link href="/contact">{t("contact")}</Link>
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/80">
                {t("explore")}
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Tooltip content={t(n.key as any)} side="right">
                      <Link
                        href={n.href}
                        className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:translate-x-0.5 link"
                      >
                        {n.Icon ? (
                          <n.Icon className="h-4 w-4 text-[var(--foreground)]/70" />
                        ) : null}
                        <span>{t(n.key as any)}</span>
                      </Link>
                    </Tooltip>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <Tooltip key={href} content={label} side="top">
                    <Link
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-xl border border-[var(--border)] bg-[var(--muted)]/10 p-2 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10 hover:shadow-md"
                    >
                      <Icon className="h-4 w-4 text-[var(--foreground)]/70 transition-colors group-hover:text-[var(--primary)]" />
                    </Link>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/80">
                Resources
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {resources.map((r) => (
                  <li key={r.href}>
                    <Tooltip content={t(r.key as any)} side="right">
                      <Link
                        href={r.href}
                        className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:translate-x-0.5 link"
                      >
                        <r.Icon className="h-4 w-4 text-[var(--foreground)]/70" />
                        <span>{t(r.key as any)}</span>
                      </Link>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/80">
                {t("newsletter")}
              </div>
              <p className="mt-3 text-sm text-[var(--foreground)]/80">
                {t("subscribeBlurb")}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsletterEmail) return;
                  // TODO: hook to your newsletter API
                  setNewsletterEmail("");
                }}
                className="mt-3 flex items-center gap-2"
              >
                <Tooltip content={t("subscribeEmail")} side="top">
                  <div className="w-full">
                    <TextInputField
                      label={t("subscribeEmail")}
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={setNewsletterEmail}
                      icon={<Mail className="size-4" />}
                    />
                  </div>
                </Tooltip>
                <Tooltip content={t("subscribe")} side="top">
                  <Button type="submit" size="sm" variant="primary">
                    {t("subscribe")}
                  </Button>
                </Tooltip>
              </form>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-start">
              <div className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/80">
                {t("scanVisit")}
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm dark:bg-white/90">
                <QRCode
                  value="https://noorullah-azizi.my.canva.site"
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-2 text-xs text-[var(--foreground)]/70">
                {t("scanToOpen")}
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] px-6 py-4 text-xs text-[var(--foreground)]/70 sm:flex-row lg:px-10">
            <div>
              © {new Date().getFullYear()} {t("marketplace")}.{" "}
              {t("allRightsReserved")}
            </div>
            <div className="flex items-center gap-3">
              <Tooltip content={t("privacy")} side="top">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 link"
                >
                  <Shield className="h-4 w-4" /> {t("privacy")}
                </Link>
              </Tooltip>
              <span className="opacity-30">•</span>
              <Tooltip content={t("terms")} side="top">
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 link"
                >
                  <FileText className="h-4 w-4" /> {t("terms")}
                </Link>
              </Tooltip>
              <span className="opacity-30">•</span>
              <Tooltip content="Noorullah.azizi2040@gmail.com" side="top">
                <a
                  href="mailto:Noorullah.azizi2040@gmail.com"
                  className="inline-flex items-center gap-2 link"
                >
                  <Mail className="h-4 w-4" /> Noorullah.azizi2040@gmail.com
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
