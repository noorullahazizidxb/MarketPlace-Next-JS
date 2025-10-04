"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

export default function ContactForm() {
  const { t } = useLanguage();
  const { isRtl } = useLanguage();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    setMessage("");
    try {
      // Mock API delay
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setMessage(t("sendMessageSuccess"));
    } catch (e) {
      setStatus("error");
      setMessage(t("sendMessageError"));
    }
  }

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-12"
    >
      <form
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4"
        action={onSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">{t("fullName")}</label>
            <input
              required
              name="name"
              type="text"
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-2 outline-none focus:ring-2 ring-[hsl(var(--primary))]/40"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t("emailAddress")}</label>
            <input
              required
              name="email"
              type="email"
              placeholder="jane@example.com"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-2 outline-none focus:ring-2 ring-[hsl(var(--primary))]/40"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">{t("subject")}</label>
            <select
              name="subject"
              required
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-2 outline-none focus:ring-2 ring-[hsl(var(--primary))]/40"
              defaultValue=""
              aria-label="Subject"
            >
              <option value="" disabled>
                {t("chooseSubject")}
              </option>
              <option>{t("generalQuestion")}</option>
              <option>{t("listingSupport")}</option>
              <option>{t("accountIssue")}</option>
              <option>{t("partnershipInquiry")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">{t("phoneOptional")}</label>
            <input
              name="phone"
              type="tel"
              placeholder="+1 555-123-4567"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-2 outline-none focus:ring-2 ring-[hsl(var(--primary))]/40"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">{t("message")}</label>
          <textarea
            required
            name="message"
            rows={5}
            placeholder={t("messagePlaceholder")}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-2 outline-none focus:ring-2 ring-[hsl(var(--primary))]/40"
          />
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-sm">
            {status === "success" && (
              <span className="text-[hsl(140 60% 60%)]">{message}</span>
            )}
            {status === "error" && (
              <span className="text-[hsl(0 70% 60%)]">{message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center rounded-xl bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow-sm transition hover:bg-[hsl(var(--primary))]/90 disabled:opacity-60"
          >
            {status === "loading" ? t("sending") : t("sendMessage")}
          </button>
        </div>
      </form>
    </section>
  );
}
