"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { FormSubmit } from "@/components/FormSubmit";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink3 focus:border-ink";

export function ChangePassword() {
  const [state, action] = useActionState<AuthState, FormData>(
    updatePassword,
    {}
  );

  return (
    <form action={action} className="space-y-3">
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="New password"
        className={inputCls}
      />
      <input
        name="confirm"
        type="password"
        required
        minLength={6}
        placeholder="Confirm new password"
        className={inputCls}
      />
      {state.error && (
        <p className="text-[13px] text-status-rejected">{state.error}</p>
      )}
      <FormSubmit label="Change Password" />
    </form>
  );
}
