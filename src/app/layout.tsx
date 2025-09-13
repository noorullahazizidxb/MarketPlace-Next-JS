import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { PageTransition } from "@/components/page-transition";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 container-padded py-6">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
