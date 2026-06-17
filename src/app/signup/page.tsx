import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your job applications in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
