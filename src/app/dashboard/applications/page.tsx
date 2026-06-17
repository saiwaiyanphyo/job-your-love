import { getActiveTracker, getEntries } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function ApplicationsPage() {
  const tracker = await getActiveTracker();
  const entries = await getEntries(tracker.id);

  return (
    <div className="px-8 py-7">
      <PageHeader
        title="All Applications"
        subtitle={`${entries.length} application${
          entries.length === 1 ? "" : "s"
        } tracked`}
      />
      <ApplicationsTable
        entries={entries}
        emptyHint="No applications yet. Add your first one to get started."
      />
    </div>
  );
}
