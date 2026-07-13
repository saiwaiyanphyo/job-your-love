"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACTIVE_TRACKER_COOKIE,
  requireUser,
  getActiveTracker,
} from "@/lib/data";
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
  const { supabase, user } = await requireUser();
  const templateKey = String(formData.get("template") ?? "job-search");
  const name = String(formData.get("name") ?? "").trim();
  const template = getTemplate(templateKey);

  const { data, error } = await supabase
    .from("trackers")
    .insert({
      user_id: user.id,
      name: name || template.name,
      columns: template.statuses,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await setActiveCookie(data.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function setActiveTracker(id: string) {
  await requireUser();
  await setActiveCookie(id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function renameTracker(id: string, name: string) {
  const { supabase } = await requireUser();
  const clean = name.trim();
  if (!clean) return;
  const { error } = await supabase
    .from("trackers")
    .update({ name: clean })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function deleteTracker(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("trackers").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
    follow_up: get("follow_up"),
    contact_name: get("contact_name"),
    contact_email: get("contact_email"),
    contact_role: get("contact_role"),
  };
}

export async function createApplication(formData: FormData) {
  const { supabase, user } = await requireUser();
  const tracker = await getActiveTracker();
  const data = readApplication(formData);

  const { error } = await supabase.from("job_entries").insert({
    tracker_id: tracker.id,
    user_id: user.id,
    data,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect("/dashboard/applications");
}

export async function updateApplication(id: string, formData: FormData) {
  const { supabase } = await requireUser();
  const data = readApplication(formData);
  const { error } = await supabase
    .from("job_entries")
    .update({ data })
    .eq("id", id);
  if (error) throw new Error(error.message);

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
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("job_entries")
    .update({ data: { ...current, status } })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteApplication(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("job_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
