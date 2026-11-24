"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { pageEnter } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The server-rendered route must be visible immediately (LCP); only client-side navigations animate in.
  const [landingPath] = useState(pathname);
  return (
    <motion.div
      key={pathname}
      className="min-w-0 w-full overflow-x-clip"
      variants={pageEnter}
      initial={pathname === landingPath ? false : "hidden"}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
