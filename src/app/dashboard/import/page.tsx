import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmailImportForm } from "./EmailImportForm";

export default function ImportApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-8 md:py-7">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink2 hover:text-ink md:font-normal"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>
      <h1 className="mb-1.5 mt-[18px] text-[22px] font-semibold tracking-tight text-ink md:mb-2 md:mt-3 md:text-2xl">
        Import from Email
      </h1>
      <p className="mb-[18px] text-[13px] text-ink2 md:mb-6 md:text-sm">
        Paste a job application confirmation email and review the extracted
        details before adding it to your tracker.
      </p>
      <EmailImportForm />
    </div>
  );
}
