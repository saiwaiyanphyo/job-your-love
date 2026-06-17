import { getActiveTracker, getEntries } from "@/lib/data";
import { OFFER_STATUSES } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function OffersPage() {
  const tracker = await getActiveTracker();
  const all = await getEntries(tracker.id);
  const entries = all.filter(
    (e) => e.data.status && OFFER_STATUSES.includes(e.data.status)
  );

  return (
    <div className="px-8 py-7">
      <PageHeader
        title="Offers"
        subtitle="Offers received and roles you've accepted."
      />
      <ApplicationsTable
        entries={entries}
        emptyHint="No offers yet — they're coming."
      />
    </div>
  );
}
