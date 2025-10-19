/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  experimental: isProd ? { optimizePackageImports: ["lucide-react"] } : {},
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.11.205', port: '4000', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.11.205', port: '3002', pathname: '/**' },
      { protocol: 'http', hostname: 'cdn.4imprint.com', pathname: '/**' },
      { protocol: 'https', hostname: '**', pathname: '/**' },
    ],
  },
};

export default nextConfig;
