"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/data";
import { getDB, now } from "@/lib/db";
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
  const { user } = await requireUser();
  const id = crypto.randomUUID();
  const ts = now();
  const db = await getDB();
  await db
    .prepare(
      "INSERT INTO resumes (id, user_id, title, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(id, user.id, "Untitled Resume", JSON.stringify(emptyResumeData()), ts, ts)
    .run();

  revalidatePath("/dashboard/resumes");
  redirect(`/dashboard/resumes/${id}`);
}

export async function saveResume(id: string, title: string, dataJson: string) {
  const { user } = await requireUser();

  let parsed: unknown = {};
  try {
    parsed = JSON.parse(dataJson);
  } catch {
    throw new Error("Could not read the resume data.");
  }

  const cleanTitle = title.trim().slice(0, 200) || "Untitled Resume";
  const db = await getDB();
  await db
    .prepare(
      "UPDATE resumes SET title = ?, data = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    )
    .bind(
      cleanTitle,
      JSON.stringify(sanitizeResumeData(parsed)),
      now(),
      id,
      user.id
    )
    .run();

  revalidatePath("/dashboard/resumes");
  revalidatePath(`/dashboard/resumes/${id}`);
}

export async function deleteResume(id: string) {
  const { user } = await requireUser();
  const db = await getDB();
  await db
    .prepare("DELETE FROM resumes WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .run();
  revalidatePath("/dashboard/resumes");
  redirect("/dashboard/resumes");
}
