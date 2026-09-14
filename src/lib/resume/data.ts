import "server-only";
import { requireUser } from "@/lib/data";
import { getDB, parseJson } from "@/lib/db";
import { normalizeResumeData, type Resume } from "@/lib/resume/types";

type ResumeRow = Omit<Resume, "data"> & { data: string };

function toResume(row: ResumeRow): Resume {
  return { ...row, data: normalizeResumeData(parseJson(row.data, {})) };
}

/** All of the user's resumes, most-recently-updated first. */
export async function getResumes(): Promise<Resume[]> {
  const { user } = await requireUser();
  const db = await getDB();
  const { results } = await db
    .prepare("SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC")
    .bind(user.id)
    .all<ResumeRow>();
  return results.map(toResume);
}

export async function getResume(id: string): Promise<Resume | null> {
  const { user } = await requireUser();
  const db = await getDB();
  const row = await db
    .prepare("SELECT * FROM resumes WHERE id = ? AND user_id = ?")
    .bind(id, user.id)
    .first<ResumeRow>();
  return row ? toResume(row) : null;
}
