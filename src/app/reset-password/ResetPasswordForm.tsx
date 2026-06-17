"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-hover";

export function ResetPasswordForm() {
  const [state, action] = useActionState<AuthState, FormData>(
    updatePassword,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink2">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={inputClass}
          placeholder="At least 6 characters"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm" className="text-sm font-medium text-ink2">
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={inputClass}
          placeholder="Re-enter your password"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Saving…">Update password</SubmitButton>
    </form>
  );
}
