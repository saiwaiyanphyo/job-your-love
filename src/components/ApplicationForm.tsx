"use client";

import Link from "next/link";
import { STATUSES, type ApplicationData } from "@/lib/types";
import { FormSubmit } from "./FormSubmit";

const labelCls = "text-xs font-medium text-ink2";
const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink3 focus:border-ink";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export function ApplicationForm({
  action,
  initial,
  submitLabel = "Add Application",
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: ApplicationData;
  submitLabel?: string;
}) {
  const d = initial ?? {};

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <Field label="Company">
          <input
            name="company"
            required
            defaultValue={d.company}
            placeholder="e.g. Google, Stripe, Notion..."
            className={inputCls}
          />
        </Field>
        <Field label="Position">
          <input
            name="position"
            defaultValue={d.position}
            placeholder="e.g. Senior Product Designer"
            className={inputCls}
          />
        </Field>
        <Field label="Location">
          <input
            name="location"
            defaultValue={d.location}
            placeholder="e.g. San Francisco, CA or Remote"
            className={inputCls}
          />
        </Field>
        <Field label="Salary Range">
          <input
            name="salary"
            defaultValue={d.salary}
            placeholder="e.g. $150K – $190K"
            className={inputCls}
          />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={d.status ?? "applied"} className={inputCls}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Application Date">
          <input
            type="date"
            name="date"
            defaultValue={d.date}
            className={inputCls}
          />
        </Field>
        <Field label="Job Posting URL">
          <input
            type="text"
            inputMode="url"
            name="url"
            defaultValue={d.url}
            placeholder="Paste link to job description..."
            className={inputCls}
          />
        </Field>
        <Field label="Source">
          <input
            name="source"
            defaultValue={d.source}
            placeholder="e.g. LinkedIn, Referral, Company Site..."
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Job Description / Notes">
        <textarea
          name="description"
          rows={4}
          defaultValue={d.description}
          placeholder="Add notes about the role, requirements, or anything else to remember..."
          className={`${inputCls} resize-y`}
        />
      </Field>

      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        <Field label="Next Follow-up">
          <input
            type="date"
            name="follow_up"
            defaultValue={d.follow_up}
            className={inputCls}
          />
        </Field>
        <Field label="Contact Name">
          <input
            name="contact_name"
            defaultValue={d.contact_name}
            placeholder="e.g. Sarah Johnson"
            className={inputCls}
          />
        </Field>
        <Field label="Contact Email">
          <input
            type="email"
            name="contact_email"
            defaultValue={d.contact_email}
            placeholder="e.g. recruiter@company.com"
            className={inputCls}
          />
        </Field>
        <Field label="Contact Role">
          <input
            name="contact_role"
            defaultValue={d.contact_role}
            placeholder="e.g. Recruiter, Hiring Manager"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line pt-5">
        <Link
          href="/dashboard/applications"
          className="rounded-lg px-4 py-2 text-[13px] font-medium text-ink2 hover:bg-hover hover:text-ink"
        >
          Cancel
        </Link>
        <FormSubmit label={submitLabel} />
      </div>
    </form>
  );
}
