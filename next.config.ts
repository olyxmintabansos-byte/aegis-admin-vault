import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/aegis-admin-vault",
  images: { unoptimized: true },
};

export default nextConfig;
