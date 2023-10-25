/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["avatar.vercel.sh", "api.faviconkit.com"],
  },
};

module.exports = nextConfig;
