import {
  requireUser,
  getAllTrackers,
  getTrackerCounts,
  getActiveTracker,
} from "@/lib/data";
import { signOut } from "@/app/auth/actions";
import { PageHeader } from "@/components/PageHeader";
import { ChangePassword } from "./ChangePassword";
import { TrackerList } from "./TrackerList";

export default async function ProfilePage() {
  const { user } = await requireUser();
  const email = user.email ?? "you@example.com";
  const name = email.split("@")[0];
  const provider = user.app_metadata?.provider ?? "email";

  const [trackers, counts, active] = await Promise.all([
    getAllTrackers(),
    getTrackerCounts(),
    getActiveTracker(),
  ]);
  const rows = trackers.map((t) => ({
    id: t.id,
    name: t.name,
    updated_at: t.updated_at,
    count: counts[t.id] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-2xl px-8 py-7">
      <PageHeader title="Account Settings" />

      <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-lg font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-base font-semibold text-ink">{name}</p>
          <p className="text-sm text-ink2">{email}</p>
          <p className="mt-1 text-xs text-ink3">
            Signed in with {provider === "google" ? "Google" : "email"}
          </p>
        </div>
      </div>

      {provider !== "google" && (
        <div className="mt-5 rounded-xl border border-line bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Change password</h3>
          <p className="mb-3 mt-1 text-[13px] text-ink2">
            Choose a new password for your account.
          </p>
          <ChangePassword />
        </div>
      )}

      <div className="mt-5">
        <TrackerList trackers={rows} activeId={active.id} />
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-white p-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">Log out</h3>
          <p className="text-[13px] text-ink2">
            Sign out of your account on this device.
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg bg-status-rejected px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}
