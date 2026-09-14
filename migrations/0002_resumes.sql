-- Resumes for the CV builder. `data` holds the whole resume as JSON text —
-- see src/lib/resume/types.ts for the shape.

CREATE TABLE IF NOT EXISTS resumes (
  id          text    primary key,
  user_id     text    not null,
  title       text    not null default 'Untitled Resume',
  data        text    not null default '{}',
  created_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  text    not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx on resumes (user_id);
