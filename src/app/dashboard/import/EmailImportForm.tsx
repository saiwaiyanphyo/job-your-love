"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";
import {
  createApplication,
  importApplicationFromEmail,
  type EmailImportState,
} from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/ApplicationForm";

const inputCls =
  "w-full rounded-[10px] border border-line bg-page px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-ink md:rounded-lg md:bg-white md:text-sm";

function ExtractButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 md:h-auto md:w-auto md:rounded-lg md:px-4 md:py-2 md:text-[13px] md:font-medium"
    >
      <Sparkles className="h-4 w-4 md:hidden" />
      {pending ? "Extracting..." : "Extract Details"}
    </button>
  );
}

export function EmailImportForm() {
  const [state, action] = useActionState<EmailImportState, FormData>(
    importApplicationFromEmail,
    {}
  );

  return (
    <div className="space-y-5 md:space-y-7">
      <form
        action={action}
        className="rounded-xl border border-line bg-white p-4 md:p-5"
      >
        <div className="space-y-2 md:space-y-1.5">
          <label
            htmlFor="emailText"
            className="block text-[13px] font-semibold text-ink md:text-xs md:font-medium md:text-ink2"
          >
            Application confirmation email
          </label>
          <p className="text-xs text-ink2 md:hidden">
            Paste the email you received after applying. The AI will extract
            company, role, dates, contact details, and notes.
          </p>
          <textarea
            id="emailText"
            name="emailText"
            required
            rows={11}
            defaultValue={state.emailText}
            placeholder="Paste the email you received after applying. The AI will extract company, role, dates, contact details, and notes."
            className={`${inputCls} h-[180px] resize-y md:h-auto`}
          />
        </div>

        {state.error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div className="mt-3 flex items-center justify-end gap-2 md:mt-4">
          <ExtractButton />
        </div>
      </form>

      {state.extracted && (
        <section className="md:rounded-xl md:border md:border-line md:bg-white md:p-5">
          <div className="mb-4 md:mb-5">
            <h2 className="text-base font-semibold text-ink">
              Review Extracted Details
            </h2>
            <p className="mt-1 text-[13px] text-ink2 md:text-sm">
              Check the fields before saving. Anything the AI missed can be
              edited here.
            </p>
          </div>
          <ApplicationForm
            action={createApplication}
            initial={state.extracted}
            submitLabel="Save Application"
          />
        </section>
      )}
    </div>
  );
}
