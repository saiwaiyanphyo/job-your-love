import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createApplication } from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-8 md:py-7">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink2 hover:text-ink md:font-normal"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Link>
      <h1 className="mb-[18px] mt-[18px] text-[22px] font-semibold tracking-tight text-ink md:mb-6 md:mt-3 md:text-2xl">
        Add New Application
      </h1>
      <ApplicationForm action={createApplication} submitLabel="Add Application" />
    </div>
  );
}
