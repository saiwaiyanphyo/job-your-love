---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---

<!-- slide 1 -->
# Who's my person?
<!-- 20s -->

A job seeker sending out dozens of applications — me — losing track of who I
applied to, what stage each one is at, and which ones ghosted me.

---

<!-- slide 2 -->
# Their problem

Spreadsheets get messy fast, and shared trackers leak everyone's data.
I needed a **private, per-user** tracker — my applications, only mine.

---

<!-- slide 3 -->
# What I built

**Job Your Love** — a spreadsheet-style application tracker.

- Excel-like grid: rows = applications, custom columns, inline edits
- Dashboard stats: Total · Interviews · Offers · Rejections · response rate
- Sign-in + onboarding templates

---

<!-- slide 4 -->
# How I built it
- MCP: Supabase server (read-only) — inspect live tables & RLS policies
- Skill: `supabase-rls-check` — audit Row Level Security on user tables
- Agent: `code-reviewer` — read-only security/correctness review

Next.js · TypeScript · Supabase (Postgres + RLS) · Cloudflare Workers

---

<!-- slide 5 -->
# Why it matters

It's real and private: Row Level Security means one user can never see
another's data. The `code-reviewer` agent proved its worth — it caught an
**open-redirect** in the login flow before it shipped.

---

<!-- slide 6 -->
# Done checklist
- [x] repo public
- [x] MCP + skill + agent used
- [x] report.md in team repo
