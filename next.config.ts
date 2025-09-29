/** @type {import('next').NextConfig} */
const repo = 'personal_website';
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