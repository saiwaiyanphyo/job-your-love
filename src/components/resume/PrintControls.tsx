"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export function PrintControls({ backHref }: { backHref: string }) {
  // Open the print dialog automatically once the page has painted.
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="print:hidden sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-page/90 px-6 py-3 backdrop-blur">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink2 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to editor
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
      >
        <Printer className="h-4 w-4" />
        Print / Save as PDF
      </button>
    </div>
  );
}
