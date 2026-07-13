import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmailImportForm } from "./EmailImportForm";

export default function ImportApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-7">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>
      <h1 className="mb-2 mt-3 text-2xl font-semibold tracking-tight text-ink">
        Import from Email
      </h1>
      <p className="mb-6 text-sm text-ink2">
        Paste a job application confirmation email and review the extracted
        details before adding it to your tracker.
      </p>
      <EmailImportForm />
    </div>
  );
}
