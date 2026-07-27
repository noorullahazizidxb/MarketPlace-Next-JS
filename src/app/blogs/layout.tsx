import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Read tips, stories, and marketplace updates on DevMinds Marketplace. Authored with DevMinds leadership insights.",
  path: "/blogs",
});

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
