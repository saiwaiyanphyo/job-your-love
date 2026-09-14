import Link from "next/link";
import { getActiveTracker, getEntries } from "@/lib/data";
import { computeStats } from "@/lib/stats";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { ApplicationCard } from "@/components/ApplicationCard";
import { PlusIcon } from "@/components/icons";

const RECENT_COUNT = 3;

export default async function DashboardPage() {
  const tracker = await getActiveTracker();
  const entries = await getEntries(tracker.id);
  const s = computeStats(entries);

  return (
    <div className="px-4 py-5 md:px-8 md:py-7">
      <PageHeader title="Dashboard" subtitle={tracker.name} />

      <div className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
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

      {/* Mobile: a short list of recent applications + a primary add button */}
      <div className="mt-6 md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-[13px] font-medium text-ink2 hover:text-ink"
          >
            View all
          </Link>
        </div>
        {entries.length === 0 ? (
          <p className="rounded-xl border border-line bg-white px-6 py-10 text-center text-[13px] text-ink2">
            No applications yet. Add your first one to get started.
          </p>
        ) : (
          <div className="space-y-2.5">
            {entries.slice(0, RECENT_COUNT).map((e) => (
              <ApplicationCard key={e.id} entry={e} />
            ))}
          </div>
        )}
        <Link
          href="/dashboard/new"
          className="mt-5 flex h-[46px] items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white hover:opacity-90"
        >
          <PlusIcon className="h-4 w-4" />
          Add Application
        </Link>
      </div>

      <div className="mt-8 hidden md:block">
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
