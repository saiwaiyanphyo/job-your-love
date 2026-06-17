import { getActiveTracker, getEntries } from "@/lib/data";
import { INTERVIEW_STATUSES } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function InterviewsPage() {
  const tracker = await getActiveTracker();
  const all = await getEntries(tracker.id);
  const entries = all.filter(
    (e) => e.data.status && INTERVIEW_STATUSES.includes(e.data.status)
  );

  return (
    <div className="px-8 py-7">
      <PageHeader
        title="Interviews"
        subtitle="Applications in assessment, interviewing, or final rounds."
      />
      <ApplicationsTable
        entries={entries}
        emptyHint="No applications in the interview pipeline yet."
      />
    </div>
  );
}
