"use client";

import { useActionState } from "react";
import { sendPasswordReset, type AuthState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-hover";

export function ForgotPasswordForm() {
  const [state, action] = useActionState<AuthState, FormData>(
    sendPasswordReset,
    {}
  );

  if (state.message) {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-5 text-center text-sm text-green-800">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Sending…">Send reset link</SubmitButton>
    </form>
  );
}
