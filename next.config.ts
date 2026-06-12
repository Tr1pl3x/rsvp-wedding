import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow testing from other devices on the local network.
  allowedDevOrigins: ["192.168.0.136"],
};

export default nextConfig;
