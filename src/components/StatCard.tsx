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
    <div className="rounded-xl border border-line bg-white p-3.5 md:p-5">
      <p
        className="text-[10px] font-medium uppercase text-ink3 md:text-[11px]"
        style={{ letterSpacing: 0.5 }}
      >
        {label}
      </p>
      <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-tight text-ink md:mt-2 md:text-[32px]">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-[11px] text-ink2 md:mt-2 md:text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}
