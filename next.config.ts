import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    webpackMemoryOptimizations: true,
  },
  allowedDevOrigins: ["192.168.1.*", "10.163.217.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nvpljyvubavbnfdf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
