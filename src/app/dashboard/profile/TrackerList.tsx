"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
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
    <div className="rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold text-ink">My Trackers</h3>
          <span className="text-[13px] text-ink3">
            {trackers.length} active
          </span>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-hover"
        >
          + Add
        </Link>
      </div>

      <ul>
        {trackers.map((t) => {
          const active = t.id === activeId;
          return (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-3 last:border-0"
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
                    className="block max-w-full truncate text-left text-[14px] font-medium text-ink hover:underline"
                  >
                    {t.name}
                  </button>
                )}
                <p className="mt-0.5 truncate text-xs text-ink3">
                  {t.count} application{t.count === 1 ? "" : "s"}
                  {t.updated_at ? ` · Last updated ${fmt(t.updated_at)}` : ""}
                </p>
              </div>

              <div className="flex flex-none items-center gap-2">
                {active ? (
                  <span className="rounded-full bg-hover px-2.5 py-0.5 text-[11px] font-medium text-ink">
                    Current
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        startTransition(() => setActiveTracker(t.id))
                      }
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-ink2 hover:bg-hover hover:text-ink"
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
                        className="rounded-md px-2 py-1 text-xs text-ink3 hover:bg-hover hover:text-status-rejected"
                        aria-label="Delete tracker"
                      >
                        ✕
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
