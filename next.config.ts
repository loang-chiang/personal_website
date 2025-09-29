// next.config.js
/** @type {import('next').NextConfig} */
const repo = 'personal_website'; // <-- REPLACE with your repo name, e.g. "website"
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // Produce static files in ./out on build
  output: 'export',

  // Needed for project sites at https://<user>.github.io/<repo>
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',

  // Next/Image in static export
  images: { unoptimized: true },

  // (Optional but handy on GitHub Pages)
  trailingSlash: true,
};
