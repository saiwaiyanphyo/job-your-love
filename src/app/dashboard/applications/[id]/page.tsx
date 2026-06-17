import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "@/lib/data";
import { statusMeta } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";

function fmt(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[11px] font-medium uppercase text-ink3"
        style={{ letterSpacing: 0.5 }}
      >
        {label}
      </p>
      <p className="mt-1 text-[13px] font-medium text-ink">{value}</p>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  const d = entry.data;
  const company = d.company || "Untitled";
  const meta = statusMeta(d.status);

  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/applications"
          className="text-[13px] text-ink2 hover:text-ink"
        >
          ← Back to Applications
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/applications/${id}/edit`}
            className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink hover:bg-hover"
          >
            Edit
          </Link>
          <DeleteApplicationButton id={id} />
        </div>
      </div>

      {/* Header */}
      <div className="mt-5 flex items-start gap-4">
        <span
          className="grid h-14 w-14 flex-none place-items-center rounded-xl text-2xl font-bold text-white"
          style={{ background: meta.color }}
        >
          {company.charAt(0).toUpperCase()}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">
              {d.position || company}
            </h1>
            <StatusBadge status={d.status} size="md" />
          </div>
          <p className="mt-0.5 text-sm text-ink2">
            {company}
            {d.location ? ` · ${d.location}` : ""}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-4">
        <Meta label="Applied" value={fmt(d.date)} />
        <Meta label="Salary Range" value={d.salary || "—"} />
        <Meta label="Next Follow-up" value={fmt(d.follow_up)} />
        <Meta label="Source" value={d.source || "—"} />
      </div>

      {/* Body */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Job Description">
            {d.description ? (
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink2">
                {d.description}
              </p>
            ) : (
              <p className="text-[13px] text-ink3">No description added yet.</p>
            )}
          </Section>

          <Section title="Application Timeline">
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-24 flex-none text-xs text-ink3">
                  {fmt(d.date)}
                </span>
                <span className="text-[13px] text-ink">
                  Application submitted
                </span>
              </li>
              {d.status && d.status !== "applied" && (
                <li className="flex gap-3">
                  <span className="w-24 flex-none text-xs text-ink3">
                    Current
                  </span>
                  <span className="text-[13px] text-ink">
                    Status: {meta.label}
                  </span>
                </li>
              )}
              {d.follow_up && (
                <li className="flex gap-3">
                  <span className="w-24 flex-none text-xs text-ink3">
                    {fmt(d.follow_up)}
                  </span>
                  <span className="text-[13px] text-ink">
                    Next follow-up scheduled
                  </span>
                </li>
              )}
            </ol>
          </Section>

          {d.url && (
            <Section title="Job Posting">
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-status-applied hover:underline"
              >
                {d.url} ↗
              </a>
            </Section>
          )}
        </div>

        <div className="space-y-5">
          <Section title="Contact">
            {d.contact_name || d.contact_email ? (
              <div>
                <p className="text-[13px] font-medium text-ink">
                  {d.contact_name || "—"}
                </p>
                {d.contact_role && (
                  <p className="text-xs text-ink3">{d.contact_role}</p>
                )}
                {d.contact_email && (
                  <a
                    href={`mailto:${d.contact_email}`}
                    className="mt-1 block text-xs text-ink2 hover:underline"
                  >
                    {d.contact_email}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-[13px] text-ink3">No contact added.</p>
            )}
          </Section>

          <Section title="Attachments">
            <p className="text-[13px] text-ink3">No attachments yet.</p>
          </Section>

          <Section title="Follow-up Reminders">
            {d.follow_up ? (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink">Follow up</span>
                <span className="text-xs text-ink3">{fmt(d.follow_up)}</span>
              </div>
            ) : (
              <p className="text-[13px] text-ink3">No reminders set.</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
