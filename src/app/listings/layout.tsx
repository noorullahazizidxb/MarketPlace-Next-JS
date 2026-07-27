import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Browse Listings",
  description:
    "Browse buy, sell, and rent listings on DevMinds Marketplace across Afghanistan. Built by Noorullah Azizi, CEO of DevMinds.",
  path: "/listings",
  keywords: [
    "listings",
    "marketplace",
    "DevMinds",
    "buy sell rent",
    "Afghanistan classifieds",
  ],
});

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
