"use client";
import { motion } from "framer-motion";
import { useApiGet } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { asset } from "@/lib/assets";
import { Mail, Phone, Search, User2 } from "lucide-react";
import { useMemo, useState } from "react";
import React from "react";

type ContactSubject =
  | "General Question"
  | "Listing Support"
  | "Account Issue"
  | "Partnership Inquiry";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject: ContactSubject;
  phone?: string | null;
  message: string;
  createdAt: string;
  user?: {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    roles?: { role: string }[];
    contacts?: { whatsapp?: string; phone?: string };
  } | null;
  handled?: boolean;
}

export default function AdminContactsPage() {
  const { t, isRtl } = useLanguage();
  const { roles } = useAuth();
  const isAdmin = roles.includes("ADMIN");
  const [q, setQ] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null
  );
  const { data, isLoading } = useApiGet<ContactItem[]>(
    ["contacts"],
    "/contacts"
  );

  // Map canonical subject values to localized labels
  const subjectLabel = (s?: string) => {
    switch (s) {
      case "General Question":
        return t("generalQuestion");
      case "Listing Support":
        return t("listingSupport");
      case "Account Issue":
        return t("accountIssue");
      case "Partnership Inquiry":
        return t("partnershipInquiry");
      default:
        return s || "";
    }
  };

  const items = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((c) => {
      const term = q.trim().toLowerCase();
      const matchesQ =
        !term ||
        [c.name, c.email, c.subject, c.message]
          .map((v) => String(v ?? "").toLowerCase())
          .some((s) => s.includes(term));
      const matchesSubject = !subjectFilter || c.subject === subjectFilter;
      return matchesQ && matchesSubject;
    });
  }, [data, q, subjectFilter]);

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="container-padded py-10">
      {!isAdmin ? (
        <div className="py-12">
          <p className="subtle">{t("adminPrivilegesNeeded")}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="heading-xl">{t("contactMessages")}</h1>
              <p className="subtle text-sm">{t("contactInboxSubtitle")}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Input
                placeholder={t("searchContactsPlaceholder")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-[260px]"
              />
              <select
                aria-label={t("subjectLabel")}
                className={
                  "h-9 rounded-xl border px-3 text-sm " +
                  (subjectFilter
                    ? "accent-btn border-[hsl(var(--accent))/0.5] text-[hsl(var(--accent-foreground))]"
                    : "border-[hsl(var(--border))] bg-transparent")
                }
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">{t("filterAllSubjects")}</option>
                <option value="General Question">{t("generalQuestion")}</option>
                <option value="Listing Support">{t("listingSupport")}</option>
                <option value="Account Issue">{t("accountIssue")}</option>
                <option value="Partnership Inquiry">
                  {t("partnershipInquiry")}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 p-0 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-[hsl(var(--border))] sm:hidden">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-60" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("searchContactsPlaceholder")}
                    className="w-full rounded-xl bg-transparent border border-[hsl(var(--border))] pl-9 pr-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {isLoading && <div className="p-6 subtle">Loading…</div>}
                {!isLoading && items.length === 0 && (
                  <div className="p-6 subtle">{t("noContactsYet")}</div>
                )}
                {items.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="p-4 group hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedContact(c)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative size-10 rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] grid place-items-center">
                        {c.user?.avatarUrl ? (
                          <Image
                            src={asset(c.user?.avatarUrl) || "/favicon.svg"}
                            alt="avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User2 className="size-4 opacity-70" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-medium truncate max-w-[220px]">
                            {c.name}
                          </div>
                          <span
                            className={
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs " +
                              (c.handled
                                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                : "border-amber-500/30 text-amber-400 bg-amber-500/10")
                            }
                          >
                            {c.handled ? t("handled") : t("unhandled")}
                          </span>
                          <span className="text-xs subtle">
                            {t("submittedAt")}:{" "}
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 text-xs subtle">
                          {t("subjectLabel")}: {subjectLabel(c.subject)}
                        </div>
                        <div className="mt-2 text-sm line-clamp-2 text-foreground/90">
                          {c.message}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="text-xs flex items-center gap-1 link"
                            >
                              <Mail className="size-3" /> {c.email}
                            </a>
                          )}
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="text-xs flex items-center gap-1 link"
                            >
                              <Phone className="size-3" /> {c.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-[linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/80)] border border-[hsl(var(--border))]">
              {selectedContact ? (
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {selectedContact.name}
                  </h2>
                  <p className="text-sm mb-4">
                    <strong>{t("subjectLabel")}:</strong>{" "}
                    {subjectLabel(selectedContact.subject)}
                  </p>
                  <p className="text-sm mb-4">
                    <strong>{t("message")}:</strong> {selectedContact.message}
                  </p>
                  {selectedContact.email && (
                    <p className="text-sm mb-2">
                      <strong>{t("email")}:</strong> {selectedContact.email}
                    </p>
                  )}
                  {selectedContact.phone && (
                    <p className="text-sm">
                      <strong>{t("phone")}:</strong> {selectedContact.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center subtle">
                  Select a message to view details.
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
