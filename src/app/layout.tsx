import "./globals.css";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AppToaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

const SocialRealtime = dynamic(
  () => import("@/components/providers/SocialRealtimeClient"),
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
              <SocialRealtime />
              {/** Background now rendered from AppShell to reduce layout.js payload */}
              <AppShell>{children}</AppShell>
              <AppToaster />
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
