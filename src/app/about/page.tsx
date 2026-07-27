import { AboutContent } from "./about-content";
import type { Metadata } from "next";
import { AUTHOR, ORGANIZATION_NAME, pageMetadata, personJsonLd, SITE_NAME } from "@/lib/site-config";
import { SeoJsonLd } from "@/components/seo/seo-json-ld";

const MARKETPLACE_NAME = SITE_NAME;

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: `About ${SITE_NAME}. Founded by ${AUTHOR.name}, ${AUTHOR.role} at ${ORGANIZATION_NAME}. Contact ${AUTHOR.email} · ${AUTHOR.phone}.`,
  path: "/about",
  keywords: [
    "About DevMinds Marketplace",
    "DevMinds",
    "Noorullah Azizi",
    "CEO DevMinds",
  ],
});

export default function AboutPage() {
  return (
    <>
      <SeoJsonLd extra={personJsonLd()} />
      <AboutContent marketplaceName={MARKETPLACE_NAME} />
    </>
  );
}
