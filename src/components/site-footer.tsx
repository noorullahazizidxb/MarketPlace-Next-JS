"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function SiteFooter() {
  const pathname = usePathname();
  // Do not show footer on sign-in page
  if (!pathname) return null;
  if (pathname.startsWith("/sign-in")) return null;
  return <Footer />;
}
