export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 md:mb-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-ink md:text-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-ink2 md:text-sm">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
