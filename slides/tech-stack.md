---
marp: true
paginate: true
---

# Job Your Love

Tech stack, AI workflow, and validation path for Chapter 5.

Live app: https://job-your-love.megiapps.workers.dev/

---

# Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS for the app UI
- Supabase Auth + Postgres + Row Level Security
- Cloudflare Workers via OpenNext
- GitHub repo: https://github.com/saiwaiyanphyo/job-your-love

---

# Agents

`code-reviewer`

- File: `.claude/agents/code-reviewer.md`
- Trigger: after editing a feature, server action, auth flow, or Supabase data path
- Job: review the diff for security, correctness, app conventions, and Cloudflare compatibility
- Output: findings grouped as Must fix, Should fix, Nice to have

---

# Skills

`supabase-rls-check`

- File: `.claude/skills/supabase-rls-check/SKILL.md`
- Trigger: when schema, policies, or user-data queries change
- Job: confirm every user-owned table has RLS enabled and owner-scoped policies
- Main tables checked: `trackers`, `job_entries`

---

# Methodology

1. Keep the live Ch-4 project working.
2. Use the RLS skill before trusting user-data changes.
3. Use the code-reviewer agent after edits.
4. Keep assignment evidence in the repo.
5. Get one real-user feedback pass and record the result.

---

# AI Tools Used

- Codex: repo inspection, artifact drafting, verification commands
- `supabase-rls-check` skill: RLS checklist for user-owned tables
- `code-reviewer` subagent: review pass over Chapter 5 artifacts
- Supabase MCP pattern: read-only comparison of live policies against repo SQL once the real project ref is set

---

# Commands

```bash
npm run build
git status --short --branch
rg --files .claude slides feedback docs
```

```bash
# Manual app check
open https://job-your-love.megiapps.workers.dev/
```

---

# User Feedback

Feedback artifact:

`feedback/interview.md`

Result:

- The tracker is understandable from the dashboard.
- The user wanted faster visibility into next follow-up dates.
- Response: follow-up dates are already stored; a future improvement is a dedicated reminder view.
