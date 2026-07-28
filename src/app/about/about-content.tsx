"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Box,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Users,
  MapPin,
  LayoutList,
  Star,
  Globe,
  Handshake,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutCtaBanner from "@/components/ui/about-cta-banner";
import { aboutImages } from "@/lib/public-images";
import { Tooltip } from "@/components/ui/tooltip";
import { AUTHOR, BRAND, ORGANIZATION_NAME } from "@/lib/site-config";

export function AboutContent({
  marketplaceName,
}: {
  readonly marketplaceName: string;
}) {
  const { t, isRtl } = useLanguage();
  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="pb-20 app-shell-page" data-app-page="about">
      {/* Brand strip */}
      <section className="pt-8 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <Image
            src={BRAND.logo}
            alt={`${ORGANIZATION_NAME} logo`}
            width={240}
            height={72}
            className="h-14 sm:h-16 w-auto object-contain"
            priority
          />
          <Image
            src={BRAND.mark}
            alt={`${ORGANIZATION_NAME} brand mark`}
            width={120}
            height={120}
            className="h-16 sm:h-20 w-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutImages.hero}
            alt="Community background"
            className="h-full w-full rounded-[20px] object-cover opacity-50"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/40 to-[var(--background)]" />
          <motion.div
            className="absolute -left-10 top-8 h-36 w-36 rounded-3xl border border-white/20 bg-[color-mix(in oklab, var(--accent) 14%, transparent)] backdrop-blur-xl"
            animate={{ rotate: [10, 24, 10], y: [0, 10, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          />
        </div>
        <div className="relative z-10 py-16 sm:py-24">
          <div className={`max-w-3xl ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
                {t("futureFlexible")}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[var(--foreground)]/85">
                {t("aboutHero").replace("{marketplaceName}", marketplaceName)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Tooltip content={t("browseListings")} side="bottom">
                  <Button asChild variant="primary">
                    <Link
                      href="/listings"
                      className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                    >
                      {t("browseListings")} <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                    </Link>
                  </Button>
                </Tooltip>
                <Tooltip content={t("becomeSeller")} side="bottom">
                  <Button asChild variant="secondary">
                    <Link
                      href="/sign-in"
                      className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                    >
                      {t("becomeSeller")} <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                    </Link>
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mt-12 sm:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { heading: t("missionHeading"), text: t("missionText"), gradient: "from-[var(--primary)]/20 to-[var(--accent)]/10" },
            { heading: t("visionHeading"), text: t("visionText"), gradient: "from-[var(--accent)]/20 to-[var(--secondary)]/10" },
          ].map((item, i) => (
            <motion.div
              key={item.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl border border-[var(--border)] bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-6`}
            >
              <h2 className="text-xl font-semibold">{item.heading}</h2>
              <p className="mt-2 text-[var(--foreground)]/80 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats & Metrics */}
      <section className="mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold">{t("byTheNumbers" as any) || "By the Numbers"}</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {t("trustedByThousands" as any) || "Trusted by thousands across Afghanistan"}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "20,000+", labelKey: "activeBuyers", fallback: "Active Buyers", Icon: Users },
            { value: "34", labelKey: "provincesServed", fallback: "Provinces Served", Icon: MapPin },
            { value: "50,000+", labelKey: "listingsPosted", fallback: "Listings Posted", Icon: LayoutList },
            { value: "98%", labelKey: "satisfactionRate", fallback: "Satisfaction Rate", Icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="size-10 mx-auto rounded-xl bg-[var(--primary)]/15 grid place-items-center ring-1 ring-[var(--primary)]/25 group-hover:bg-[var(--primary)]/25 transition-colors">
                <stat.Icon className="size-5 text-[var(--primary)]" />
              </div>
              <div className="mt-3 text-2xl font-bold tabular-nums bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                {(t(stat.labelKey as any) || stat.fallback) as string}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Verification */}
      <section className="mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 p-6 md:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">{t("whyTrustUs") || "Why Trust Us?"}</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t("builtOnTransparency") || "Built on transparency, security, and community standards"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                Icon: ShieldCheck,
                titleKey: "verifiedSellers",
                titleFallback: "Verified Sellers",
                descKey: "verifiedSellersDesc",
                descFallback: "All sellers are reviewed and verified before listing products.",
              },
              {
                Icon: Globe,
                titleKey: "nationwideCoverage",
                titleFallback: "Nationwide Coverage",
                descKey: "nationwideCoverageDesc",
                descFallback: "Active across all 34 provinces with local language support.",
              },
              {
                Icon: Handshake,
                titleKey: "safeTransactions",
                titleFallback: "Safe Transactions",
                descKey: "safeTransactionsDesc",
                descFallback: "Buyer protection and dispute resolution for peace of mind.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <div className="size-10 shrink-0 rounded-xl bg-[var(--primary)]/15 grid place-items-center ring-1 ring-[var(--primary)]/20">
                  <item.Icon className="size-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {(t(item.titleKey as any) || item.titleFallback) as string}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {(t(item.descKey as any) || item.descFallback) as string}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="mt-12 sm:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold"
        >
          {t("howItWorks")}
        </motion.h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Box, label: t("listYourItem"), desc: t("listYourItemDesc"), step: "01" },
            { icon: MessageCircle, label: t("connectSecurely"), desc: t("connectSecurelyDesc"), step: "02" },
            { icon: ShieldCheck, label: t("transactConfidence"), desc: t("transactConfidenceDesc"), step: "03" },
            { icon: Sparkles, label: t("enjoyFlexibility"), desc: t("enjoyFlexibilityDesc"), step: "04" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Step number watermark */}
              <span className="absolute top-3 right-4 text-6xl font-black text-[var(--foreground)]/5 select-none leading-none group-hover:text-[var(--accent)]/10 transition-colors">
                {item.step}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="size-10 rounded-xl bg-[var(--primary)]/15 grid place-items-center ring-1 ring-[var(--primary)]/25">
                  <item.icon className="h-5 w-5 text-[var(--primary)]" />
                </span>
                <h3 className="font-semibold text-sm">{item.label}</h3>
              </div>
              <p className="text-sm text-[var(--foreground)]/75 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)]/30 p-6 md:p-10"
        >
          <h2 className="text-2xl font-semibold">
            {t("storyBehind")} {marketplaceName}
          </h2>
          <div className="mt-4 space-y-3 text-[var(--foreground)]/80 leading-relaxed">
            <p>{t("aboutStoryPara1")}</p>
            <p>
              {t("aboutStoryPara2").replace(
                "{marketplaceName}",
                marketplaceName
              )}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="mt-12 sm:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold"
        >
          {t("meetTheTeam")}
        </motion.h2>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/20 blur-md" />
            <Image
              src={AUTHOR.image}
              alt={`${AUTHOR.name}, ${AUTHOR.role}`}
              className="relative h-32 w-32 rounded-full object-cover object-top ring-2 ring-[var(--border)]"
              width={128}
              height={128}
              priority
            />
          </div>
          <h3 className="mt-4 font-semibold text-lg">{AUTHOR.name}</h3>
          <p className="text-sm text-[var(--primary)] font-medium mt-0.5">
            {AUTHOR.role}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground)]/70 leading-relaxed">
            Founder of {ORGANIZATION_NAME} — building {marketplaceName} and digital products for Afghanistan.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href={`mailto:${AUTHOR.email}`}
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <Mail className="size-4" aria-hidden />
              {AUTHOR.email}
            </Link>
            <Link
              href={`tel:${AUTHOR.phone}`}
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <Phone className="size-4" aria-hidden />
              {AUTHOR.phone}
            </Link>
            <Link
              href={AUTHOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden />
              Portfolio
            </Link>
          </div>
        </motion.article>
      </section>

      {/* CTA */}
      <section className="mt-12 sm:mt-16">
        <AboutCtaBanner />
      </section>
    </main>
  );
}
