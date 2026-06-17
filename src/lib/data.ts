import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { JobEntry, Tracker } from "@/lib/types";

export const ACTIVE_TRACKER_COOKIE = "active_tracker";

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

/** All of the user's trackers, most-recently-updated first. */
export async function getAllTrackers(): Promise<Tracker[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("trackers")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []) as Tracker[];
}

/** Number of applications per tracker id, for the user. */
export async function getTrackerCounts(): Promise<Record<string, number>> {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("job_entries").select("tracker_id");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = (row as { tracker_id: string }).tracker_id;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

/**
 * The currently-active tracker. Users can have several; the active one is
 * stored in a cookie. Falls back to the most recent, creating a default
 * tracker on very first use.
 */
export async function getActiveTracker(): Promise<Tracker> {
  const trackers = await getAllTrackers();

  if (trackers.length === 0) {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
      .from("trackers")
      .insert({ user_id: user.id, name: "My Job Search", columns: [] })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Tracker;
  }

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_TRACKER_COOKIE)?.value;
  return trackers.find((t) => t.id === activeId) ?? trackers[0];
}

/** Whether the user already has a tracker (used to gate onboarding). */
export async function hasTracker(): Promise<boolean> {
  const { supabase } = await requireUser();
  const { count } = await supabase
    .from("trackers")
    .select("id", { count: "exact", head: true });
  return (count ?? 0) > 0;
}

export async function getEntries(trackerId: string): Promise<JobEntry[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("job_entries")
    .select("*")
    .eq("tracker_id", trackerId)
    .order("created_at", { ascending: false });
  return (data ?? []) as JobEntry[];
}

export async function getEntry(id: string): Promise<JobEntry | null> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("job_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as JobEntry) ?? null;
}
