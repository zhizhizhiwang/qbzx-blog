import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };


    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

export default nextConfig;

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})