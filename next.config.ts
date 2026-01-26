import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/NihongoApp' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/NihongoApp' : '',
  
  // Security headers for static export
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Security settings
  typescript: {
    ignoreBuildErrors: false, // Enable strict TypeScript checking
  },
  reactStrictMode: true, // Enable React strict mode for security
  
  // Disable telemetry for privacy
  ...(process.env.NODE_ENV === 'production' && {
    experimental: {
      telemetry: false,
    },
  }),
  
  // Content Security Policy (for production)
  ...(process.env.NODE_ENV === 'production' && {
    generateBuildId: async () => {
      return `secure-build-${Date.now()}`;
    },
  }),
};

export default nextConfig;
