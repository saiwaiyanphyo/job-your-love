# Job Application Tracker

A full-stack, spreadsheet-style job application tracker.

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Supabase** for authentication (email/password, Google OAuth, password reset, email confirmation) and a Postgres database with **Row Level Security**
- Deploys to **Cloudflare Workers** via the **[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)** adapter

Each user gets their own trackers. A tracker is an Excel-like grid where every row is a job application. Users can add/edit/delete rows, add custom columns (text, date, status dropdown, URL, number), rename/delete columns, edit cells inline, and start from premade templates.

---

## Table of contents

1. [Features](#features)
2. [Project structure](#project-structure)
3. [1. Supabase project setup](#1-supabase-project-setup)
4. [2. Run the database SQL](#2-run-the-database-sql)
5. [3. Enable Google OAuth](#3-enable-google-oauth)
6. [4. Configure email confirmation & redirect URLs](#4-configure-email-confirmation--redirect-urls)
7. [5. Local development](#5-local-development)
8. [6. Deploy to Cloudflare Workers](#6-deploy-to-cloudflare-workers)
9. [Database schema reference](#database-schema-reference)

---

## Features

- **Authentication (Supabase Auth)**
  - Email/password sign-up with email confirmation
  - Email/password login
  - Google login (OAuth)
  - Password reset via email
  - Logout
  - Protected routes — `/dashboard/**` requires a session (enforced in middleware)
  - Row Level Security so each user only ever reads/writes their own data
- **Application tracker** (single tracker per user, sidebar-based UI)
  - Dashboard with live stat cards (Total, Interviews, Offers, Rejections + response rate)
  - Applications table with search, sort, and inline colored status changes
  - Status-filtered views: Interviews, Offers, Rejections
  - Add / edit / delete applications via a dedicated form
  - Detail panel per application: meta, job description, timeline, contact, follow-ups
  - Account settings: change password, sign-in provider, logout
  - All data persisted per user in Supabase (`job_entries.data` JSONB)
- **Onboarding templates** — Job Search, Internship, Custom Tracker (template chooser on first sign-in)
- **Status pipeline** — colored badges: Wishlist · Applied · OA/Assessment · Interviewing · Final Round · Offer · Accepted · Rejected
- **Design system** — Inter font with a calm monochrome palette and status accent colors (built from a Pencil design)

---

## Project structure

```
.
├── open-next.config.ts          # OpenNext (Cloudflare) adapter config
├── wrangler.jsonc               # Cloudflare Workers config (nodejs_compat)
├── next.config.ts
├── tailwind.config.ts
├── supabase/
│   └── schema.sql               # Tables + RLS policies — run this in Supabase
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

## 1. Supabase project setup

1. Create a free account at [supabase.com](https://supabase.com) and create a **new project**.
2. Once it finishes provisioning, go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create a local `.env.local` (copy from `.env.example`):

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

> The anon key is safe to expose to the browser — Row Level Security is what protects your data.

---

## 2. Run the database SQL

1. In the Supabase dashboard open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

This creates the `trackers` and `job_entries` tables, an `updated_at` trigger, indexes, and all the **Row Level Security** policies. The script is idempotent, so you can re-run it safely.

---

## 3. Enable Google OAuth

1. **Create Google OAuth credentials**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
   - **Create Credentials → OAuth client ID → Web application**.
   - Under **Authorized redirect URIs**, add the Supabase callback:
     ```
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**.
2. **Enable the provider in Supabase**
   - Dashboard → **Authentication → Providers → Google** → toggle **Enabled**.
   - Paste the **Client ID** and **Client Secret**, then **Save**.

The "Continue with Google" button on the login/signup pages will now work. After Google auth, users are returned to `/auth/callback`, which exchanges the code for a session and forwards to `/dashboard`.

---

## 4. Configure email confirmation & redirect URLs

1. Dashboard → **Authentication → Providers → Email** — make sure **Confirm email** is enabled (it is by default). New sign-ups will receive a confirmation email; the link points to `/auth/confirm`.
2. **Update the "Confirm signup" email template** (required). Dashboard → **Authentication → Emails → Templates → Confirm signup**. Replace the default link:

   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your mail</a>
   ```

   with one that points at this app's `/auth/confirm` route with a `token_hash`:

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
   ```

   The default `{{ .ConfirmationURL }}` routes through Supabase's verify endpoint and a PKCE `code` flow that fails if the link is opened on a different device than sign-up, producing "Email confirmation link is invalid or has expired." The `token_hash` form above is verified by [`src/app/auth/confirm/route.ts`](src/app/auth/confirm/route.ts) and works cross-device.
3. Dashboard → **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://job-application-tracker.YOUR-SUBDOMAIN.workers.dev`). For local testing you can set `http://localhost:3000`.
   - **Redirect URLs** — add every origin you'll use, e.g.:
     ```
     http://localhost:3000/**
     https://job-application-tracker.YOUR-SUBDOMAIN.workers.dev/**
     ```
   These must include the origins used by `/auth/callback` and `/auth/confirm`.

> Supabase's built-in email service is rate-limited and intended for testing. For production, configure a custom SMTP provider under **Authentication → Emails → SMTP Settings**.

---

## 5. Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Sign up → confirm via the email link → log in.
- Create a tracker from a template and start adding rows/columns.

To test the **Cloudflare Workers runtime locally** (instead of `next dev`), use the OpenNext preview (see below). For that path, copy `.dev.vars.example` to `.dev.vars` and fill in your Supabase values.

---

## 6. Deploy to Cloudflare Workers

This project uses the OpenNext Cloudflare adapter. Configuration lives in
[`open-next.config.ts`](open-next.config.ts) and [`wrangler.jsonc`](wrangler.jsonc)
(note `compatibility_flags: ["nodejs_compat"]`).

### a. Install & log in to Wrangler

```bash
npm install
npx wrangler login
```

### b. Provide the Supabase environment variables to Cloudflare

The Supabase URL and anon key are public values inlined into the build, so the
simplest approach is to set them as build-time env vars. Either:

- add them to `wrangler.jsonc` under a `"vars"` block (uncomment the example), **or**
- set them as secrets so they're available at build/runtime:

  ```bash
  npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
  npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```

For local preview, put the same values in `.dev.vars` (copied from `.dev.vars.example`).

### c. Preview locally on the Workers runtime

```bash
npm run preview
```

This runs `opennextjs-cloudflare build` then `opennextjs-cloudflare preview`,
serving the app exactly as it will run on Cloudflare.

### d. Deploy

```bash
npm run deploy
```

This builds and runs `opennextjs-cloudflare deploy`, publishing to your
`*.workers.dev` subdomain (or a custom domain configured in `wrangler.jsonc`).

### e. Post-deploy

- Add your deployed URL to Supabase **Authentication → URL Configuration → Site URL / Redirect URLs**.
- Make sure the Google OAuth redirect URI (`https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`) is still in place — it does not change per deployment.

---

## Database schema reference

### `trackers`

| column      | type          | notes                                            |
| ----------- | ------------- | ------------------------------------------------ |
| `id`        | `uuid` PK     | `gen_random_uuid()`                              |
| `user_id`   | `uuid`        | FK → `auth.users(id)`, cascade delete            |
| `name`      | `text`        | tracker title                                    |
| `columns`   | `jsonb`       | array of `{ id, name, type, options? }`          |
| `created_at`| `timestamptz` |                                                  |
| `updated_at`| `timestamptz` | maintained by trigger                            |

### `job_entries`

| column       | type          | notes                                           |
| ------------ | ------------- | ----------------------------------------------- |
| `id`         | `uuid` PK     | `gen_random_uuid()`                             |
| `tracker_id` | `uuid`        | FK → `trackers(id)`, cascade delete             |
| `user_id`    | `uuid`        | FK → `auth.users(id)`, cascade delete           |
| `data`       | `jsonb`       | map of `column.id` → cell value                 |
| `position`   | `integer`     | row ordering                                    |
| `created_at` | `timestamptz` |                                                 |
| `updated_at` | `timestamptz` | maintained by trigger                           |

**RLS:** every policy checks `auth.uid() = user_id`, so users can only select,
insert, update, and delete their own trackers and entries. Inserting an entry
additionally requires that the parent tracker belongs to the same user. See
[`supabase/schema.sql`](supabase/schema.sql) for the full policy definitions.
