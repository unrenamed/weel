/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "payable-red-ostrich.faviconkit.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
