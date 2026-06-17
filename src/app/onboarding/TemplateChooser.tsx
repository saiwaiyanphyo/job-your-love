"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Briefcase, GraduationCap, Sparkles, Check, type LucideIcon } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { createTrackerFromTemplate } from "@/app/dashboard/actions";

const ICONS: Record<string, LucideIcon> = {
  "job-search": Briefcase,
  internship: GraduationCap,
  custom: Sparkles,
};

function StartButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Setting up…" : label}
    </button>
  );
}

export function TemplateChooser() {
  const [selected, setSelected] = useState(TEMPLATES[0].key);
  const selectedName = TEMPLATES.find((t) => t.key === selected)?.name ?? "";

  return (
    <form action={createTrackerFromTemplate} className="mt-12">
      <input type="hidden" name="template" value={selected} />

      <div className="grid gap-4 md:grid-cols-3">
        {TEMPLATES.map((t) => {
          const active = selected === t.key;
          const Icon = ICONS[t.key];
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelected(t.key)}
              className={`rounded-xl border bg-white p-6 text-left transition ${
                active
                  ? "border-ink ring-1 ring-ink"
                  : "border-line hover:border-line2"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-hover text-ink">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{t.name}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">
                {t.description}
              </p>
              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13px] text-ink"
                  >
                    <span className="grid h-4 w-4 flex-none place-items-center rounded-full bg-status-accepted/15 text-status-accepted">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <StartButton label={`Start with ${selectedName}`} />
      </div>
    </form>
  );
}
