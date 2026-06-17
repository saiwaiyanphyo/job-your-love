import { requireUser } from "@/lib/data";
import { TemplateChooser } from "./TemplateChooser";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
            Choose a tracker template
          </h1>
          <p className="mt-2 text-[15px] text-ink2">
            Pick a starting point. You can customize everything later.
          </p>
        </div>
        <TemplateChooser />
      </div>
    </main>
  );
}
