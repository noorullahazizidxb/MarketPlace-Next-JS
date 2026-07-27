import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to DevMinds Marketplace. Not indexed by search engines.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
