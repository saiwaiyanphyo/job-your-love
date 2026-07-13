"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createApplication,
  importApplicationFromEmail,
  type EmailImportState,
} from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/ApplicationForm";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink3 focus:border-ink";

function ExtractButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-60"
    >
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
    <div className="space-y-7">
      <form action={action} className="rounded-xl border border-line bg-white p-5">
        <div className="space-y-1.5">
          <label
            htmlFor="emailText"
            className="text-xs font-medium text-ink2"
          >
            Application confirmation email
          </label>
          <textarea
            id="emailText"
            name="emailText"
            required
            rows={11}
            defaultValue={state.emailText}
            placeholder="Paste the email you received after applying. The AI will extract company, role, dates, contact details, and notes."
            className={`${inputCls} resize-y`}
          />
        </div>

        {state.error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <ExtractButton />
        </div>
      </form>

      {state.extracted && (
        <section className="rounded-xl border border-line bg-white p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-ink">
              Review Extracted Details
            </h2>
            <p className="mt-1 text-sm text-ink2">
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
