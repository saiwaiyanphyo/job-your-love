import Link from "next/link";
import { redirect } from "next/navigation";
import { Layers, Bell, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    Icon: Layers,
    title: "Track Everything",
    body: "One central place for all your applications. From wishlist to offer, keep every opportunity organized and accessible.",
  },
  {
    Icon: Bell,
    title: "Stay Organized",
    body: "Status tracking, reminders, and notes all in one place. Never lose track of where you stand with any application.",
  },
  {
    Icon: TrendingUp,
    title: "Smart Analytics",
    body: "Get insights into your job search pipeline. See what's working, where you're stuck, and how to improve your conversion rate.",
  },
  {
    Icon: Clock,
    title: "Never Miss a Beat",
    body: "Follow-up reminders and a clear timeline keep you on top of every deadline, interview, and next step.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-page">
      {/* Centered brand */}
      <header className="flex justify-center px-6 py-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-sm font-bold text-white">
            J
          </span>
          <span className="text-[22px] font-semibold tracking-tight text-ink">
            Job Tracker
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-8 pt-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl">
            Track every application,
            <br />
            land your dream role
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink2">
            The modern way to manage your job search. Stay organized, never miss
            a follow-up, and move your career forward with confidence.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              Get Started — It&apos;s Free
            </Link>
            <p className="mt-4 text-sm text-ink3">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-ink hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Abstract overlapping-shapes visual */}
        <div className="relative mx-auto hidden h-80 w-full max-w-[576px] lg:block">
          <div
            className="absolute rounded-lg bg-sidebar"
            style={{ width: 280, height: 280, left: 40, top: 20 }}
          />
          <div
            className="absolute rounded-md bg-hover"
            style={{ width: 180, height: 180, left: 200, top: 100 }}
          />
          <div
            className="absolute rounded-sm bg-ink"
            style={{ width: 80, height: 80, left: 100, top: 220 }}
          />
          <div
            className="absolute rounded-full bg-line2"
            style={{ width: 12, height: 12, left: 310, top: 40 }}
          />
          <div
            className="absolute rounded-sm bg-line"
            style={{ width: 120, height: 6, left: 40, top: 300 }}
          />
        </div>
      </section>

      {/* Features — 2×2 grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-md bg-sidebar p-4">
              <span className="grid h-9 w-9 place-items-center rounded-sm bg-ink text-white">
                <f.Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink2">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
