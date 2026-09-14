"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  ListIcon,
  CalendarIcon,
  GiftIcon,
  XCircleIcon,
  SearchIcon,
} from "./icons";

const TABS = [
  { href: "/dashboard", label: "Dashboard", Icon: GridIcon, exact: true },
  { href: "/dashboard/applications", label: "Applications", Icon: ListIcon },
  { href: "/dashboard/interviews", label: "Interviews", Icon: CalendarIcon },
  { href: "/dashboard/offers", label: "Offers", Icon: GiftIcon },
  { href: "/dashboard/rejections", label: "Rejections", Icon: XCircleIcon },
];

// Add / import live under Applications, so highlight that tab there too.
const APPLICATION_ROUTES = ["/dashboard/new", "/dashboard/import"];

export function MobileTopBar({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-xs font-bold text-white">
          J
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          Job Your Love
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/applications"
          aria-label="Search applications"
          className="text-ink2 hover:text-ink"
        >
          <SearchIcon className="h-5 w-5" />
        </Link>
        <Link
          href="/dashboard/profile"
          aria-label="Account settings"
          className="grid h-7 w-7 place-items-center rounded-full bg-hover text-xs font-semibold text-ink"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white px-2 pt-2 pb-[max(18px,env(safe-area-inset-bottom))] md:hidden">
      {TABS.map(({ href, label, Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href ||
            pathname.startsWith(href + "/") ||
            (href === "/dashboard/applications" &&
              APPLICATION_ROUTES.some((r) => pathname.startsWith(r)));
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-1.5 text-[10px] font-medium ${
              active ? "text-ink" : "text-ink3"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
