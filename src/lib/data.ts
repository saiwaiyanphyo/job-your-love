import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDB, now, parseJson } from "@/lib/db";
import type { ApplicationData, JobEntry, Tracker } from "@/lib/types";

export const ACTIVE_TRACKER_COOKIE = "active_tracker";

// Auth is Supabase; all app data lives in D1. D1 has no row-level security,
// so every query below must be scoped to the signed-in user's id.

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

type TrackerRow = Omit<Tracker, "columns"> & { columns: string };
type EntryRow = Omit<JobEntry, "data"> & { data: string };

export function toTracker(row: TrackerRow): Tracker {
  return { ...row, columns: parseJson<unknown[]>(row.columns, []) };
}

export function toEntry(row: EntryRow): JobEntry {
  return { ...row, data: parseJson<ApplicationData>(row.data, {}) };
}

/** All of the user's trackers, most-recently-updated first. */
export async function getAllTrackers(): Promise<Tracker[]> {
  const { user } = await requireUser();
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT * FROM trackers WHERE user_id = ? ORDER BY updated_at DESC"
    )
    .bind(user.id)
    .all<TrackerRow>();
  return results.map(toTracker);
}

/** Number of applications per tracker id, for the user. */
export async function getTrackerCounts(): Promise<Record<string, number>> {
  const { user } = await requireUser();
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT tracker_id, COUNT(*) AS n FROM job_entries WHERE user_id = ? GROUP BY tracker_id"
    )
    .bind(user.id)
    .all<{ tracker_id: string; n: number }>();
  return Object.fromEntries(results.map((r) => [r.tracker_id, r.n]));
}

/** Insert a tracker for the user and return it. */
export async function insertTracker(
  userId: string,
  name: string,
  columns: unknown[]
): Promise<Tracker> {
  const db = await getDB();
  const ts = now();
  const tracker: Tracker = {
    id: crypto.randomUUID(),
    user_id: userId,
    name,
    columns,
    created_at: ts,
    updated_at: ts,
  };
  await db
    .prepare(
      "INSERT INTO trackers (id, user_id, name, columns, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      tracker.id,
      userId,
      name,
      JSON.stringify(columns),
      ts,
      ts
    )
    .run();
  return tracker;
}

/**
 * The currently-active tracker. Users can have several; the active one is
 * stored in a cookie. Falls back to the most recent, creating a default
 * tracker on very first use.
 */
export async function getActiveTracker(): Promise<Tracker> {
  const trackers = await getAllTrackers();

  if (trackers.length === 0) {
    const { user } = await requireUser();
    return insertTracker(user.id, "My Job Search", []);
  }

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_TRACKER_COOKIE)?.value;
  return trackers.find((t) => t.id === activeId) ?? trackers[0];
}

/** Whether the user already has a tracker (used to gate onboarding). */
export async function hasTracker(): Promise<boolean> {
  const { user } = await requireUser();
  const db = await getDB();
  const row = await db
    .prepare("SELECT 1 FROM trackers WHERE user_id = ? LIMIT 1")
    .bind(user.id)
    .first();
  return row !== null;
}

export async function getEntries(trackerId: string): Promise<JobEntry[]> {
  const { user } = await requireUser();
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT * FROM job_entries WHERE tracker_id = ? AND user_id = ? ORDER BY created_at DESC"
    )
    .bind(trackerId, user.id)
    .all<EntryRow>();
  return results.map(toEntry);
}

export async function getEntry(id: string): Promise<JobEntry | null> {
  const { user } = await requireUser();
  const db = await getDB();
  const row = await db
    .prepare("SELECT * FROM job_entries WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .first<EntryRow>();
  return row ? toEntry(row) : null;
}
