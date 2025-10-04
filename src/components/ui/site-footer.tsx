"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/app.store";
import Footer from "./footer";

export default function SiteFooter() {
  const appReady = useAppStore((s) => s.appReady);
  const pathname = usePathname();
  // Do not show footer on sign-in page
  if (!pathname) return null;
  // Hide footer until app is fully ready to avoid initial loading scroll/footer flash
  if (!appReady) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    return null;
  return <Footer />;
}
