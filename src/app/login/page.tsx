import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your job tracker."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-ink hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirect} initialError={error} />
    </AuthShell>
  );
}
