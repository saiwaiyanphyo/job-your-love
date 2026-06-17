// Shared domain types for the Job Application Tracker.

// ---------------------------------------------------------------------------
// Statuses — the canonical pipeline from the design.
// ---------------------------------------------------------------------------
export type StatusId =
  | "wishlist"
  | "applied"
  | "assessment"
  | "interviewing"
  | "final"
  | "offer"
  | "accepted"
  | "rejected";

export interface StatusMeta {
  id: StatusId;
  label: string;
  /** Base accent color (hex). Badges use it for text + a tint for the bg. */
  color: string;
}

export const STATUSES: StatusMeta[] = [
  { id: "wishlist", label: "Wishlist", color: "#9B9B9B" },
  { id: "applied", label: "Applied", color: "#3B82F6" },
  { id: "assessment", label: "OA / Assessment", color: "#8B5CF6" },
  { id: "interviewing", label: "Interviewing", color: "#F97316" },
  { id: "final", label: "Final Round", color: "#EAB308" },
  { id: "offer", label: "Offer", color: "#22C55E" },
  { id: "accepted", label: "Accepted", color: "#10B981" },
  { id: "rejected", label: "Rejected", color: "#EF4444" },
];

export const STATUS_MAP: Record<StatusId, StatusMeta> = Object.fromEntries(
  STATUSES.map((s) => [s.id, s])
) as Record<StatusId, StatusMeta>;

/** Statuses that count as "in the interview pipeline". */
export const INTERVIEW_STATUSES: StatusId[] = [
  "assessment",
  "interviewing",
  "final",
];
/** Statuses that count as an offer. */
export const OFFER_STATUSES: StatusId[] = ["offer", "accepted"];

export function statusMeta(id?: string | null): StatusMeta {
  if (id && STATUS_MAP[id as StatusId]) return STATUS_MAP[id as StatusId];
  return STATUS_MAP.wishlist;
}

/** A hex color with an alpha suffix (e.g. "#3B82F6" + 0.12 → "#3B82F61f"). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

// ---------------------------------------------------------------------------
// Application fields — the canonical schema stored in job_entries.data
// ---------------------------------------------------------------------------
export interface ApplicationData {
  company?: string;
  position?: string;
  location?: string;
  salary?: string;
  status?: StatusId;
  /** Application date (ISO yyyy-mm-dd). */
  date?: string;
  follow_up?: string;
  notes?: string;
  description?: string;
  source?: string;
  url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_role?: string;
}

/** Column descriptors used to render the applications table (fixed per design). */
export interface TableColumn {
  key: keyof ApplicationData;
  label: string;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: "company", label: "Company" },
  { key: "position", label: "Position" },
  { key: "location", label: "Location" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "salary", label: "Salary" },
  { key: "follow_up", label: "Follow-up" },
  { key: "notes", label: "Notes" },
];

// ---------------------------------------------------------------------------
// Tracker + entry rows (Supabase)
// ---------------------------------------------------------------------------
export interface Tracker {
  id: string;
  user_id: string;
  name: string;
  /** Free-form column config; the new UI uses the canonical schema above. */
  columns: unknown[];
  created_at: string;
  updated_at: string;
}

export interface JobEntry {
  id: string;
  tracker_id: string;
  user_id: string;
  data: ApplicationData;
  position: number;
  created_at: string;
  updated_at: string;
}
