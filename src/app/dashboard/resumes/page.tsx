import Link from "next/link";
import { FileText, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getResumes } from "@/lib/resume/data";
import { createResume, deleteResume } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ResumesPage() {
  const resumes = await getResumes();

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 md:px-8 md:py-7">
      <PageHeader
        title="Resumes"
        subtitle="Build a clean CV and export it to PDF."
        action={
          <form action={createResume}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Resume
            </button>
          </form>
        }
      />

      {resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line2 bg-card px-6 py-14 text-center">
          <FileText className="mx-auto h-8 w-8 text-ink3" />
          <p className="mt-3 text-sm font-medium text-ink">No resumes yet</p>
          <p className="mt-1 text-[13px] text-ink2">
            Create your first resume and download it as a PDF.
          </p>
          <form action={createResume} className="mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Resume
            </button>
          </form>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="group relative rounded-xl border border-line bg-card p-4 transition hover:border-line2 hover:shadow-sm"
            >
              <Link href={`/dashboard/resumes/${resume.id}`} className="block">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-hover text-ink2">
                    <FileText className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {resume.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink3">
                      Updated {formatDate(resume.updated_at)}
                    </p>
                  </div>
                </div>
              </Link>
              <form
                action={deleteResume.bind(null, resume.id)}
                className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100"
              >
                <button
                  type="submit"
                  aria-label="Delete resume"
                  className="rounded-md p-1.5 text-ink3 hover:bg-hover hover:text-status-rejected"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
