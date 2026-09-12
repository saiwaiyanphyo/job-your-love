import "server-only";
import { requireUser } from "@/lib/data";
import { normalizeResumeData, type Resume } from "@/lib/resume/types";

/** All of the user's resumes, most-recently-updated first. */
export async function getResumes(): Promise<Resume[]> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []).map((row) => ({
    ...(row as Resume),
    data: normalizeResumeData((row as Resume).data),
  }));
}

export async function getResume(id: string): Promise<Resume | null> {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  return { ...(data as Resume), data: normalizeResumeData((data as Resume).data) };
}
