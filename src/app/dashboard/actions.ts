"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACTIVE_TRACKER_COOKIE,
  requireUser,
  getActiveTracker,
  insertTracker,
} from "@/lib/data";
import { getDB, now } from "@/lib/db";
import { extractApplicationFromEmail } from "@/lib/ai/extract-application";
import { getTemplate } from "@/lib/templates";
import type { ApplicationData, StatusId } from "@/lib/types";

export interface EmailImportState {
  error?: string;
  extracted?: ApplicationData;
  emailText?: string;
}

async function setActiveCookie(id: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TRACKER_COOKIE, id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

// ---------------------------------------------------------------------------
// Trackers (users can have several; one is active at a time)
// ---------------------------------------------------------------------------
export async function createTrackerFromTemplate(formData: FormData) {
  const { user } = await requireUser();
  const templateKey = String(formData.get("template") ?? "job-search");
  const name = String(formData.get("name") ?? "").trim();
  const template = getTemplate(templateKey);

  const tracker = await insertTracker(
    user.id,
    name || template.name,
    template.statuses
  );

  await setActiveCookie(tracker.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function setActiveTracker(id: string) {
  const { user } = await requireUser();
  const db = await getDB();
  const owned = await db
    .prepare("SELECT 1 FROM trackers WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .first();
  if (!owned) throw new Error("Tracker not found.");
  await setActiveCookie(id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function renameTracker(id: string, name: string) {
  const { user } = await requireUser();
  const clean = name.trim();
  if (!clean) return;
  const db = await getDB();
  await db
    .prepare(
      "UPDATE trackers SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    )
    .bind(clean, now(), id, user.id)
    .run();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function deleteTracker(id: string) {
  const { user } = await requireUser();
  const db = await getDB();
  // Delete entries explicitly rather than relying on FK cascade.
  await db.batch([
    db
      .prepare("DELETE FROM job_entries WHERE tracker_id = ? AND user_id = ?")
      .bind(id, user.id),
    db
      .prepare("DELETE FROM trackers WHERE id = ? AND user_id = ?")
      .bind(id, user.id),
  ]);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

// ---------------------------------------------------------------------------
// Applications (rows in job_entries)
// ---------------------------------------------------------------------------
/** Add https:// to a bare domain so it becomes a working link. */
function normalizeUrl(value?: string): string | undefined {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function readApplication(formData: FormData): ApplicationData {
  const get = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v === "" ? undefined : v;
  };
  return {
    company: get("company"),
    position: get("position"),
    location: get("location"),
    salary: get("salary"),
    status: (get("status") as StatusId) ?? "applied",
    date: get("date"),
    url: normalizeUrl(get("url")),
    source: get("source"),
    description: get("description"),
    notes: get("notes"),
    follow_up: get("follow_up"),
    contact_name: get("contact_name"),
    contact_email: get("contact_email"),
    contact_role: get("contact_role"),
  };
}

export async function createApplication(formData: FormData) {
  const { user } = await requireUser();
  const tracker = await getActiveTracker();
  const data = readApplication(formData);
  const ts = now();

  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO job_entries (id, tracker_id, user_id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(crypto.randomUUID(), tracker.id, user.id, JSON.stringify(data), ts, ts)
    .run();

  revalidatePath("/dashboard");
  redirect("/dashboard/applications");
}

async function writeEntryData(id: string, userId: string, data: ApplicationData) {
  const db = await getDB();
  await db
    .prepare(
      "UPDATE job_entries SET data = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    )
    .bind(JSON.stringify(data), now(), id, userId)
    .run();
}

export async function updateApplication(id: string, formData: FormData) {
  const { user } = await requireUser();
  await writeEntryData(id, user.id, readApplication(formData));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${id}`);
  redirect(`/dashboard/applications/${id}`);
}

/** Quick inline status change from the table dropdown. */
export async function updateStatus(
  id: string,
  current: ApplicationData,
  status: StatusId
) {
  const { user } = await requireUser();
  await writeEntryData(id, user.id, { ...current, status });
  revalidatePath("/dashboard");
}

export async function deleteApplication(id: string) {
  const { user } = await requireUser();
  const db = await getDB();
  await db
    .prepare("DELETE FROM job_entries WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .run();
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// AI email import
// ---------------------------------------------------------------------------
export async function importApplicationFromEmail(
  _prev: EmailImportState,
  formData: FormData
): Promise<EmailImportState> {
  await requireUser();

  const emailText = String(formData.get("emailText") ?? "").trim();
  try {
    const extracted = await extractApplicationFromEmail(emailText);
    return { extracted, emailText };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not extract application details.",
      emailText,
    };
  }
}
