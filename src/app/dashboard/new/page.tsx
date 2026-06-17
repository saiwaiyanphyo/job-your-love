import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createApplication } from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-7">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-semibold tracking-tight text-ink">
        Add New Application
      </h1>
      <ApplicationForm action={createApplication} submitLabel="Add Application" />
    </div>
  );
}
