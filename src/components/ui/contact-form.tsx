"use client";

import { useState } from "react";
import { Loader2, Mail, MessageSquareText, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useLocalMutation } from "@/lib/api-hooks";

export default function ContactForm() {
  const { t, isRtl } = useLanguage();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const createContact = useLocalMutation<any>("post", "/api/contacts");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    setMessage("");
    try {
      const body = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        phone: (formData.get("phone") as string) || undefined,
        message: formData.get("message") as string,
      };
      await createContact.mutateAsync(body);
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
      className="w-full"
    >
      <form
        className="space-y-5 rounded-[2rem] border border-[hsl(var(--border))] bg-[linear-gradient(180deg,hsl(var(--card)),hsl(var(--background)))] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] sm:p-8"
        action={onSubmit}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--accent))]">
            {t("sendMessage")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {t("contactFormTitle")}
          </h2>
          <p className="text-sm leading-7 text-[hsl(var(--foreground))/0.74]">
            {t("contactFormSubtitle")}
          </p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.68] p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--card))]/88 p-3">
            <Mail className="size-4 text-[hsl(var(--accent))]" />
            <span className="text-xs text-[hsl(var(--foreground))/0.74]">
              {t("contactEmailValue")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--card))]/88 p-3">
            <PhoneCall className="size-4 text-[hsl(var(--accent))]" />
            <span className="text-xs text-[hsl(var(--foreground))/0.74]">
              {t("contactPhoneValue")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[hsl(var(--card))]/88 p-3">
            <MessageSquareText className="size-4 text-[hsl(var(--accent))]" />
            <span className="text-xs text-[hsl(var(--foreground))/0.74]">
              {t("contactResponseTime")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t("fullName")}</label>
            <input
              required
              name="name"
              type="text"
              placeholder={t("signUpPlaceholderFullName")}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.8] px-4 py-3 outline-none transition focus:border-[hsl(var(--accent))/0.45] focus:ring-2 ring-[hsl(var(--primary))]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t("emailAddress")}</label>
            <input
              required
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.8] px-4 py-3 outline-none transition focus:border-[hsl(var(--accent))/0.45] focus:ring-2 ring-[hsl(var(--primary))]/30"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t("subject")}</label>
            <select
              name="subject"
              required
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.8] px-4 py-3 outline-none transition focus:border-[hsl(var(--accent))/0.45] focus:ring-2 ring-[hsl(var(--primary))]/30"
              defaultValue=""
              aria-label="Subject"
            >
              <option value="" disabled>
                {t("chooseSubject")}
              </option>

              <option value="generalQuestion">{t("generalQuestion")}</option>
              <option value="listingSupport">{t("listingSupport")}</option>
              <option value="accountIssue">{t("accountIssue")}</option>
              <option value="partnershipInquiry">
                {t("partnershipInquiry")}
              </option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t("phoneOptional")}</label>
            <input
              name="phone"
              type="tel"
              placeholder={t("signUpPlaceholderPhone")}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.8] px-4 py-3 outline-none transition focus:border-[hsl(var(--accent))/0.45] focus:ring-2 ring-[hsl(var(--primary))]/30"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("message")}</label>
          <textarea
            required
            name="message"
            rows={6}
            placeholder={t("messagePlaceholder")}
            className="w-full rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--background))/0.8] px-4 py-3 outline-none transition focus:border-[hsl(var(--accent))/0.45] focus:ring-2 ring-[hsl(var(--primary))]/30"
          />
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-sm">
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-lg transition-all duration-200 hover:bg-[hsl(var(--primary))] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" && <Loader2 className="size-4 animate-spin" />}
            {status === "loading" ? t("sending") : t("sendMessage")}
          </button>
        </div>
      </form>
    </section>
  );
}
