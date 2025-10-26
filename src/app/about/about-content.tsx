"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Box,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Image from "next/image";

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2000&auto=format&fit=crop"
            alt="Community background"
            className="h-full w-full rounded-[20px] object-cover opacity-50"
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/40 via-[hsl(var(--background))]/40 to-[hsl(var(--background))]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
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
                  {t("browseListings")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-5 py-3 h-auto"
                >
                  {t("becomeSeller")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-xl font-semibold">{t("missionHeading")}</h2>
            <p className="mt-2 text-[hsl(var(--foreground))]/80">
              {t("missionText")}
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-xl font-semibold">{t("visionHeading")}</h2>
            <p className="mt-2 text-[hsl(var(--foreground))]/80">
              {t("visionText")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 className="text-2xl font-semibold">{t("howItWorks")}</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">{t("listYourItem")}</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              {t("listYourItemDesc")}
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">{t("connectSecurely")}</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              {t("connectSecurelyDesc")}
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">{t("transactConfidence")}</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              {t("transactConfidenceDesc")}
            </p>
          </div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
              <h3 className="font-semibold">{t("enjoyFlexibility")}</h3>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
              {t("enjoyFlexibilityDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-10">
          <h2 className="text-2xl font-semibold">
            {t("storyBehind")} {marketplaceName}
          </h2>
          <div className="mt-4 space-y-3 text-[hsl(var(--foreground))]/80">
            <p>{t("aboutStoryPara1")}</p>
            <p>
              {t("aboutStoryPara2").replace(
                "{marketplaceName}",
                marketplaceName
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <h2 className="text-2xl font-semibold">{t("meetTheTeam")}</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: t("teamAlexName"), title: t("teamAlexTitle") },
            { name: t("teamSamiraName"), title: t("teamSamiraTitle") },
            { name: t("teamDiegoName"), title: t("teamDiegoTitle") },
          ].map((m, i) => (
            <article
              key={m.name}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              <Image
                src={`https://images.unsplash.com/photo-15${
                  i + 1
                }27157730-0d3a42b2c3f4?q=80&w=600&auto=format&fit=crop`}
                alt={m.name}
                className="h-24 w-24 rounded-full object-cover"
                width={96}
                height={96}
              />
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="text-sm text-[hsl(var(--foreground))]/70">
                {m.title}
              </p>
              <p className="mt-2 text-sm text-[hsl(var(--foreground))]/80">
                {t("passionTagline")}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--primary))]/15 via-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/15 p-8 text-center">
          <h2 className="text-2xl font-semibold">{t("joinCommunity")}</h2>
          <p className="mt-2 text-foreground/80">{t("joinCommunityText")}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="primary">
              <Link href="/listings" className="px-5 py-3 h-auto">
                {t("browseListings")}
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/sign-in" className="px-5 py-3 h-auto">
                {t("becomeSeller")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
