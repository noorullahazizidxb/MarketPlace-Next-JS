import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Sign up",
  description: "Create a DevMinds Marketplace account. Not indexed by search engines.",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
