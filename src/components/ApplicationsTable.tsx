"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailPlus } from "lucide-react";
import { TABLE_COLUMNS, type JobEntry, type StatusId } from "@/lib/types";
import { deleteApplication, updateStatus } from "@/app/dashboard/actions";
import { StatusSelect } from "./StatusSelect";
import { RowMenu } from "./RowMenu";
import { SearchIcon, PlusIcon } from "./icons";

type SortKey = "recent" | "company" | "status";

function fmtDate(v?: string, opts?: Intl.DateTimeFormatOptions) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", opts ?? {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationsTable({
  entries,
  showToolbar = true,
  emptyHint = "No applications yet.",
}: {
  entries: JobEntry[];
  showToolbar?: boolean;
  emptyHint?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries;
    if (q) {
      list = list.filter((e) => {
        const d = e.data;
        return [d.company, d.position, d.location, d.source]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
      });
    }
    const sorted = [...list];
    if (sort === "company") {
      sorted.sort((a, b) =>
        (a.data.company ?? "").localeCompare(b.data.company ?? "")
      );
    } else if (sort === "status") {
      sorted.sort((a, b) =>
        (a.data.status ?? "").localeCompare(b.data.status ?? "")
      );
    }
    // "recent" keeps incoming order (already newest-first from the query)
    return sorted;
  }, [entries, query, sort]);

  function onStatus(entry: JobEntry, status: StatusId) {
    startTransition(() => updateStatus(entry.id, entry.data, status));
  }

  function onDelete(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    startTransition(() => deleteApplication(id));
  }

  return (
    <div>
      {showToolbar && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, positions..."
              className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-ink"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink2 outline-none focus:border-ink"
          >
            <option value="recent">Sort: Newest</option>
            <option value="company">Sort: Company</option>
            <option value="status">Sort: Status</option>
          </select>
          <Link
            href="/dashboard/import"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink2 hover:bg-hover hover:text-ink"
          >
            <MailPlus className="h-4 w-4" />
            Import Email
          </Link>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-[13px] font-medium text-white hover:opacity-90"
          >
            <PlusIcon className="h-4 w-4" />
            Add Application
          </Link>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {TABLE_COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-medium text-ink2"
                >
                  {c.label}
                </th>
              ))}
              <th className="w-10 px-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const d = e.data;
              return (
                <tr
                  key={e.id}
                  onClick={() =>
                    router.push(`/dashboard/applications/${e.id}`)
                  }
                  className="group cursor-pointer border-b border-line/70 last:border-0 hover:bg-page"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-ink">
                    {d.company || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink">
                    {d.position || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink2">
                    {d.location || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink2">
                    {fmtDate(d.date)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      value={d.status}
                      onSelect={(s) => onStatus(e, s)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-ink">
                    {d.salary || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink2">
                    {fmtDate(d.follow_up, { month: "short", day: "numeric" })}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-xs text-ink3">
                    {d.notes || d.source || "—"}
                  </td>
                  <td
                    className="px-2 text-center"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <RowMenu
                      viewHref={`/dashboard/applications/${e.id}`}
                      onDelete={() => onDelete(e.id)}
                    />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length + 1}
                  className="px-4 py-12 text-center text-sm text-ink3"
                >
                  {query ? "No matches for your search." : emptyHint}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <p className="mt-3 text-xs text-ink3">
          Showing {rows.length} application{rows.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
