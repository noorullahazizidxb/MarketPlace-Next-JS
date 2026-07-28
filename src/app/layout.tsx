import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/roboto/400.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/lato/400.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/700.css";
import "@fontsource/noto-sans-arabic/400.css";
import "@fontsource/noto-sans-arabic/700.css";
import "@fontsource/noto-naskh-arabic/400.css";
import "@fontsource/noto-naskh-arabic/700.css";

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
    <html lang="en" suppressHydrationWarning>
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
      <body className="bg-background text-foreground antialiased">
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
