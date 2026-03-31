/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Always tree-shake heavy barrel exports — prevents slow dev compilations
    // when navigating between pages that import from lucide-react or framer-motion.
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.11.11', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.11.205', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.11.205', port: '3002', pathname: '/**' },
      { protocol: 'http', hostname: '180.222.140.40', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: 'cdn.4imprint.com', pathname: '/**' },
      { protocol: 'https', hostname: '**', pathname: '/**' },
    ],
  },
};

export default nextConfig;
