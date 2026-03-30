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
  BadgeCheck,
  Globe,
  Handshake,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutCtaBanner from "@/components/ui/about-cta-banner";
import { aboutImages } from "@/lib/public-images";

export function AboutContent({
  marketplaceName,
}: {
  readonly marketplaceName: string;
}) {
  const { t, isRtl } = useLanguage();
  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutImages.hero}
            alt="Community background"
            className="h-full w-full rounded-[20px] object-cover opacity-50"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/40 via-[hsl(var(--background))]/40 to-[hsl(var(--background))]" />
          <motion.div
            className="absolute -left-10 top-8 h-36 w-36 rounded-3xl border border-white/20 bg-[hsl(var(--accent))/0.14] backdrop-blur-xl"
            animate={{ rotate: [10, 24, 10], y: [0, 10, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          />
        </div>
        <div className="relative z-10 container-padded py-16 sm:py-24">
          <div className={`max-w-3xl ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {t("futureFlexible")}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[hsl(var(--foreground))]/85">
                {t("aboutHero").replace("{marketplaceName}", marketplaceName)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary">
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                  >
                    {t("browseListings")} <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                  >
                    {t("becomeSeller")} <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-padded mt-12 sm:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { heading: t("missionHeading"), text: t("missionText"), gradient: "from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10" },
            { heading: t("visionHeading"), text: t("visionText"), gradient: "from-[hsl(var(--accent))]/20 to-[hsl(var(--secondary))]/10" },
          ].map((item, i) => (
            <motion.div
              key={item.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-6`}
            >
              <h2 className="text-xl font-semibold">{item.heading}</h2>
              <p className="mt-2 text-[hsl(var(--foreground))]/80 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats & Metrics */}
      <section className="container-padded mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold">{t("byTheNumbers" as any) || "By the Numbers"}</h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
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
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="size-10 mx-auto rounded-xl bg-[hsl(var(--primary))]/15 grid place-items-center ring-1 ring-[hsl(var(--primary))]/25 group-hover:bg-[hsl(var(--primary))]/25 transition-colors">
                <stat.Icon className="size-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="mt-3 text-2xl font-bold tabular-nums bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                {(t(stat.labelKey as any) || stat.fallback) as string}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Verification */}
      <section className="container-padded mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--accent))]/5 p-6 md:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">{t("whyTrustUs") || "Why Trust Us?"}</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
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
                className="flex items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
              >
                <div className="size-10 shrink-0 rounded-xl bg-[hsl(var(--primary))]/15 grid place-items-center ring-1 ring-[hsl(var(--primary))]/20">
                  <item.Icon className="size-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {(t(item.titleKey as any) || item.titleFallback) as string}
                  </h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    {(t(item.descKey as any) || item.descFallback) as string}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container-padded mt-12 sm:mt-16">
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
              className="relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Step number watermark */}
              <span className="absolute top-3 right-4 text-6xl font-black text-[hsl(var(--foreground))]/5 select-none leading-none group-hover:text-[hsl(var(--accent))]/10 transition-colors">
                {item.step}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="size-10 rounded-xl bg-[hsl(var(--primary))]/15 grid place-items-center ring-1 ring-[hsl(var(--primary))]/25">
                  <item.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                </span>
                <h3 className="font-semibold text-sm">{item.label}</h3>
              </div>
              <p className="text-sm text-[hsl(var(--foreground))]/75 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container-padded mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--secondary))]/30 p-6 md:p-10"
        >
          <h2 className="text-2xl font-semibold">
            {t("storyBehind")} {marketplaceName}
          </h2>
          <div className="mt-4 space-y-3 text-[hsl(var(--foreground))]/80 leading-relaxed">
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
      <section className="container-padded mt-12 sm:mt-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold"
        >
          {t("meetTheTeam")}
        </motion.h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: t("teamAlexName"), title: t("teamAlexTitle") },
            { name: t("teamSamiraName"), title: t("teamSamiraTitle") },
            { name: t("teamDiegoName"), title: t("teamDiegoTitle") },
          ].map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/30 to-[hsl(var(--accent))]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={aboutImages.team[i]}
                  alt={m.name}
                  className="relative h-24 w-24 rounded-full object-cover ring-2 ring-[hsl(var(--border))] group-hover:ring-[hsl(var(--primary))]/50 transition-all duration-300"
                  width={96}
                  height={96}
                />
              </div>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-sm text-[hsl(var(--primary))] font-medium mt-0.5">
                {m.title}
              </p>
              <p className="mt-2 text-sm text-[hsl(var(--foreground))]/70 leading-relaxed">
                {t("passionTagline")}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-padded mt-12 sm:mt-16">
        <AboutCtaBanner />
      </section>
    </main>
  );
}
