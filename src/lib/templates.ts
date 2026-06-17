import { StatusId } from "./types";

export interface TrackerTemplate {
  key: string;
  name: string;
  description: string;
  features: string[];
  /** Status options enabled for this template. */
  statuses: StatusId[];
}

const FULL_PIPELINE: StatusId[] = [
  "wishlist",
  "applied",
  "assessment",
  "interviewing",
  "final",
  "offer",
  "accepted",
  "rejected",
];

const SIMPLE_PIPELINE: StatusId[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
];

export const TEMPLATES: TrackerTemplate[] = [
  {
    key: "job-search",
    name: "Job Search",
    description:
      "Full-featured tracker for professional job applications. Track roles, interviews, and offers across companies.",
    features: [
      "Status tracking pipeline",
      "Interview scheduling",
      "Salary comparison",
      "Contact management",
    ],
    statuses: FULL_PIPELINE,
  },
  {
    key: "internship",
    name: "Internship",
    description:
      "Streamlined tracker for internship and co-op applications. Perfect for students and recent grads.",
    features: [
      "Simplified pipeline",
      "Deadline reminders",
      "Company research notes",
      "Offer comparison",
    ],
    statuses: SIMPLE_PIPELINE,
  },
  {
    key: "custom",
    name: "Custom Tracker",
    description:
      "Start from scratch and build your own tracker. Define custom stages, fields, and workflow.",
    features: [
      "Fully customizable columns",
      "Custom status stages",
      "Flexible data fields",
      "Adapts to any workflow",
    ],
    statuses: FULL_PIPELINE,
  },
];

export function getTemplate(key: string): TrackerTemplate {
  return TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];
}
