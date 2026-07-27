import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Admin",
  description: "Private marketplace admin. Not indexed by search engines.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
