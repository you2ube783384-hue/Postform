import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep native libsql/Prisma modules out of the bundler so they load
  // correctly in serverless environments (Vercel).
  serverExternalPackages: ["@libsql/client", "libsql", "@prisma/client", "@prisma/adapter-libsql"],
  images: {
    // POSTFORM uses external image URLs (OSS-hosted seed imagery + admin-added URLs)
    remotePatterns: [
      { protocol: "https", hostname: "z-cdn.chatglm.cn" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
