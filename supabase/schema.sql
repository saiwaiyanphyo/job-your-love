-- =============================================================================
-- Job Application Tracker — database schema + Row Level Security
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to run more than once.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- A "tracker" is one spreadsheet belonging to a user.
-- `columns` holds the column configuration as JSONB, e.g.
-- [
--   { "id": "company",      "name": "Company",      "type": "text" },
--   { "id": "status",       "name": "Status",       "type": "status",
--     "options": ["Saved","Applied","Interviewing","Offer","Rejected"] },
--   { "id": "date_applied", "name": "Date Applied", "type": "date" },
--   { "id": "link",         "name": "Link",         "type": "url" }
-- ]
create table if not exists public.trackers (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  name        text        not null default 'Untitled Tracker',
  columns     jsonb       not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- A "job_entry" is one row in a tracker.
-- `data` maps column id -> cell value, e.g.
--   { "company": "Acme", "status": "Applied", "date_applied": "2026-06-01" }
create table if not exists public.job_entries (
  id          uuid        primary key default gen_random_uuid(),
  tracker_id  uuid        not null references public.trackers (id) on delete cascade,
  user_id     uuid        not null references auth.users (id) on delete cascade,
  data        jsonb       not null default '{}'::jsonb,
  position    integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Helpful indexes
create index if not exists trackers_user_id_idx     on public.trackers (user_id);
create index if not exists job_entries_tracker_idx  on public.job_entries (tracker_id);
create index if not exists job_entries_user_id_idx  on public.job_entries (user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trackers_set_updated_at on public.trackers;
create trigger trackers_set_updated_at
  before update on public.trackers
  for each row execute function public.set_updated_at();

drop trigger if exists job_entries_set_updated_at on public.job_entries;
create trigger job_entries_set_updated_at
  before update on public.job_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.trackers    enable row level security;
alter table public.job_entries enable row level security;

-- trackers: a user may only see/modify their own trackers --------------------
drop policy if exists "trackers_select_own" on public.trackers;
create policy "trackers_select_own"
  on public.trackers for select
  using (auth.uid() = user_id);

drop policy if exists "trackers_insert_own" on public.trackers;
create policy "trackers_insert_own"
  on public.trackers for insert
  with check (auth.uid() = user_id);

drop policy if exists "trackers_update_own" on public.trackers;
create policy "trackers_update_own"
  on public.trackers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "trackers_delete_own" on public.trackers;
create policy "trackers_delete_own"
  on public.trackers for delete
  using (auth.uid() = user_id);

-- job_entries: a user may only see/modify their own rows ---------------------
drop policy if exists "job_entries_select_own" on public.job_entries;
create policy "job_entries_select_own"
  on public.job_entries for select
  using (auth.uid() = user_id);

drop policy if exists "job_entries_insert_own" on public.job_entries;
create policy "job_entries_insert_own"
  on public.job_entries for insert
  with check (
    auth.uid() = user_id
    -- the entry must belong to a tracker the user owns
    and exists (
      select 1 from public.trackers t
      where t.id = tracker_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "job_entries_update_own" on public.job_entries;
create policy "job_entries_update_own"
  on public.job_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "job_entries_delete_own" on public.job_entries;
create policy "job_entries_delete_own"
  on public.job_entries for delete
  using (auth.uid() = user_id);
