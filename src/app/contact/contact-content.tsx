"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Headset,
  MapPin,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import ContactForm from "@/components/ui/contact-form";

function ContactHero() {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-12 sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--accent)/0.18),transparent_28%),radial-gradient(circle_at_85%_30%,hsl(var(--primary)/0.16),transparent_30%)]" />
        <motion.div
          className="absolute -left-10 top-6 h-36 w-36 rounded-3xl border border-white/15 bg-[hsl(var(--accent))/0.12] backdrop-blur-2xl"
          animate={{ rotate: [12, 26, 12], y: [0, 10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-8 bottom-6 h-24 w-24 rounded-full border-2 border-[hsl(var(--accent))/0.35]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "text-right" : "text-left"}>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[hsl(var(--accent))]">
            {t("contact")}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl md:text-5xl">
            {t("getInTouch")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[hsl(var(--foreground))/0.8] sm:text-base">
            {t("contactHeaderSubtitle")}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: MessageSquare, title: t("generalInquiries"), text: t("sendMessage") },
            { icon: Headset, title: t("technicalSupport"), text: t("findAnswers") },
            { icon: ShieldCheck, title: t("faqs"), text: t("browseListings") },
          ].map((item) => (
            <div
              key={String(item.title)}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.72] p-4 backdrop-blur-sm"
            >
              <item.icon className="size-5 text-[hsl(var(--accent))]" />
              <h2 className="mt-3 text-sm font-semibold text-[hsl(var(--foreground))]">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--foreground))/0.72]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactInfoCards() {
  const { t } = useLanguage();
  const cards = [
    {
      title: t("generalInquiries"),
      text: t("contactEmailValue"),
      href: `mailto:${t("contactEmailValue")}`,
      Icon: Mail,
    },
    {
      title: t("technicalSupport"),
      text: t("contactSupportEmailValue"),
      href: `mailto:${t("contactSupportEmailValue")}`,
      Icon: Headset,
    },
    {
      title: t("ourLocation"),
      text: t("contactLocationValue"),
      href: "#",
      Icon: MapPin,
    },
    {
      title: t("faqs"),
      text: t("findAnswers"),
      href: "/about",
      Icon: HelpCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <a
          key={String(card.title)}
          href={card.href}
          className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/88 p-5 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-[hsl(var(--accent))/0.4] hover:shadow-[0_22px_50px_-26px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[hsl(var(--accent))/0.14] p-3 text-[hsl(var(--accent))] transition-transform group-hover:scale-110">
              <card.Icon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[hsl(var(--foreground))]">{card.title}</h3>
              <p className="mt-1 text-sm text-[hsl(var(--foreground))/0.74]">{card.text}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function BusinessHoursCard() {
  const { t } = useLanguage();
  const hours = [
    { day: "Saturday – Thursday", time: "8:00 AM – 8:00 PM", open: true },
    { day: "Friday", time: "10:00 AM – 4:00 PM", open: true },
    { day: "Public Holidays", time: "Closed", open: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-xl bg-[hsl(var(--primary))]/15 grid place-items-center">
          <Clock className="size-4 text-[hsl(var(--primary))]" />
        </div>
        <h3 className="font-semibold text-sm">
          {(t("businessHours" as any) || "Business Hours") as string}
        </h3>
      </div>
      <div className="space-y-2">
        {hours.map((row) => (
          <div key={row.day} className="flex items-center justify-between text-sm gap-2">
            <span className="text-[hsl(var(--foreground))]/70 text-xs">{row.day}</span>
            <span
              className={`font-medium text-xs px-2 py-0.5 rounded-full border ${row.open
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/30 dark:text-emerald-400"
                  : "bg-[hsl(var(--muted))]/30 text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]"
                }`}
            >
              {row.open && <CheckCircle2 className="size-3 inline mr-1" />}
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function ContactContent() {
  const { isRtl, t } = useLanguage();

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="container-padded py-8 space-y-8">
      <ContactHero />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <ContactInfoCards />
          <BusinessHoursCard />
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)))] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
              {t("contactSupportEyebrow")}
            </p>
            <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground))/0.76]">
              {t("contactSupportBody")}
            </p>
          </div>
        </div>

        <ContactForm />
      </section>
    </div>
  );
}
