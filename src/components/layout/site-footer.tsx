"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function SiteFooter() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    return null;
  return <Footer />;
}
