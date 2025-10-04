import "./globals.css";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AppToaster } from "@/components/ui/toaster";
import SiteFooter from "@/components/ui/site-footer";
import dynamic from "next/dynamic";

// Defer visually rich UI to client-only chunks to avoid layout.js parse issues on first boot
const Partners = dynamic(
  () => import("@/components/ui/partners").then((m) => m.Partners),
  { ssr: false }
);
const AnimatedBg = dynamic(
  () => import("@/components/ui/animated-bg").then((m) => m.AnimatedBg),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marketplace Premium Starter",
  description: "Futuristic, minimal Next.js starter",
  icons: {
    icon: "/favicon.svg",
  },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Default dark class for initial render; ThemeProvider will adjust on mount */}
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
              <SkipLink />
              {/** Temporarily disabled to isolate initial layout parse error on first dev load */}
              {false && <AnimatedBg />}
              <AppShell>{children}</AppShell>
              {false && <Partners />}
              <SiteFooter />
              <AppToaster />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
