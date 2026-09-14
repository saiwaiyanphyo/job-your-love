-- Trackers and job entries.
-- Already applied to the production D1 database on 2026-08-17; kept here so
-- the schema lives in git and `wrangler d1 migrations apply` stays in sync.
-- user_id is the Supabase Auth user id (auth stays on Supabase).

CREATE TABLE trackers (
  id          text    primary key,
  user_id     text    not null,
  name        text    not null default 'Untitled Tracker',
  columns     text    not null default '[]',
  created_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE job_entries (
  id          text    primary key,
  tracker_id  text    not null references trackers (id) on delete cascade,
  user_id     text    not null,
  data        text    not null default '{}',
  "position"  integer not null default 0,
  created_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX trackers_user_id_idx    on trackers (user_id);
CREATE INDEX job_entries_tracker_idx on job_entries (tracker_id);
CREATE INDEX job_entries_user_id_idx on job_entries (user_id);
