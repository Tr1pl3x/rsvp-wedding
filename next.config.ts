import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow testing from other devices on the local network.
  allowedDevOrigins: ["192.168.0.136"],
  // No floating "N" dev-tools button over the invite during phone testing;
  // compile/runtime errors still surface as usual.
  devIndicators: false,
};

export default nextConfig;
