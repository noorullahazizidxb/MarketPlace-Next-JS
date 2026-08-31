/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },
  // Proxy /uploads/** to the backend so asset() relative paths resolve correctly.
  async rewrites() {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api"
    ).replace(/\/api\/?$/, "");
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
