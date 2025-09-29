/** @type {import('next').NextConfig} */
const repo = 'loang-chiang.github.io';  // ← Change this to match your new repo name
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? `/${repo}` : '';

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};