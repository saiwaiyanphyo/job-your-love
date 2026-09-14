"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import {
  setActiveTracker,
  renameTracker,
  deleteTracker,
} from "@/app/dashboard/actions";

interface Row {
  id: string;
  name: string;
  updated_at: string;
  count: number;
}

function fmt(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TrackerList({
  trackers,
  activeId,
}: {
  trackers: Row[];
  activeId: string;
}) {
  const [, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-line bg-white p-4 md:p-0">
      <div className="flex items-center justify-between pb-3 md:border-b md:border-line md:px-5 md:py-3.5">
        <div className="flex items-center gap-2 md:items-baseline">
          <h3 className="text-[15px] font-semibold text-ink md:text-sm">
            My Trackers
          </h3>
          <span className="rounded-full bg-sidebar px-2 py-[3px] text-[11px] font-medium text-ink2 md:bg-transparent md:p-0 md:text-[13px] md:font-normal md:text-ink3">
            {trackers.length} active
          </span>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex h-8 items-center gap-1 rounded-full bg-ink px-3 text-[13px] font-semibold text-white hover:opacity-90 md:h-auto md:rounded-lg md:border md:border-line md:bg-transparent md:py-1.5 md:font-medium md:text-ink md:hover:bg-hover md:hover:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Link>
      </div>

      <ul className="space-y-2 md:space-y-0">
        {trackers.map((t) => {
          const active = t.id === activeId;
          return (
            <li
              key={t.id}
              className={`flex items-center justify-between gap-3 rounded-[10px] p-3 md:rounded-none md:border-0 md:border-b md:border-line/70 md:bg-transparent md:px-5 md:py-3 md:last:border-0 ${
                active ? "border border-line bg-sidebar" : "bg-page"
              }`}
            >
              <div className="min-w-0 flex-1">
                {editing === t.id ? (
                  <input
                    autoFocus
                    defaultValue={t.name}
                    onBlur={(e) => {
                      setEditing(null);
                      const name = e.target.value.trim();
                      if (name && name !== t.name)
                        startTransition(() => renameTracker(t.id, name));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                      if (e.key === "Escape") setEditing(null);
                    }}
                    className="w-full rounded border border-ink px-1.5 py-0.5 text-[14px] font-medium text-ink outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setEditing(t.id)}
                    title="Click to rename"
                    className="block max-w-full truncate text-left text-[14px] font-semibold text-ink hover:underline md:font-medium"
                  >
                    {t.name}
                  </button>
                )}
                <p className="mt-0.5 truncate text-[11px] text-ink3 md:text-xs">
                  {t.count} application{t.count === 1 ? "" : "s"}
                  {t.updated_at ? ` · Last updated ${fmt(t.updated_at)}` : ""}
                </p>
              </div>

              <div className="flex flex-none items-center gap-2">
                {active ? (
                  <span className="flex h-[30px] items-center rounded-full border border-line bg-white px-3 text-xs font-medium text-ink2 md:h-auto md:border-0 md:bg-hover md:px-2.5 md:py-0.5 md:text-[11px] md:text-ink">
                    Current
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        startTransition(() => setActiveTracker(t.id))
                      }
                      className="h-[30px] rounded-full border border-line bg-white px-3 text-xs font-medium text-ink md:h-auto md:rounded-md md:border-0 md:bg-transparent md:px-2.5 md:py-1 md:text-ink2 md:hover:bg-hover md:hover:text-ink"
                    >
                      Switch
                    </button>
                    {trackers.length > 1 && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Delete "${t.name}" and all its applications?`
                            )
                          )
                            startTransition(() => deleteTracker(t.id));
                        }}
                        className="grid h-7 w-7 place-items-center rounded-md text-ink3 hover:bg-hover hover:text-status-rejected"
                        aria-label="Delete tracker"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
