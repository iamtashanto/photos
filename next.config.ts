import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    qualities: [75, 88, 90, 92],
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
