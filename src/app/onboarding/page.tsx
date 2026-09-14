import { requireUser } from "@/lib/data";
import { TemplateChooser } from "./TemplateChooser";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto max-w-5xl px-5 pt-14 md:px-6 md:py-20">
        <div className="md:text-center">
          <h1 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[28px]">
            Choose a tracker template
          </h1>
          <p className="mt-2 text-sm text-ink2 md:text-[15px]">
            Pick a starting point. You can customize everything later.
          </p>
        </div>
        <TemplateChooser />
      </div>
    </main>
  );
}
