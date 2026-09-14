"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { FormSubmit } from "@/components/FormSubmit";

const inputCls =
  "w-full rounded-[10px] border border-line bg-page py-2.5 pl-3 pr-10 text-[13px] text-ink outline-none placeholder:text-ink3 focus:border-ink md:rounded-lg md:bg-white md:text-sm";

function PasswordField({
  name,
  label,
  visible,
  onToggle,
}: {
  name: string;
  label: string;
  visible: boolean;
  onToggle: () => void;
}) {
  const Icon = visible ? EyeOff : Eye;
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-xs font-medium text-ink2 md:hidden">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={6}
          placeholder={label}
          className={inputCls}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink3 hover:text-ink"
        >
          <Icon className="h-[15px] w-[15px]" />
        </button>
      </div>
    </div>
  );
}

export function ChangePassword() {
  const [state, action] = useActionState<AuthState, FormData>(
    updatePassword,
    {}
  );
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);

  return (
    <form action={action} className="space-y-3">
      <PasswordField
        name="password"
        label="New password"
        visible={visible}
        onToggle={toggle}
      />
      <PasswordField
        name="confirm"
        label="Confirm new password"
        visible={visible}
        onToggle={toggle}
      />
      {state.error && (
        <p className="text-[13px] text-status-rejected">{state.error}</p>
      )}
      <FormSubmit
        label="Change Password"
        className="h-11 w-full rounded-xl text-sm font-semibold md:h-auto md:w-auto md:rounded-lg md:px-4 md:py-2 md:text-[13px] md:font-medium"
      />
    </form>
  );
}
