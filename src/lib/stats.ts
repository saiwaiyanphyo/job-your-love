import {
  INTERVIEW_STATUSES,
  OFFER_STATUSES,
  type JobEntry,
  type StatusId,
} from "./types";

export interface DashboardStats {
  total: number;
  addedThisMonth: number;
  interviews: number;
  interviewsUpcoming: number;
  offers: number;
  offersPending: number;
  rejections: number;
  responseRate: number;
}

export function computeStats(entries: JobEntry[]): DashboardStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const today = new Date(year, month, now.getDate());

  const has = (s: StatusId | undefined, set: StatusId[]) =>
    s !== undefined && set.includes(s);

  const interviews = entries.filter((e) =>
    has(e.data.status, INTERVIEW_STATUSES)
  );
  const offers = entries.filter((e) => has(e.data.status, OFFER_STATUSES));
  const rejections = entries.filter((e) => e.data.status === "rejected");

  const addedThisMonth = entries.filter((e) => {
    const d = new Date(e.created_at);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const interviewsUpcoming = interviews.filter((e) => {
    if (!e.data.follow_up) return false;
    const d = new Date(e.data.follow_up);
    return !isNaN(d.getTime()) && d >= today;
  }).length;

  const offersPending = offers.filter((e) => e.data.status === "offer").length;

  // "Responded" = anything past the initial applied/wishlist stages.
  const responded = entries.filter(
    (e) => e.data.status && !["wishlist", "applied"].includes(e.data.status)
  ).length;
  const responseRate =
    entries.length === 0 ? 0 : Math.round((responded / entries.length) * 100);

  return {
    total: entries.length,
    addedThisMonth,
    interviews: interviews.length,
    interviewsUpcoming,
    offers: offers.length,
    offersPending,
    rejections: rejections.length,
    responseRate,
  };
}
