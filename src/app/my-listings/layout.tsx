import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "My listings",
  description: "Private seller listings. Not indexed by search engines.",
  path: "/my-listings",
  noIndex: true,
});

export default function MyListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
