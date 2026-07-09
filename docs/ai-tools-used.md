# AI tools used

Date: 2026-07-09

- **Codex**: inspected the repo, created Chapter 5 evidence files, installed dependencies from `package-lock.json`, and ran verification commands.
- **Skill: `supabase-rls-check`**: checked `supabase/schema.sql`, `src/lib/data.ts`, and `src/app/dashboard/actions.ts` for user-owned tables, RLS policies, and authenticated Supabase query paths.
- **Subagent: `code-reviewer`**: reviewed the Chapter 5 artifact setup and reported gaps in README repo/download URL, clickable deck links, MCP project-ref documentation, and feedback detail.
- **Supabase MCP workflow**: documented as the read-only way to compare live Supabase policies with `supabase/schema.sql`. The local `.mcp.json` still needs the real Supabase project ref before live policy comparison can run.

Main project files:

- `.claude/skills/supabase-rls-check/SKILL.md`
- `.claude/agents/code-reviewer.md`
- `slides/tech-stack.md`
- `feedback/interview.md`
- `.mcp.json`
