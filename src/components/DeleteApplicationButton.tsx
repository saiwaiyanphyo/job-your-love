"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteApplication } from "@/app/dashboard/actions";

export function DeleteApplicationButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this application? This cannot be undone.")) return;
        startTransition(async () => {
          await deleteApplication(id);
          router.push("/dashboard/applications");
        });
      }}
      className="rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-status-rejected hover:bg-hover disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
