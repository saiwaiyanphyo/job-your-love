import {
  bulletLines,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeData,
} from "@/lib/resume/types";

// A clean, single-column resume. Pure (no hooks) so it can be used both in the
// client editor's live preview and in the server-rendered print page.
// Colors are kept print-safe (dark text on white).

function Bullets({ text }: { text?: string }) {
  const lines = bulletLines(text);
  if (lines.length === 0) return null;
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[12.5px] leading-snug text-neutral-700 marker:text-neutral-400">
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

function DateRange({ start, end }: { start?: string; end?: string }) {
  const label = [start, end].filter(Boolean).join(" – ");
  if (!label) return null;
  return <span className="text-[11.5px] font-medium text-neutral-500">{label}</span>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 first:mt-0">
      <h2 className="mb-2 border-b border-neutral-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  const hasHead = item.role || item.company;
  return (
    <div className="mt-3 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13.5px] font-semibold text-neutral-900">
          {item.role || item.company}
          {item.role && item.company && (
            <span className="font-normal text-neutral-600"> · {item.company}</span>
          )}
        </p>
        <DateRange start={item.start} end={item.end} />
      </div>
      {(item.location || (!hasHead && item.company)) && (
        <p className="text-[11.5px] text-neutral-500">{item.location}</p>
      )}
      <Bullets text={item.description} />
    </div>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <div className="mt-3 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13.5px] font-semibold text-neutral-900">
          {item.school}
          {item.degree && (
            <span className="font-normal text-neutral-600"> · {item.degree}</span>
          )}
        </p>
        <DateRange start={item.start} end={item.end} />
      </div>
      {item.location && (
        <p className="text-[11.5px] text-neutral-500">{item.location}</p>
      )}
      <Bullets text={item.description} />
    </div>
  );
}

function ProjectEntry({ item }: { item: ProjectItem }) {
  return (
    <div className="mt-3 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13.5px] font-semibold text-neutral-900">{item.name}</p>
        {item.link && (
          <a
            href={item.link}
            className="truncate text-[11.5px] font-medium text-neutral-500 underline-offset-2 hover:underline"
          >
            {item.link.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>
      <Bullets text={item.description} />
    </div>
  );
}

export function ResumeDocument({ data }: { data: ResumeData }) {
  const { basics } = data;
  const contact = [basics.email, basics.phone, basics.location].filter(Boolean);
  const skillGroups = bulletLines(data.skills);

  const isEmpty =
    !basics.name &&
    !basics.headline &&
    !basics.summary &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.projects.length === 0 &&
    skillGroups.length === 0;

  return (
    <div className="resume-doc bg-white px-10 py-9 text-neutral-800 [font-feature-settings:'kern']">
      {/* Header */}
      <header className="border-b border-neutral-300 pb-3">
        <h1 className="text-[24px] font-bold tracking-tight text-neutral-900">
          {basics.name || "Your Name"}
        </h1>
        {basics.headline && (
          <p className="mt-0.5 text-[13.5px] font-medium text-neutral-600">
            {basics.headline}
          </p>
        )}
        {(contact.length > 0 || basics.website) && (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-neutral-500">
            {contact.map((c, i) => (
              <span key={i} className="after:ml-2 after:text-neutral-300 after:content-['·'] last:after:content-['']">
                {c}
              </span>
            ))}
            {basics.website && (
              <a
                href={basics.website}
                className="font-medium text-neutral-600 underline-offset-2 hover:underline"
              >
                {basics.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </p>
        )}
      </header>

      {isEmpty && (
        <p className="mt-6 text-center text-[12.5px] text-neutral-400">
          Fill in the fields on the left to see your resume here.
        </p>
      )}

      {basics.summary && (
        <Section title="Summary">
          <p className="text-[12.5px] leading-relaxed text-neutral-700">
            {basics.summary}
          </p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((item) => (
            <ExperienceEntry key={item.id} item={item} />
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((item) => (
            <EducationEntry key={item.id} item={item} />
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((item) => (
            <ProjectEntry key={item.id} item={item} />
          ))}
        </Section>
      )}

      {skillGroups.length > 0 && (
        <Section title="Skills">
          <ul className="space-y-0.5 text-[12.5px] leading-snug text-neutral-700">
            {skillGroups.map((line, i) => {
              const [label, ...rest] = line.split(":");
              const body = rest.join(":").trim();
              return (
                <li key={i}>
                  {body ? (
                    <>
                      <span className="font-semibold text-neutral-900">{label.trim()}:</span>{" "}
                      {body}
                    </>
                  ) : (
                    line
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </div>
  );
}
