import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/NumiX", 
  images: { unoptimized: true },
};

export default nextConfig;
