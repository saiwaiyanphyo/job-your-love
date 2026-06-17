import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Use the default in-worker caching. You can plug in R2 / KV incremental
  // cache here later if you need ISR-style caching. See:
  // https://opennext.js.org/cloudflare/caching
});
