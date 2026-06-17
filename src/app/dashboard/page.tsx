import { getActiveTracker, getEntries } from "@/lib/data";
import { computeStats } from "@/lib/stats";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export default async function DashboardPage() {
  const tracker = await getActiveTracker();
  const entries = await getEntries(tracker.id);
  const s = computeStats(entries);

  return (
    <div className="px-8 py-7">
      <PageHeader title="Dashboard" subtitle={tracker.name} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={s.total}
          subtitle={`+${s.addedThisMonth} this month`}
        />
        <StatCard
          label="Interviews"
          value={s.interviews}
          subtitle={`${s.interviewsUpcoming} upcoming`}
        />
        <StatCard
          label="Offers"
          value={s.offers}
          subtitle={`${s.offersPending} pending response`}
        />
        <StatCard
          label="Rejections"
          value={s.rejections}
          subtitle={`${s.responseRate}% response rate`}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-ink">
          All Applications
        </h2>
        <ApplicationsTable
          entries={entries}
          emptyHint="No applications yet. Add your first one to get started."
        />
      </div>
    </div>
  );
}
