import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the project root explicitly. Without this, Turbopack infers the
    // root by walking up for a lockfile and can land on an unrelated one
    // (e.g. a stray package-lock.json in a parent/home directory on some
    // machines), which throws off module resolution and file watching.
    root: __dirname,
  },
};

export default nextConfig;
