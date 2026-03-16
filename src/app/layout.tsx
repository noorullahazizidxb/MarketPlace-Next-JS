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

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AppToaster } from "@/components/ui/toaster";
import SocialRealtimeClient from "@/components/providers/SocialRealtimeClient";
import { getInitialThemeCss, getThemeModeInitScript } from "../theme/server-theme";

export const metadata = {
  title: "Marketplace Premium Starter",
  description: "Futuristic, minimal Next.js starter",
  icons: {
    icon: "/favicon.svg",
  },
} as const;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialThemeCss = await getInitialThemeCss();
  const themeModeScript = getThemeModeInitScript();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style id="initial-theme-vars" dangerouslySetInnerHTML={{ __html: initialThemeCss }} />
        <script id="theme-mode-init" dangerouslySetInnerHTML={{ __html: themeModeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
              <SkipLink />
              <SocialRealtimeClient />
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
