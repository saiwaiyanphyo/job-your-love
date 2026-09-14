import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The D1 database binding (see `d1_databases` in wrangler.jsonc). */
export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export function now(): string {
  return new Date().toISOString();
}

/** D1 stores JSON columns as text; parse them back, tolerating bad rows. */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
