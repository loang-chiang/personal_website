import type { NextConfig } from "next";

const repo = "my-site";                 // must match repo name exactly
const isProd = process.env.NODE_ENV === "production";

const basePath = isProd ? `/${repo}` : undefined;
const assetPrefix = isProd ? `/${repo}/` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;