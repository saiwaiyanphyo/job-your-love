"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_WIDTH = 128;

/**
 * A "⋯" actions menu (View / Delete) that portals to <body> with fixed
 * positioning so it floats above the table instead of being clipped by the
 * table's overflow container.
 */
export function RowMenu({
  viewHref,
  onDelete,
}: {
  viewHref: string;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function place() {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      top: rect.bottom + 4,
      left: Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8),
    });
  }

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!open) place();
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    const close = () => setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="rounded p-1 text-ink3 hover:bg-hover hover:text-ink"
        aria-label="Row actions"
      >
        ⋯
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: MENU_WIDTH,
            }}
            className="z-50 rounded-lg border border-line bg-white py-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={viewHref}
              className="block px-3 py-1.5 text-left text-[13px] text-ink hover:bg-hover"
            >
              View
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="block w-full px-3 py-1.5 text-left text-[13px] text-status-rejected hover:bg-hover"
            >
              Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
