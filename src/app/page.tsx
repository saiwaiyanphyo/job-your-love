import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    glyph: "✓",
    title: "Track Everything",
    body: "One central place for all your applications. From wishlist to offer, keep every opportunity organized and accessible.",
  },
  {
    glyph: "🔔",
    title: "Stay Organized",
    body: "Status tracking, reminders, and notes all in one place. Never lose track of where you stand with any application.",
  },
  {
    glyph: "↗",
    title: "Smart Analytics",
    body: "Get insights into your job search pipeline. See what's working, where you're stuck, and how to improve your conversion rate.",
  },
  {
    glyph: "◇",
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
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-sm font-bold text-white">
            J
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            Job Tracker
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-ink2 hover:text-ink"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-12 pt-12 lg:grid-cols-2 lg:pt-20">
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
          <div className="mt-8 flex items-center gap-5">
            <Link
              href="/signup"
              className="rounded-lg bg-ink px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              Get Started — It&apos;s Free
            </Link>
            <span className="text-sm text-ink3">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-ink hover:underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>

        {/* Stacked card mockup */}
        <div className="relative hidden h-72 lg:block">
          <div className="absolute right-8 top-0 h-56 w-72 rotate-3 rounded-xl border border-line bg-white shadow-sm" />
          <div className="absolute right-16 top-6 h-56 w-72 -rotate-2 rounded-xl border border-line bg-white shadow-md" />
          <div className="absolute right-12 top-3 h-56 w-72 rounded-xl border border-line bg-white p-5 shadow-lg">
            <div className="h-3 w-24 rounded bg-hover" />
            <div className="mt-5 space-y-3">
              {[
                ["#3B82F6", "w-40"],
                ["#F97316", "w-32"],
                ["#22C55E", "w-36"],
                ["#EF4444", "w-28"],
              ].map(([c, w], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c }}
                  />
                  <span className={`h-2.5 rounded bg-hover ${w}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-line bg-white p-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-base text-white">
                {f.glyph}
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-ink">
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
