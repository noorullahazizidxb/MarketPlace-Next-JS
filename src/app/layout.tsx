import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipLink } from "@/components/skip-link";
import { AnimatedBg } from "@/components/animated-bg";
import { QueryProvider } from "@/components/query-provider";
import { AppShell } from "@/components/app-shell";

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
        {/* Early theme bootstrap to avoid flash and local fallback overriding cache */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              var cached = localStorage.getItem('theme.cachedTokens');
              if (cached) {
                var tokens = JSON.parse(cached);
                var root = document.documentElement;
                var toVar = function(k){return k.replace(/([A-Z])/g,'-$1').toLowerCase()};
                var read = function(v){
                  if (typeof v === 'string') return v;
                  if (v && typeof v === 'object' && 'css' in v) return String(v.css).replace(/^hsl\(|\)$/g,'').trim() || v.css;
                };
                var apply = function(prefix,obj){
                  for (var k in obj){
                    var v = obj[k];
                    var val = read(v);
                    if (val) root.style.setProperty('--'+prefix+'-'+toVar(k), val);
                    else if (v && typeof v==='object'){
                      for (var k2 in v){
                        var v2 = v[k2];
                        var val2 = read(v2);
                        if (val2) root.style.setProperty('--'+prefix+'-'+toVar(k)+'-'+toVar(k2), val2);
                      }
                    }
                  }
                };
                if (tokens.light) apply('light', tokens.light);
                if (tokens.dark) apply('dark', tokens.dark);
              }
            } catch (e) {}
          `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <SkipLink />
            <AnimatedBg />
            <AppShell>{children}</AppShell>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
