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
      className="h-[50px] w-full rounded-xl bg-ink text-[15px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60 md:h-auto md:w-auto md:rounded-lg md:px-6 md:py-3 md:text-sm md:font-medium"
    >
      {pending ? "Setting up…" : label}
    </button>
  );
}

export function TemplateChooser() {
  const [selected, setSelected] = useState(TEMPLATES[0].key);
  const selectedName = TEMPLATES.find((t) => t.key === selected)?.name ?? "";

  return (
    <form action={createTrackerFromTemplate} className="mt-7 md:mt-12">
      <input type="hidden" name="template" value={selected} />

      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {TEMPLATES.map((t) => {
          const active = selected === t.key;
          const Icon = ICONS[t.key];
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelected(t.key)}
              aria-pressed={active}
              className={`rounded-xl border bg-white p-[18px] text-left transition md:p-6 ${
                active
                  ? "border-ink md:ring-1 md:ring-ink"
                  : "border-line hover:border-line2"
              }`}
            >
              <div className="flex items-center gap-3 md:block">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-hover text-ink md:rounded-lg">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="text-[17px] font-semibold text-ink md:mt-4 md:text-lg">
                  {t.name}
                </h3>
                {active && (
                  <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-ink text-white md:hidden">
                    <Check className="h-[13px] w-[13px]" strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink2 md:mt-1.5">
                {t.description}
              </p>
              <ul className="mt-3 space-y-[7px] md:mt-4 md:space-y-2">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13px] text-ink2 md:text-ink"
                  >
                    <span className="grid h-4 w-4 flex-none place-items-center rounded-full text-ink3 md:bg-status-accepted/15 md:text-status-accepted">
                      <Check className="h-3.5 w-3.5 md:h-2.5 md:w-2.5" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Sticky footer on mobile so the CTA is always reachable */}
      <div className="sticky bottom-0 -mx-5 mt-7 border-t border-line bg-white px-5 pb-7 pt-4 md:static md:mx-0 md:mt-10 md:flex md:flex-col md:items-center md:border-0 md:bg-transparent md:p-0">
        <StartButton label={`Start with ${selectedName}`} />
      </div>
    </form>
  );
}
