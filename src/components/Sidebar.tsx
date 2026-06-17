"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  ListIcon,
  CalendarIcon,
  GiftIcon,
  XCircleIcon,
} from "./icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: GridIcon, exact: true },
  { href: "/dashboard/applications", label: "Applications", Icon: ListIcon },
  { href: "/dashboard/interviews", label: "Interviews", Icon: CalendarIcon },
  { href: "/dashboard/offers", label: "Offers", Icon: GiftIcon },
  { href: "/dashboard/rejections", label: "Rejections", Icon: XCircleIcon },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const name = email.split("@")[0];
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-none flex-col border-r border-line bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-xs font-bold text-white">
          J
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          Job Tracker
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-hover font-medium text-ink"
                  : "text-ink2 hover:bg-hover/60 hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-hover"
        >
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-ink text-xs font-semibold text-white">
            {initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-ink">
              {name}
            </span>
            <span className="block truncate text-[11px] text-ink3">{email}</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
