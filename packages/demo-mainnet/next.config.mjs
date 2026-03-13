/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  experimental: {
    optimizePackageImports: ["@ckb-ccc/core", "@ckb-ccc/core/bundle"],
  },
};

export default nextConfig;
