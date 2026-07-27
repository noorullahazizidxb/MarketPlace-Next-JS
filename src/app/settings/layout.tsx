import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Settings",
  description: "Private user settings. Not indexed by search engines.",
  path: "/settings",
  noIndex: true,
});

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
