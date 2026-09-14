import { redirect } from "next/navigation";
import { getUser, hasTracker } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import { MobileTopBar, MobileTabBar } from "@/components/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) redirect("/login");

  // New users without a tracker go through the template chooser first.
  if (!(await hasTracker())) redirect("/onboarding");

  const email = user.email ?? "you@example.com";

  // Desktop: persistent sidebar. Mobile (< md): top bar + bottom tab bar.
  return (
    <div className="flex min-h-screen bg-page">
      <div className="sticky top-0 hidden h-screen flex-none md:block">
        <Sidebar email={email} />
      </div>
      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <MobileTopBar email={email} />
        {children}
      </div>
      <MobileTabBar />
    </div>
  );
}
