import { notFound } from "next/navigation";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { getResume } from "@/lib/resume/data";

export const dynamic = "force-dynamic";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await getResume(id);
  if (!resume) notFound();

  return (
    <ResumeEditor
      id={resume.id}
      initialTitle={resume.title}
      initialData={resume.data}
    />
  );
}
