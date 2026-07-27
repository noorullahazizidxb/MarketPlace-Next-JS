import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Pending approvals",
  description: "Private pending queue. Not indexed by search engines.",
  path: "/pendings",
  noIndex: true,
});

export default function PendingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
