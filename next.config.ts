import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nothing special needed for OpenNext; keep defaults.
};

export default nextConfig;

// Required by @opennextjs/cloudflare so that `next dev` can also use
// Cloudflare bindings via getCloudflareContext() during local development.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
