import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Create listing",
  description: "Private listing form. Not indexed by search engines.",
  path: "/listings/create",
  noIndex: true,
});

export default function CreateListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
