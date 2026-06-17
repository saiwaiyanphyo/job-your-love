export function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <p
        className="text-[11px] font-medium uppercase text-ink3"
        style={{ letterSpacing: 0.5 }}
      >
        {label}
      </p>
      <p className="mt-2 text-[32px] font-semibold leading-none tracking-tight text-ink">
        {value}
      </p>
      {subtitle && <p className="mt-2 text-xs text-ink2">{subtitle}</p>}
    </div>
  );
}
