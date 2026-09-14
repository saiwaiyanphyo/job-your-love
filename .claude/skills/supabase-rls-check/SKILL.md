---
name: supabase-rls-check
description: Audit this project's data-access paths to confirm every query on user-owned D1 tables is scoped to the signed-in user (D1 has no Row Level Security). Use when adding or changing tables, migrations, or queries that touch user data.
---

# User data isolation check (D1)

Sign-in uses **Supabase Auth**, but all app data (trackers, job entries, resumes) lives in
**Cloudflare D1** (`DB` binding in `wrangler.jsonc`). D1 has **no Row Level Security**, so the
only thing keeping one user out of another user's rows is the application code. The
skill name is historical — it no longer checks Supabase policies.

## Steps

1. Read the schema in `migrations/*.sql` and list every table that holds user data
   (currently `trackers`, `job_entries`, `resumes`). Each must have a `user_id` column
   holding the Supabase Auth user id.
2. Find every query on those tables — `src/lib/data.ts`, `src/lib/resume/data.ts`, and the
   server actions in `src/app/**/actions.ts` (search for `prepare(`).
3. For each query confirm:
   - The user id comes from `requireUser()` on the server, never from form data, URL params,
     or the client.
   - `SELECT`, `UPDATE`, and `DELETE` include `AND user_id = ?` bound to that id — filtering by
     `id` or `tracker_id` alone is a leak.
   - `INSERT` writes `user_id` from `requireUser()`, and any referenced parent row (e.g. the
     tracker for a new job entry) is one the user owns.
   - Values are passed with `.bind(...)`, never interpolated into the SQL string.
4. Check that anything taking an id from the client (e.g. `setActiveTracker`) verifies
   ownership before acting on it.

## Output

Report any table missing `user_id`, any query not scoped to the current user, and any path
that could read or change another user's rows. Suggest the exact code fix.
