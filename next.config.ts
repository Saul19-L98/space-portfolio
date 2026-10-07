import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const staticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  // GitHub Pages (and any static host): `NEXT_OUTPUT=export` writes the site to ./out.
  ...(staticExport ? { output: "export" as const } : {}),
  // Serve under a path prefix when NEXT_PUBLIC_BASE_PATH is set (e.g. /space-portfolio).
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: ["three"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
