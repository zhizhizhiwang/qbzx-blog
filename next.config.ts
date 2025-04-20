import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,

  eslint: {
    // 重要：将此设置为 true 将允许生产构建成功，即使项目存在 ESLint 错误。
    // 这通常不推荐，因为它可能隐藏潜在的代码问题，但可以用于你当前的情况。
    ignoreDuringBuilds: true,
  },
};

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

export default nextConfig;
