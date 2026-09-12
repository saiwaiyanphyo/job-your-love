"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/data";
import {
  emptyResumeData,
  newItemId,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeData,
} from "@/lib/resume/types";

function str(value: unknown, max = 2000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function id(value: unknown): string {
  return typeof value === "string" && value ? value : newItemId();
}

/** Coerce untrusted JSON from the editor into a well-formed ResumeData. */
function sanitizeResumeData(input: unknown): ResumeData {
  const src = (input ?? {}) as Record<string, unknown>;
  const basics = (src.basics ?? {}) as Record<string, unknown>;

  const experience = Array.isArray(src.experience)
    ? (src.experience as Record<string, unknown>[]).slice(0, 30).map(
        (e): ExperienceItem => ({
          id: id(e.id),
          company: str(e.company, 200),
          role: str(e.role, 200),
          location: str(e.location, 200),
          start: str(e.start, 60),
          end: str(e.end, 60),
          description: str(e.description, 4000),
        })
      )
    : [];

  const education = Array.isArray(src.education)
    ? (src.education as Record<string, unknown>[]).slice(0, 30).map(
        (e): EducationItem => ({
          id: id(e.id),
          school: str(e.school, 200),
          degree: str(e.degree, 200),
          location: str(e.location, 200),
          start: str(e.start, 60),
          end: str(e.end, 60),
          description: str(e.description, 4000),
        })
      )
    : [];

  const projects = Array.isArray(src.projects)
    ? (src.projects as Record<string, unknown>[]).slice(0, 30).map(
        (p): ProjectItem => ({
          id: id(p.id),
          name: str(p.name, 200),
          link: str(p.link, 500),
          description: str(p.description, 4000),
        })
      )
    : [];

  return {
    basics: {
      name: str(basics.name, 200),
      headline: str(basics.headline, 200),
      email: str(basics.email, 200),
      phone: str(basics.phone, 100),
      location: str(basics.location, 200),
      website: str(basics.website, 500),
      summary: str(basics.summary, 4000),
    },
    experience,
    education,
    projects,
    skills: str(src.skills, 4000) ?? "",
  };
}

export async function createResume() {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "Untitled Resume",
      data: emptyResumeData(),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/resumes");
  redirect(`/dashboard/resumes/${data.id}`);
}

export async function saveResume(id: string, title: string, dataJson: string) {
  const { supabase } = await requireUser();

  let parsed: unknown = {};
  try {
    parsed = JSON.parse(dataJson);
  } catch {
    throw new Error("Could not read the resume data.");
  }

  const cleanTitle = title.trim().slice(0, 200) || "Untitled Resume";
  const { error } = await supabase
    .from("resumes")
    .update({ title: cleanTitle, data: sanitizeResumeData(parsed) })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/resumes");
  revalidatePath(`/dashboard/resumes/${id}`);
}

export async function deleteResume(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/resumes");
  redirect("/dashboard/resumes");
}
