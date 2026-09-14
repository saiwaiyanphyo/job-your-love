import Link from "next/link";
import { MapPin, Calendar, Wallet } from "lucide-react";
import type { JobEntry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Compact card used in place of the applications table on small screens. */
export function ApplicationCard({ entry }: { entry: JobEntry }) {
  const d = entry.data;
  const meta = [
    { Icon: MapPin, value: d.location },
    { Icon: Calendar, value: fmtDate(d.date) },
    { Icon: Wallet, value: d.salary },
  ];

  return (
    <Link
      href={`/dashboard/applications/${entry.id}`}
      className="block rounded-xl border border-line bg-white p-3.5 transition active:bg-page"
    >
      <div className="flex justify-between gap-2.5">
        <div className="min-w-0 flex-1 space-y-[3px]">
          <p className="truncate text-[15px] font-semibold text-ink">
            {d.company || "—"}
          </p>
          <p className="truncate text-[13px] text-ink2">{d.position || "—"}</p>
        </div>
        <div className="flex-none">
          <StatusBadge status={d.status} />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1">
        {meta.map(({ Icon, value }, i) => (
          <span
            key={i}
            className="flex min-w-0 items-center gap-[5px] text-xs text-ink2"
          >
            <Icon className="h-[13px] w-[13px] flex-none text-ink3" />
            <span className="truncate">{value || "—"}</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
