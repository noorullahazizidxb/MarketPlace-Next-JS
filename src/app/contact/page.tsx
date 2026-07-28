import { ContactContent } from "./contact-content";
import type { Metadata } from "next";
import { AUTHOR, pageMetadata, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${SITE_NAME}. ${AUTHOR.name} — ${AUTHOR.email} · ${AUTHOR.phone}. Portfolio: ${AUTHOR.url}`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pb-20 app-shell-page" data-app-page="contact">
      <ContactContent />
    </main>
  );
}
