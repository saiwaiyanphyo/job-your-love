import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/lib/data";
import { updateApplication } from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/ApplicationForm";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  const action = updateApplication.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-8 md:py-7">
      <Link
        href={`/dashboard/applications/${id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink2 hover:text-ink md:font-normal"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to application
      </Link>
      <h1 className="mb-[18px] mt-[18px] text-[22px] font-semibold tracking-tight text-ink md:mb-6 md:mt-3 md:text-2xl">
        Edit Application
      </h1>
      <ApplicationForm
        action={action}
        initial={entry.data}
        submitLabel="Save Changes"
      />
    </div>
  );
}
