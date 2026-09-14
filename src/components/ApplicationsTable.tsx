"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Inbox, MailPlus } from "lucide-react";
import {
  STATUSES,
  TABLE_COLUMNS,
  type JobEntry,
  type StatusId,
} from "@/lib/types";
import { deleteApplication, updateStatus } from "@/app/dashboard/actions";
import { StatusSelect } from "./StatusSelect";
import { RowMenu } from "./RowMenu";
import { ApplicationCard } from "./ApplicationCard";
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
  const [statusFilter, setStatusFilter] = useState<StatusId | "all">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries;
    if (statusFilter !== "all") {
      list = list.filter((e) => e.data.status === statusFilter);
    }
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
  }, [entries, query, sort, statusFilter]);

  const filtered = query.trim() !== "" || statusFilter !== "all";

  function onStatus(entry: JobEntry, status: StatusId) {
    startTransition(() => updateStatus(entry.id, entry.data, status));
  }

  function onDelete(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    startTransition(() => deleteApplication(id));
  }

  const searchInput = (
    <div className="relative min-w-0 flex-1">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink3" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search companies, positions..."
        className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-ink md:h-auto md:rounded-lg md:py-2"
      />
    </div>
  );

  return (
    <div>
      {showToolbar && (
        <>
          {/* Mobile toolbar */}
          <div className="mb-4 space-y-2.5 md:hidden">
            {searchInput}
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusId | "all")
                  }
                  aria-label="Filter by status"
                  className="h-[38px] w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[13px] font-medium text-ink outline-none focus:border-ink"
                >
                  <option value="all">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink2" />
              </div>
              <Link
                href="/dashboard/import"
                className="inline-flex h-[38px] flex-none items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-[13px] font-medium text-ink"
              >
                <MailPlus className="h-[15px] w-[15px]" />
                Import
              </Link>
              <Link
                href="/dashboard/new"
                className="inline-flex h-[38px] flex-none items-center gap-1.5 rounded-xl bg-ink px-3 text-[13px] font-semibold text-white"
              >
                <PlusIcon className="h-[15px] w-[15px]" />
                Add
              </Link>
            </div>
          </div>

          {/* Desktop toolbar */}
          <div className="mb-4 hidden flex-wrap items-center gap-2 md:flex">
            {searchInput}
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
        </>
      )}

      {/* Mobile: card list */}
      <div className="md:hidden">
        {rows.length > 0 ? (
          <div className="space-y-2.5">
            {rows.map((e) => (
              <ApplicationCard key={e.id} entry={e} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-white px-6 py-12 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sidebar text-ink3">
              <Inbox className="h-5 w-5" />
            </span>
            <p className="text-[13px] text-ink2">
              {filtered ? "No matches for your filters." : emptyHint}
            </p>
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-line bg-white md:block">
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
                  {filtered ? "No matches for your search." : emptyHint}
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
