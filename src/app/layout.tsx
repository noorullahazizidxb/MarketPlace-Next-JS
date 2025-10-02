import "./globals.css";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipLink } from "@/components/skip-link";
import { AnimatedBg } from "@/components/animated-bg";
import { QueryProvider } from "@/components/query-provider";
import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";
import { AppToaster } from "@/components/toaster";
import SiteFooter from "@/components/site-footer";

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
              <AnimatedBg />
              <AppShell>{children}</AppShell>
              <SiteFooter />
              <AppToaster />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
