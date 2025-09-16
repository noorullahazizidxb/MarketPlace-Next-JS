"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Github, Linkedin, Twitter } from "lucide-react";

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
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative mt-16">
      {/* Background gradient accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-[hsl(var(--primary))]/30 via-fuchsia-400/20 to-cyan-400/20 blur-3xl dark:from-[hsl(var(--primary))]/20" />
        <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] ring-1 ring-[hsl(var(--border))]/20">
          <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[hsl(var(--primary))]/30 to-[hsl(var(--primary))]/60 text-[hsl(var(--background))] shadow-inner shadow-black/20">
                  <span className="text-lg font-bold">M</span>
                </div>
                <div>
                  <div className="text-base font-semibold tracking-tight">
                    Marketplace
                  </div>
                  <div className="text-xs text-[hsl(var(--foreground))]/70">
                    Premium digital goods & services
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-[hsl(var(--foreground))]/80">
                Building a trusted platform for creators and businesses with a
                focus on quality, security, and delightful user experiences.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/80">
                Explore
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:translate-x-0.5 link"
                    >
                      <span>{n.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 p-2 transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--primary))]/10 hover:shadow-md"
                  >
                    <Icon className="h-4 w-4 text-[hsl(var(--foreground))]/70 transition-colors group-hover:text-[hsl(var(--primary))]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/80">
                Newsletter
              </div>
              <p className="mt-3 text-sm text-[hsl(var(--foreground))]/80">
                Subscribe to get product updates, launch announcements, and
                curated content.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const email = String(fd.get("email") || "");
                  if (!email) return;
                  // TODO: hook to your newsletter API
                }}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-sm outline-none transition focus:border-[hsl(var(--primary))]/50 focus:ring-2 focus:ring-[hsl(var(--primary))]/20"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))]/70 to-[hsl(var(--primary))] px-3 py-2 text-sm font-medium text-[hsl(var(--background))] shadow-lg shadow-[hsl(var(--primary))]/20 transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* QR Code */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/80">
                Scan & Visit
              </div>
              <div className="mt-3 rounded-2xl border border-[hsl(var(--border))] bg-white p-3 shadow-sm dark:bg-white/90">
                <QRCode
                  value="https://yourdomain.com"
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-2 text-xs text-[hsl(var(--foreground))]/70">
                Scan to open our website
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[hsl(var(--border))] px-6 py-4 text-xs text-[hsl(var(--foreground))]/70 sm:flex-row lg:px-10">
            <div>
              © {new Date().getFullYear()} Marketplace. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <Link href="/privacy" className="link">
                Privacy
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/terms" className="link">
                Terms
              </Link>
              <span className="opacity-30">•</span>
              <a href="mailto:support@yourdomain.com" className="link">
                support@yourdomain.com
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
