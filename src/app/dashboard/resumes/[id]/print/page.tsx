import { notFound } from "next/navigation";
import { PrintControls } from "@/components/resume/PrintControls";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { getResume } from "@/lib/resume/data";

export const dynamic = "force-dynamic";

export default async function ResumePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResume(id);
  if (!resume) notFound();

  return (
    <div className="min-h-screen bg-hover/40">
      <PrintControls backHref={`/dashboard/resumes/${id}`} />
      <div className="mx-auto max-w-[760px] px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="resume-print-root overflow-hidden rounded-xl border border-line bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <ResumeDocument data={resume.data} />
        </div>
      </div>
    </div>
  );
}
