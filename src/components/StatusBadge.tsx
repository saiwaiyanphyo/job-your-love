import { statusMeta, withAlpha, type StatusId } from "@/lib/types";

export function StatusBadge({
  status,
  size = "sm",
}: {
  status?: StatusId | string | null;
  size?: "sm" | "md";
}) {
  if (!status) {
    return <span className="text-ink3">—</span>;
  }
  const m = statusMeta(status);
  return (
    <span
      style={{ color: m.color, backgroundColor: withAlpha(m.color, 0.12) }}
      className={`inline-flex items-center whitespace-nowrap rounded-full font-medium ${
        size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]"
      }`}
    >
      {m.label}
    </span>
  );
}
