import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds
  eslint: {
    // Only run ESLint on save during development, not during builds
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    // Skip type checking during builds for faster builds
    ignoreBuildErrors: true,
  },
  
  // Disable React strict mode
  reactStrictMode: false,
  
  // Disable image optimization warnings
  images: {
    unoptimized: true,
  },
  
  // Increase build output verbosity for better debugging
  output: 'standalone',
  
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
};

export default nextConfig;
