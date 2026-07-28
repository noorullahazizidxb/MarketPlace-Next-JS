import "./globals.css";
import { inter } from "@/lib/fonts";

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AppToaster } from "@/components/ui/toaster";
import SocialRealtimeClient from "@/components/providers/SocialRealtimeClient";
import { SeoJsonLd } from "@/components/seo/seo-json-ld";
import { rootMetadata } from "@/lib/site-config";
import { UiContextGate } from "@/lib/theme/ui-context/ui-context-gate";
import { ThemeBootFallback } from "@/components/ui/atoms/theme-boot-fallback";
import {
  getInitialThemeCss,
  getInitialThemeSettings,
  getThemeModeInitScript,
  getUiContextState,
} from "../theme/server-theme";

export const metadata: Metadata = rootMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uiContext = await getUiContextState();
  const initialThemeSettings = uiContext.theme ?? (await getInitialThemeSettings());
  const initialThemeCss = await getInitialThemeCss();
  const themeModeScript = getThemeModeInitScript(initialThemeSettings.mode);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <style
          id="app-inline-css"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: initialThemeCss }}
        />
        <script
          id="theme-mode-init"
          dangerouslySetInnerHTML={{ __html: themeModeScript }}
        />
      </head>
      <body
        className="bg-background text-foreground antialiased"
        style={{ fontFamily: "var(--app-font-family)" }}
      >
        <SeoJsonLd />
        <ThemeProvider initialThemeSettings={initialThemeSettings}>
          <QueryProvider>
            <LanguageProvider>
              <UiContextGate fallback={<ThemeBootFallback />}>
                <SkipLink />
                <SocialRealtimeClient />
                <AppShell>{children}</AppShell>
                <AppToaster />
              </UiContextGate>
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
