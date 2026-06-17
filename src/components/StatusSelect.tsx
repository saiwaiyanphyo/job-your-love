"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { STATUSES, statusMeta, withAlpha, type StatusId } from "@/lib/types";

const MENU_WIDTH = 184;

/**
 * A colored status pill that opens a menu to change the status. The menu is
 * portaled to <body> with fixed positioning so it floats above the table
 * instead of being clipped by the table's overflow container.
 */
export function StatusSelect({
  value,
  onSelect,
}: {
  value?: StatusId | string | null;
  onSelect: (status: StatusId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [pending, startTransition] = useTransition();
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const m = statusMeta(value);

  function place() {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      top: rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8),
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
    function onMove() {
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        disabled={pending}
        onClick={toggle}
        style={{ color: m.color, backgroundColor: withAlpha(m.color, 0.12) }}
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium hover:opacity-80"
      >
        {value ? m.label : "Set status"}
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
            {STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  startTransition(() => onSelect(s.id));
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-ink hover:bg-hover"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
