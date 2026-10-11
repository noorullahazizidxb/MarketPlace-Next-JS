/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Docker copies .next/standalone. Vercel builds its own output.
  output: process.env.VERCEL ? undefined : "standalone",
  experimental: {
    // Always tree-shake heavy barrel exports — prevents slow dev compilations
    // when navigating between pages that import from lucide-react or framer-motion.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "http", hostname: "192.168.11.11", pathname: "/**" },
      { protocol: "http", hostname: "192.168.11.205", pathname: "/**" },
      { protocol: "http", hostname: "180.222.140.40", pathname: "/**" },
      { protocol: "http", hostname: "cdn.4imprint.com", pathname: "/**" },
      { protocol: "https", hostname: "marketplace.devminds.net", pathname: "/**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
      { protocol: "https", hostname: "public.blob.vercel-storage.com", pathname: "/**" },
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },
  async rewrites() {
    // Prefer BACKEND_VERCEL_URL so /uploads never targets …/backend (self-loop).
    // App Router src/app/uploads/[...path] usually handles /uploads; this is fallback.
    const backendOrigin = (process.env.BACKEND_VERCEL_URL || "").replace(/\/$/, "");
    let uploadOrigin = backendOrigin;
    if (!uploadOrigin) {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api"
      )
        .replace(/\/?api\/?$/i, "")
        .replace(/\/$/, "");
      uploadOrigin = /\/backend$/i.test(apiBase)
        ? "http://localhost:4000"
        : apiBase || "http://localhost:4000";
    }
    const rules = [
      {
        source: "/uploads/:path*",
        destination: `${uploadOrigin}/uploads/:path*`,
      },
    ];
    if (backendOrigin) {
      rules.unshift({
        source: "/backend/:path*",
        destination: `${backendOrigin}/:path*`,
      });
    }
    return rules;
  },
};

export default nextConfig;
