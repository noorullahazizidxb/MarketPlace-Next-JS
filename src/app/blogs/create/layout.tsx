import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Create blog post",
  description: "Private blog editor. Not indexed by search engines.",
  path: "/blogs/create",
  noIndex: true,
});

export default function CreateBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
