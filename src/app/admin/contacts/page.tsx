"use client";
import { motion } from "framer-motion";
import { useApiGet } from "@/lib/api-hooks";
import { useAuth } from "@/lib/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { SelectField } from "@/components/ui/atoms/shadcn/SelectField";
import { Badge } from "@/components/ui/atoms/shadcn/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/atoms/shadcn/table";
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
    null,
  );
  const { data, isLoading } = useApiGet<ContactItem[]>(
    ["contacts"],
    "/contacts",
  );

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

  const subjectOptions = [
    { value: "General Question", label: t("generalQuestion") },
    { value: "Listing Support", label: t("listingSupport") },
    { value: "Account Issue", label: t("accountIssue") },
    { value: "Partnership Inquiry", label: t("partnershipInquiry") },
  ];

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
    <section dir={isRtl ? "rtl" : "ltr"} className="container-padded app-shell-page" data-app-page="admin-contacts">
      {!isAdmin ? (
        <div className="py-12">
          <p className="subtle">{t("adminPrivilegesNeeded")}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="heading-xl">{t("contactMessages")}</h1>
              <p className="subtle app-text-body">{t("contactInboxSubtitle")}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-[260px]">
                <TextInputField
                  label={t("searchContactsPlaceholder")}
                  value={q}
                  onChange={setQ}
                  icon={<Search className="app-icon-sm" />}
                />
              </div>
              <div className="w-[200px]">
                <SelectField
                  label={t("subjectLabel")}
                  aria-label={t("subjectLabel")}
                  value={subjectFilter}
                  onChange={setSubjectFilter}
                  options={subjectOptions}
                  placeholder={t("filterAllSubjects")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-section)]">
            <Card className="lg:col-span-2 p-0 overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-[var(--border)] sm:hidden">
                <div className="w-full">
                  <TextInputField
                    label={t("searchContactsPlaceholder")}
                    value={q}
                    onChange={setQ}
                    icon={<Search className="app-icon-sm" />}
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("contactMessages")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell className="p-[var(--space-card)] subtle">Loading…</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && items.length === 0 && (
                    <TableRow>
                      <TableCell className="p-[var(--space-card)] subtle">
                        {t("noContactsYet")}
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedContact(c)}
                    >
                      <TableCell className="p-[var(--space-card)]">
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          <div className="flex items-start gap-[var(--space-gap)]">
                            <div className="relative size-10 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] grid place-items-center">
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
                                <Badge
                                  variant={c.handled ? "success" : "warning"}
                                  className="normal-case tracking-normal"
                                >
                                  {c.handled ? t("handled") : t("unhandled")}
                                </Badge>
                                <span className="app-text-caption subtle">
                                  {t("submittedAt")}:{" "}
                                  {new Date(c.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-1 app-text-caption subtle">
                                {t("subjectLabel")}: {subjectLabel(c.subject)}
                              </div>
                              <div className="mt-2 app-text-body line-clamp-2 text-foreground/90">
                                {c.message}
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                {c.email && (
                                  <a
                                    href={`mailto:${c.email}`}
                                    className="app-text-caption flex items-center gap-1 link"
                                  >
                                    <Mail className="size-3" /> {c.email}
                                  </a>
                                )}
                                {c.phone && (
                                  <a
                                    href={`tel:${c.phone}`}
                                    className="app-text-caption flex items-center gap-1 link"
                                  >
                                    <Phone className="size-3" /> {c.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-[var(--space-card)] bg-[linear-gradient(to_bottom_right,var(--card),color-mix(in oklab, var(--card) 80%, transparent))] border border-[var(--border)]">
              {selectedContact ? (
                <div>
                  <h2 className="app-text-heading-sm font-semibold mb-2">
                    {selectedContact.name}
                  </h2>
                  <p className="app-text-body mb-4">
                    <strong>{t("subjectLabel")}:</strong>{" "}
                    {subjectLabel(selectedContact.subject)}
                  </p>
                  <p className="app-text-body mb-4">
                    <strong>{t("message")}:</strong> {selectedContact.message}
                  </p>
                  {selectedContact.email && (
                    <p className="app-text-body mb-2">
                      <strong>{t("email")}:</strong> {selectedContact.email}
                    </p>
                  )}
                  {selectedContact.phone && (
                    <p className="app-text-body">
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
