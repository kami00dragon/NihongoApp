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
  
  // Security settings
  typescript: {
    ignoreBuildErrors: false, // Enable strict TypeScript checking
  },
  reactStrictMode: true, // Enable React strict mode for security
  
  // Generate unique build ID for security
  generateBuildId: async () => {
    return `secure-build-${Date.now()}`;
  },
};

export default nextConfig;
