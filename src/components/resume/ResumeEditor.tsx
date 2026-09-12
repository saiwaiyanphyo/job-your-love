"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { saveResume } from "@/app/dashboard/resumes/actions";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import {
  newItemId,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeData,
} from "@/lib/resume/types";

const labelCls = "text-[11px] font-medium text-ink2";
const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-ink3 focus:border-ink";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-ink2 hover:bg-hover hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            {addLabel ?? "Add"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ItemShell({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-lg border border-line bg-page/60 p-3">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className="absolute right-2 top-2 rounded-md p-1 text-ink3 hover:bg-hover hover:text-status-rejected"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <div className="space-y-2.5 pr-6">{children}</div>
    </div>
  );
}

export function ResumeEditor({
  id,
  initialTitle,
  initialData,
}: {
  id: string;
  initialTitle: string;
  initialData: ResumeData;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState<ResumeData>(initialData);
  const [dirty, setDirty] = useState(false);
  const [saving, startSaving] = useTransition();

  function update(next: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...next }));
    setDirty(true);
  }
  function setBasics(patch: Partial<ResumeData["basics"]>) {
    update({ basics: { ...data.basics, ...patch } });
  }

  // Generic list helpers -----------------------------------------------------
  function addExperience() {
    update({ experience: [...data.experience, { id: newItemId() }] });
  }
  function addEducation() {
    update({ education: [...data.education, { id: newItemId() }] });
  }
  function addProject() {
    update({ projects: [...data.projects, { id: newItemId() }] });
  }
  function patchExperience(itemId: string, patch: Partial<ExperienceItem>) {
    update({
      experience: data.experience.map((e) =>
        e.id === itemId ? { ...e, ...patch } : e
      ),
    });
  }
  function patchEducation(itemId: string, patch: Partial<EducationItem>) {
    update({
      education: data.education.map((e) =>
        e.id === itemId ? { ...e, ...patch } : e
      ),
    });
  }
  function patchProject(itemId: string, patch: Partial<ProjectItem>) {
    update({
      projects: data.projects.map((p) =>
        p.id === itemId ? { ...p, ...patch } : p
      ),
    });
  }

  function save(): Promise<void> {
    return new Promise((resolve) => {
      startSaving(async () => {
        await saveResume(id, title, JSON.stringify(data));
        setDirty(false);
        resolve();
      });
    });
  }

  async function downloadPdf() {
    if (dirty) await save();
    window.open(`/dashboard/resumes/${id}/print`, "_blank", "noopener");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-page/90 px-6 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/resumes"
            className="inline-flex flex-none items-center gap-1.5 text-[13px] text-ink2 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Resumes
          </Link>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            placeholder="Resume title"
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-ink outline-none hover:border-line focus:border-ink"
          />
        </div>
        <div className="flex flex-none items-center gap-2">
          <span className="text-[12px] text-ink3">
            {saving ? "Saving…" : dirty ? "Unsaved" : "Saved"}
          </span>
          <button
            type="button"
            onClick={downloadPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[13px] font-medium text-ink hover:bg-hover"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
          <button
            type="button"
            onClick={() => save()}
            disabled={saving || !dirty}
            className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Split: editor | preview */}
      <div className="grid flex-1 gap-0 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4 overflow-y-auto border-r border-line px-6 py-6">
          <SectionCard title="Basics">
            <div className="space-y-2.5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    className={inputCls}
                    value={data.basics.name ?? ""}
                    onChange={(e) => setBasics({ name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Headline">
                  <input
                    className={inputCls}
                    value={data.basics.headline ?? ""}
                    onChange={(e) => setBasics({ headline: e.target.value })}
                    placeholder="Senior Product Designer"
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputCls}
                    value={data.basics.email ?? ""}
                    onChange={(e) => setBasics({ email: e.target.value })}
                    placeholder="jane@example.com"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputCls}
                    value={data.basics.phone ?? ""}
                    onChange={(e) => setBasics({ phone: e.target.value })}
                    placeholder="+1 555 123 4567"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={data.basics.location ?? ""}
                    onChange={(e) => setBasics({ location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </Field>
                <Field label="Website / LinkedIn">
                  <input
                    className={inputCls}
                    value={data.basics.website ?? ""}
                    onChange={(e) => setBasics({ website: e.target.value })}
                    placeholder="linkedin.com/in/jane"
                  />
                </Field>
              </div>
              <Field label="Summary">
                <textarea
                  rows={3}
                  className={`${inputCls} resize-y`}
                  value={data.basics.summary ?? ""}
                  onChange={(e) => setBasics({ summary: e.target.value })}
                  placeholder="A short professional summary…"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Experience" onAdd={addExperience} addLabel="Add role">
            {data.experience.length === 0 ? (
              <p className="text-[12px] text-ink3">No roles yet.</p>
            ) : (
              <div className="space-y-3">
                {data.experience.map((item) => (
                  <ItemShell
                    key={item.id}
                    onRemove={() =>
                      update({
                        experience: data.experience.filter((e) => e.id !== item.id),
                      })
                    }
                  >
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <Field label="Role">
                        <input
                          className={inputCls}
                          value={item.role ?? ""}
                          onChange={(e) => patchExperience(item.id, { role: e.target.value })}
                          placeholder="Product Designer"
                        />
                      </Field>
                      <Field label="Company">
                        <input
                          className={inputCls}
                          value={item.company ?? ""}
                          onChange={(e) => patchExperience(item.id, { company: e.target.value })}
                          placeholder="Acme Inc."
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputCls}
                          value={item.location ?? ""}
                          onChange={(e) => patchExperience(item.id, { location: e.target.value })}
                          placeholder="Remote"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Field label="Start">
                          <input
                            className={inputCls}
                            value={item.start ?? ""}
                            onChange={(e) => patchExperience(item.id, { start: e.target.value })}
                            placeholder="Jan 2022"
                          />
                        </Field>
                        <Field label="End">
                          <input
                            className={inputCls}
                            value={item.end ?? ""}
                            onChange={(e) => patchExperience(item.id, { end: e.target.value })}
                            placeholder="Present"
                          />
                        </Field>
                      </div>
                    </div>
                    <Field label="Highlights (one bullet per line)">
                      <textarea
                        rows={3}
                        className={`${inputCls} resize-y`}
                        value={item.description ?? ""}
                        onChange={(e) => patchExperience(item.id, { description: e.target.value })}
                        placeholder={"Led redesign of…\nShipped…"}
                      />
                    </Field>
                  </ItemShell>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Education" onAdd={addEducation} addLabel="Add school">
            {data.education.length === 0 ? (
              <p className="text-[12px] text-ink3">No education yet.</p>
            ) : (
              <div className="space-y-3">
                {data.education.map((item) => (
                  <ItemShell
                    key={item.id}
                    onRemove={() =>
                      update({
                        education: data.education.filter((e) => e.id !== item.id),
                      })
                    }
                  >
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <Field label="School">
                        <input
                          className={inputCls}
                          value={item.school ?? ""}
                          onChange={(e) => patchEducation(item.id, { school: e.target.value })}
                          placeholder="Stanford University"
                        />
                      </Field>
                      <Field label="Degree">
                        <input
                          className={inputCls}
                          value={item.degree ?? ""}
                          onChange={(e) => patchEducation(item.id, { degree: e.target.value })}
                          placeholder="B.S. Computer Science"
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputCls}
                          value={item.location ?? ""}
                          onChange={(e) => patchEducation(item.id, { location: e.target.value })}
                          placeholder="Stanford, CA"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Field label="Start">
                          <input
                            className={inputCls}
                            value={item.start ?? ""}
                            onChange={(e) => patchEducation(item.id, { start: e.target.value })}
                            placeholder="2018"
                          />
                        </Field>
                        <Field label="End">
                          <input
                            className={inputCls}
                            value={item.end ?? ""}
                            onChange={(e) => patchEducation(item.id, { end: e.target.value })}
                            placeholder="2022"
                          />
                        </Field>
                      </div>
                    </div>
                    <Field label="Notes (one bullet per line)">
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-y`}
                        value={item.description ?? ""}
                        onChange={(e) => patchEducation(item.id, { description: e.target.value })}
                        placeholder={"GPA 3.9…\nRelevant coursework…"}
                      />
                    </Field>
                  </ItemShell>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Projects" onAdd={addProject} addLabel="Add project">
            {data.projects.length === 0 ? (
              <p className="text-[12px] text-ink3">No projects yet.</p>
            ) : (
              <div className="space-y-3">
                {data.projects.map((item) => (
                  <ItemShell
                    key={item.id}
                    onRemove={() =>
                      update({
                        projects: data.projects.filter((p) => p.id !== item.id),
                      })
                    }
                  >
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <Field label="Name">
                        <input
                          className={inputCls}
                          value={item.name ?? ""}
                          onChange={(e) => patchProject(item.id, { name: e.target.value })}
                          placeholder="Side project"
                        />
                      </Field>
                      <Field label="Link">
                        <input
                          className={inputCls}
                          value={item.link ?? ""}
                          onChange={(e) => patchProject(item.id, { link: e.target.value })}
                          placeholder="github.com/jane/project"
                        />
                      </Field>
                    </div>
                    <Field label="Description (one bullet per line)">
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-y`}
                        value={item.description ?? ""}
                        onChange={(e) => patchProject(item.id, { description: e.target.value })}
                        placeholder={"What it does…"}
                      />
                    </Field>
                  </ItemShell>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Skills">
            <Field label="One group per line, e.g. “Languages: TypeScript, Go”">
              <textarea
                rows={4}
                className={`${inputCls} resize-y`}
                value={data.skills ?? ""}
                onChange={(e) => update({ skills: e.target.value })}
                placeholder={"Languages: TypeScript, Python\nTools: Figma, Git"}
              />
            </Field>
          </SectionCard>

          <p className="pb-2 text-center text-[11px] text-ink3">
            Tip: use “PDF”, then choose “Save as PDF” in the print dialog.
          </p>
        </div>

        {/* Preview */}
        <div className="hidden overflow-y-auto bg-hover/40 px-6 py-6 lg:block">
          <div className="mx-auto max-w-[720px] overflow-hidden rounded-xl border border-line shadow-sm">
            <ResumeDocument data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
