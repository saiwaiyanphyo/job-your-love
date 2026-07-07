# Job Your Love — Job Application Tracker

A private, spreadsheet-style job application tracker with per-user Row Level Security.

**Live app:** [job-your-love.megiapps.workers.dev](https://job-your-love.megiapps.workers.dev/)

Every user gets their own tracker: an Excel-like grid where each row is a job application, with custom columns, inline editing, and a dashboard to see how the search is going at a glance.

Built with **Next.js (App Router) + TypeScript**, **Tailwind CSS**, and **Supabase** (auth + Postgres with Row Level Security), deployed on **Cloudflare Workers**.

---

## Screenshots

_Coming soon._

---

## Features

### Authentication
- Email/password sign-up with email confirmation
- Email/password login
- Google login (OAuth)
- Password reset via email
- Logout
- Protected `/dashboard/**` routes, enforced in middleware
- Row Level Security — every user only ever reads/writes their own data

### Application tracker
- Dashboard with live stat cards (Total, Interviews, Offers, Rejections + response rate)
- Applications table with search, sort, and inline colored status changes
- Status-filtered views: Interviews, Offers, Rejections
- Add / edit / delete applications via a dedicated form
- Detail panel per application: meta, job description, timeline, contact, follow-ups
- Custom columns — text, date, status dropdown, URL, number — with rename/delete
- Account settings: change password, sign-in provider, logout
- All data persisted per user in Supabase (`job_entries.data` JSONB)

### Onboarding & pipeline
- Onboarding templates — Job Search, Internship, Custom Tracker — offered on first sign-in
- Status pipeline with colored badges: Wishlist · Applied · OA/Assessment · Interviewing · Final Round · Offer · Accepted · Rejected

### Design
- Inter font with a calm monochrome palette and status accent colors, built from a Pencil design

---

## Project structure

```
.
├── open-next.config.ts          # OpenNext (Cloudflare) adapter config
├── wrangler.jsonc               # Cloudflare Workers config (nodejs_compat)
├── next.config.ts
├── tailwind.config.ts
├── supabase/
│   └── schema.sql               # Tables + RLS policies
└── src/
    ├── middleware.ts            # Refresh session + guard /dashboard
    ├── app/
    │   ├── page.tsx             # Landing page
    │   ├── login, signup, forgot-password, reset-password/
    │   ├── auth/
    │   │   ├── actions.ts       # Server actions: sign in/up, Google, reset, logout
    │   │   ├── callback/route.ts# OAuth + reset code exchange
    │   │   └── confirm/route.ts # Email confirmation (OTP) handler
    │   └── dashboard/
    │       ├── layout.tsx       # Protected shell + logout
    │       ├── page.tsx         # List trackers + create
    │       ├── actions.ts       # Tracker/column/row CRUD server actions
    │       └── [id]/page.tsx    # One tracker
    ├── components/
    │   ├── TrackerGrid.tsx      # The spreadsheet grid
    │   ├── StatusCell.tsx       # Colored status dropdown
    │   ├── AddColumnModal.tsx
    │   ├── CreateTrackerModal.tsx
    │   └── auth/*               # Auth UI bits
    └── lib/
        ├── templates.ts         # Premade templates
        ├── types.ts             # Shared types + status colors
        └── supabase/            # Browser, server, and middleware clients
```

---

## Data model

### `trackers`

| column       | type          | notes                                   |
| ------------ | ------------- | ---------------------------------------- |
| `id`         | `uuid` PK     | `gen_random_uuid()`                      |
| `user_id`    | `uuid`        | FK → `auth.users(id)`, cascade delete    |
| `name`       | `text`        | tracker title                            |
| `columns`    | `jsonb`       | array of `{ id, name, type, options? }`  |
| `created_at` | `timestamptz` |                                           |
| `updated_at` | `timestamptz` | maintained by trigger                    |

### `job_entries`

| column       | type          | notes                                  |
| ------------ | ------------- | ---------------------------------------- |
| `id`         | `uuid` PK     | `gen_random_uuid()`                      |
| `tracker_id` | `uuid`        | FK → `trackers(id)`, cascade delete      |
| `user_id`    | `uuid`        | FK → `auth.users(id)`, cascade delete    |
| `data`       | `jsonb`       | map of `column.id` → cell value          |
| `position`   | `integer`     | row ordering                             |
| `created_at` | `timestamptz` |                                           |
| `updated_at` | `timestamptz` | maintained by trigger                    |

**RLS:** every policy checks `auth.uid() = user_id`, so users can only select, insert, update, and delete their own trackers and entries. Inserting an entry additionally requires that the parent tracker belongs to the same user. See [`supabase/schema.sql`](supabase/schema.sql) for the full policy definitions.

---

## License

MIT — see [LICENSE](LICENSE).
