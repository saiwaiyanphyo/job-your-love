import "server-only";
import { STATUSES, type ApplicationData, type StatusId } from "@/lib/types";

const MAX_EMAIL_CHARS = 12000;
const STATUS_IDS = new Set<StatusId>(STATUSES.map((s) => s.id));

type AiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function chatCompletionsUrl() {
  const raw = process.env.AI_PROXY_URL ?? process.env.AI_PROXY_BASE_URL;
  if (!raw) {
    throw new Error("AI proxy is not configured.");
  }

  const trimmed = raw.replace(/\/+$/, "");
  if (trimmed.endsWith("/chat/completions")) return trimmed;
  if (trimmed.endsWith("/v1")) return `${trimmed}/chat/completions`;
  return `${trimmed}/v1/chat/completions`;
}

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 2000) : undefined;
}

function cleanDate(value: unknown): string | undefined {
  const str = cleanString(value);
  if (!str) return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : undefined;
}

function cleanStatus(value: unknown): StatusId {
  return typeof value === "string" && STATUS_IDS.has(value as StatusId)
    ? (value as StatusId)
    : "applied";
}

function extractJsonObject(content: string): unknown {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? content;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI did not return JSON.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function sanitizeApplication(value: unknown): ApplicationData {
  if (!value || typeof value !== "object") {
    throw new Error("AI returned an invalid application.");
  }

  const data = value as Record<string, unknown>;
  return {
    company: cleanString(data.company),
    position: cleanString(data.position),
    location: cleanString(data.location),
    salary: cleanString(data.salary),
    status: cleanStatus(data.status),
    date: cleanDate(data.date),
    url: cleanString(data.url),
    source: cleanString(data.source),
    description: cleanString(data.description),
    follow_up: cleanDate(data.follow_up),
    contact_name: cleanString(data.contact_name),
    contact_email: cleanString(data.contact_email),
    contact_role: cleanString(data.contact_role),
    notes: cleanString(data.notes),
  };
}

export async function extractApplicationFromEmail(
  emailText: string
): Promise<ApplicationData> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI API key is not configured.");
  }

  const trimmed = emailText.trim();
  if (trimmed.length < 20) {
    throw new Error("Paste a little more of the email before extracting.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(chatCompletionsUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: [
            "Extract job application details from an email the user received after applying for a job.",
            "Return only one valid JSON object. Do not include markdown.",
            `Use today's date (${today}) only when the email clearly confirms an application but no application date is present.`,
            "Use null for unknown fields.",
            "Allowed status values: wishlist, applied, assessment, interviewing, final, offer, accepted, rejected.",
            "Prefer status 'applied' for application confirmations and acknowledgements.",
            "JSON keys: company, position, location, salary, status, date, url, source, description, follow_up, contact_name, contact_email, contact_role, notes.",
          ].join(" "),
        },
        {
          role: "user",
          content: trimmed.slice(0, MAX_EMAIL_CHARS),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI extraction failed (${res.status}).`);
  }

  const json = (await res.json()) as AiChatResponse;
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI did not return any extracted details.");
  }

  return sanitizeApplication(extractJsonObject(content));
}
