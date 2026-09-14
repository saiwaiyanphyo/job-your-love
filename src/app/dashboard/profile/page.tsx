import { LogOut } from "lucide-react";
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
    <div className="mx-auto max-w-2xl px-4 py-5 md:px-8 md:py-7">
      <PageHeader title="Account Settings" />

      <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 md:gap-4 md:p-5">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-hover text-[17px] font-semibold text-ink md:h-14 md:w-14 md:bg-ink md:text-lg md:text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink md:text-base">
            {name}
          </p>
          <p className="truncate text-[13px] text-ink2 md:text-sm">{email}</p>
          <p className="mt-0.5 text-[11px] text-ink3 md:mt-1 md:text-xs">
            Signed in with {provider === "google" ? "Google" : "email"}
          </p>
        </div>
      </div>

      {provider !== "google" && (
        <div className="mt-3.5 rounded-xl border border-line bg-white p-4 md:mt-5 md:p-5">
          <h3 className="text-[15px] font-semibold text-ink md:text-sm">
            Change password
          </h3>
          <p className="mb-3 mt-1 text-xs text-ink2 md:text-[13px]">
            Choose a new password for your account.
          </p>
          <ChangePassword />
        </div>
      )}

      <div className="mt-3.5 md:mt-5">
        <TrackerList trackers={rows} activeId={active.id} />
      </div>

      <div className="mt-3.5 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 md:mt-5 md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <h3 className="text-[15px] font-semibold text-ink md:text-sm">
            Log out
          </h3>
          <p className="mt-1 text-xs text-ink2 md:mt-0 md:text-[13px]">
            Sign out of your account on this device.
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-semibold text-[#c04a3d] hover:bg-hover md:h-auto md:w-auto md:rounded-lg md:border-0 md:bg-status-rejected md:px-4 md:py-2 md:text-[13px] md:font-medium md:text-white md:hover:bg-status-rejected md:hover:opacity-90"
          >
            <LogOut className="h-[15px] w-[15px] md:hidden" />
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}
