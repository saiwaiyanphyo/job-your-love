// Resume domain types — the shape stored in resumes.data (JSONB).
// A deliberately small, "mini" CV model: enough for a clean one-page resume
// without the heavy presentation state of a full resume builder.

export interface ResumeBasics {
  name?: string;
  /** Headline / role, e.g. "Senior Product Designer". */
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  /** Portfolio / LinkedIn / site — shown as a link. */
  website?: string;
  /** Short professional summary (plain text). */
  summary?: string;
}

export interface ExperienceItem {
  id: string;
  company?: string;
  role?: string;
  location?: string;
  /** Free-form dates, e.g. "Jan 2022" / "Present". */
  start?: string;
  end?: string;
  /** One bullet per line. */
  description?: string;
}

export interface EducationItem {
  id: string;
  school?: string;
  degree?: string;
  location?: string;
  start?: string;
  end?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  name?: string;
  link?: string;
  description?: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  /** One skill group per line, e.g. "Languages: TypeScript, Go". */
  skills?: string;
}

/** A resume row as stored in Supabase. */
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  data: ResumeData;
  created_at: string;
  updated_at: string;
}

export function emptyResumeData(): ResumeData {
  return {
    basics: {},
    experience: [],
    education: [],
    projects: [],
    skills: "",
  };
}

/** Fill in any missing top-level keys so older/partial rows render safely. */
export function normalizeResumeData(data: Partial<ResumeData> | null | undefined): ResumeData {
  return {
    basics: data?.basics ?? {},
    experience: Array.isArray(data?.experience) ? data!.experience : [],
    education: Array.isArray(data?.education) ? data!.education : [],
    projects: Array.isArray(data?.projects) ? data!.projects : [],
    skills: typeof data?.skills === "string" ? data!.skills : "",
  };
}

/** Split a multi-line description field into trimmed, non-empty bullet lines. */
export function bulletLines(text?: string): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s?/, "").trim())
    .filter((line) => line.length > 0);
}

let idCounter = 0;
/** Generate a client-side id for new list items (crypto when available). */
export function newItemId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `item-${Date.now()}-${idCounter}`;
}
