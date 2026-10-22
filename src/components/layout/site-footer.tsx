"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import { DevmindsProductsNav } from "./devminds-products-nav";

export default function SiteFooter() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    return null;
  return (
    <>
      <Footer />
      <DevmindsProductsNav />
    </>
  );
}
