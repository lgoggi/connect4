import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root has its own package-lock.json (for `npm run dev` there);
  // pin the root so Next doesn't guess it from the lockfiles.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
