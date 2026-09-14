"use client";

import Link from "next/link";
import { STATUSES, type ApplicationData } from "@/lib/types";
import { FormSubmit } from "./FormSubmit";

const labelCls = "text-xs font-medium text-ink2";
const inputCls =
  "w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-ink md:rounded-lg md:text-sm";

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  /** Span both columns on desktop. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "md:col-span-2" : ""}`}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

/**
 * On mobile each group is its own titled card; on desktop the cards dissolve
 * into one continuous two-column grid.
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0">
      <h3 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wide text-ink3 md:hidden">
        {title}
      </h3>
      <div className="grid gap-3.5 md:grid-cols-2 md:gap-x-5 md:gap-y-4">
        {children}
      </div>
    </section>
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
    <form action={action} className="space-y-[18px] md:space-y-5">
      <Section title="Role">
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
      </Section>

      <Section title="Status & Dates">
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
        <Field label="Next Follow-up">
          <input
            type="date"
            name="follow_up"
            defaultValue={d.follow_up}
            className={inputCls}
          />
        </Field>
      </Section>

      <Section title="Source">
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
      </Section>

      <Section title="Details">
        <Field label="Job Description" wide>
          <textarea
            name="description"
            rows={4}
            defaultValue={d.description}
            placeholder="Paste the job description..."
            className={`${inputCls} resize-y`}
          />
        </Field>
        <Field label="Notes" wide>
          <textarea
            name="notes"
            rows={3}
            defaultValue={d.notes}
            placeholder="Add notes about the role, requirements, or anything else to remember..."
            className={`${inputCls} resize-y`}
          />
        </Field>
      </Section>

      <Section title="Contact">
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
      </Section>

      <div className="flex items-center gap-2.5 md:justify-end md:gap-2 md:border-t md:border-line md:pt-5">
        <Link
          href="/dashboard/applications"
          className="flex h-[46px] flex-1 items-center justify-center rounded-xl border border-line bg-white text-sm font-medium text-ink md:h-auto md:flex-none md:rounded-lg md:border-0 md:bg-transparent md:px-4 md:py-2 md:text-[13px] md:text-ink2 md:hover:bg-hover md:hover:text-ink"
        >
          Cancel
        </Link>
        <FormSubmit
          label={submitLabel}
          className="h-[46px] flex-1 rounded-xl text-sm font-semibold md:h-auto md:flex-none md:rounded-lg md:px-4 md:py-2 md:text-[13px] md:font-medium"
        />
      </div>
    </form>
  );
}
