"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquareText,
  PhoneCall,
  UserRound,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useLocalMutation } from "@/lib/api-hooks";
import { Tooltip } from "@/components/ui/tooltip";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { TextareaField } from "@/components/ui/atoms/shadcn/textarea";
import { SelectField } from "@/components/ui/atoms/shadcn/SelectField";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const { t, isRtl } = useLanguage();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");

  const createContact = useLocalMutation<any>("post", "/api/contacts");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await createContact.mutateAsync({
        name,
        email,
        subject,
        phone: phone || undefined,
        message: body,
      });
      setStatus("success");
      setMessage(t("sendMessageSuccess"));
      setName("");
      setEmail("");
      setSubject("");
      setPhone("");
      setBody("");
    } catch {
      setStatus("error");
      setMessage(t("sendMessageError"));
    }
  }

  const subjectOptions = [
    { value: "generalQuestion", label: t("generalQuestion") },
    { value: "listingSupport", label: t("listingSupport") },
    { value: "accountIssue", label: t("accountIssue") },
    { value: "partnershipInquiry", label: t("partnershipInquiry") },
  ] as const;

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="w-full">
      <form
        className="space-y-5 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--card),var(--background))] p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] sm:p-8"
        onSubmit={onSubmit}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {t("sendMessage")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {t("contactFormTitle")}
          </h2>
          <p className="text-sm leading-7 text-[color-mix(in oklab, var(--foreground) 74%, transparent)]">
            {t("contactFormSubtitle")}
          </p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[color-mix(in oklab, var(--background) 68%, transparent)] p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--card)]/88 p-3">
            <Mail className="size-4 text-[var(--accent)]" />
            <span className="text-xs text-[color-mix(in oklab, var(--foreground) 74%, transparent)]">
              {t("contactEmailValue")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--card)]/88 p-3">
            <PhoneCall className="size-4 text-[var(--accent)]" />
            <span className="text-xs text-[color-mix(in oklab, var(--foreground) 74%, transparent)]">
              {t("contactPhoneValue")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--card)]/88 p-3">
            <MessageSquareText className="size-4 text-[var(--accent)]" />
            <span className="text-xs text-[color-mix(in oklab, var(--foreground) 74%, transparent)]">
              {t("contactResponseTime")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInputField
            label={t("fullName")}
            icon={<UserRound className="size-4" />}
            type="text"
            required
            value={name}
            onChange={setName}
          />
          <TextInputField
            label={t("emailAddress")}
            icon={<Mail className="size-4" />}
            type="email"
            required
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label={t("subject")}
            required
            value={subject}
            onChange={setSubject}
            placeholder={t("chooseSubject")}
            options={subjectOptions}
          />
          <TextInputField
            label={t("phoneOptional")}
            icon={<Phone className="size-4" />}
            type="tel"
            value={phone}
            onChange={setPhone}
          />
        </div>
        <TextareaField
          label={t("message")}
          icon={<MessageSquareText className="size-4" />}
          required
          rows={6}
          value={body}
          onChange={setBody}
        />
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5 text-sm">
            {status === "success" && (
              <span className="text-[hsl(140_60%_60%)]">{message}</span>
            )}
            {status === "error" && (
              <span className="text-[hsl(0_70%_60%)]">{message}</span>
            )}
          </div>
          <Tooltip content={t("sendMessage")} side="top">
            <Button type="submit" loading={status === "loading"}>
              {status === "loading" ? t("sending") : t("sendMessage")}
            </Button>
          </Tooltip>
        </div>
      </form>
    </section>
  );
}
