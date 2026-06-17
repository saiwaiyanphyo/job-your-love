import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-[17px] font-semibold tracking-tight text-ink"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-sm font-bold text-white">
            J
          </span>
          Job Your Love
        </Link>

        <div className="rounded-xl border border-line bg-white p-7">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-ink2">{footer}</p>
        )}
      </div>
    </main>
  );
}
