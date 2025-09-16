import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipLink } from "@/components/skip-link";
import { AnimatedBg } from "@/components/animated-bg";
import { QueryProvider } from "@/components/query-provider";
import { AppShell } from "@/components/app-shell";
import { AppToaster } from "@/components/toaster";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Inline script to apply persisted theme early (default to dark) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode');if(m==='dark'){document.documentElement.classList.add('dark');}else if(m==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){} })()`,
          }}
        />
        {/* Removed localStorage-based pre-hydration theme logic */}
        <ThemeProvider>
          <QueryProvider>
            <SkipLink />
            <AnimatedBg />
            <AppShell>{children}</AppShell>
            <AppToaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
