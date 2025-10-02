"use client";
import { Mail, Headset, MapPin, HelpCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ContactContent() {
  const { t, isRtl } = useLanguage();

  function Header() {
    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          {t("getInTouch")}
        </h1>
        <p className="mt-2 text-[hsl(var(--foreground))]/80 max-w-2xl">
          {t("contactHeaderSubtitle")}
        </p>
      </section>
    );
  }

  function ContactInfo() {
    const cards = [
      {
        title: t("generalInquiries"),
        text: "contact@your-marketplace-name.com",
        href: "mailto:contact@your-marketplace-name.com",
        Icon: Mail,
      },
      {
        title: t("technicalSupport"),
        text: "support@your-marketplace-name.com",
        href: "mailto:support@your-marketplace-name.com",
        Icon: Headset,
      },
      {
        title: t("ourLocation"),
        text: "Your City, State",
        href: "#",
        Icon: MapPin,
      },
      {
        title: t("faqs"),
        text: t("findAnswers"),
        href: "/faq",
        Icon: HelpCircle,
      },
    ];
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition hover:[background-color:hsl(var(--link-hover-bg,var(--muted))_/_0.15)]"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <c.Icon className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-[hsl(var(--foreground))]/80">
                    {c.text}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <Header />
      <ContactInfo />
    </div>
  );
}
