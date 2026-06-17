import { redirect } from "next/navigation";
import { getUser, hasTracker } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) redirect("/login");

  // New users without a tracker go through the template chooser first.
  if (!(await hasTracker())) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar email={user.email ?? "you@example.com"} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
