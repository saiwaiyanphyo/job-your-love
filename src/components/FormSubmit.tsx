"use client";

import { useFormStatus } from "react-dom";

const DEFAULT_SIZE = "rounded-lg px-4 py-2 text-[13px] font-medium";

export function FormSubmit({
  label,
  className = DEFAULT_SIZE,
}: {
  label: string;
  /** Size/shape classes; replaces the default so Tailwind utilities don't clash. */
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-ink text-white transition hover:opacity-90 disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
