---
name: supabase-rls-check
description: Review the Supabase schema and policies for this project to confirm every user-owned table has Row Level Security enabled and the policies scope rows to the current user. Use when adding or changing tables, policies, or queries that touch user data.
---

# Supabase RLS check

This project stores each user's data in Supabase Postgres and relies on **Row Level Security**
so a user only ever reads/writes their own rows. Use this skill whenever the schema or a
data-access path changes.

## Steps

1. Read the schema SQL in `supabase/` and note every table that holds user data
   (e.g. `job_entries`).
2. For each such table confirm:
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` is present.
   - There are `SELECT` / `INSERT` / `UPDATE` / `DELETE` policies that scope rows with
     `auth.uid() = user_id` (or the equivalent owner column).
3. Cross-check the data layer in `src/lib/data.ts` and the server actions
   (`src/app/**/actions.ts`) — every query must run as the authenticated user and must not
   bypass RLS with a service-role key on the client.
4. Use the Supabase MCP server (`.mcp.json`) in read-only mode to list the live policies and
   compare them against the SQL in the repo.

## Output

Report any table missing RLS, any policy that does not filter by the owner, and any query path
that could leak another user's rows. Suggest the exact SQL or code fix.
