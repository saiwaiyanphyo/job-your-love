import { getActiveTracker, getEntries } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function RejectionsPage() {
  const tracker = await getActiveTracker();
  const all = await getEntries(tracker.id);
  const entries = all.filter((e) => e.data.status === "rejected");

  return (
    <div className="px-8 py-7">
      <PageHeader
        title="Rejections"
        subtitle="Closed out — every no gets you closer to a yes."
      />
      <ApplicationsTable entries={entries} emptyHint="No rejections logged." />
    </div>
  );
}
