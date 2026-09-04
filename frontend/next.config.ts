import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/campaigns/:slug*",
        destination: "/funds/:slug*",
        permanent: true,
      },
      {
        source: "/campaigns",
        destination: "/funds",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
