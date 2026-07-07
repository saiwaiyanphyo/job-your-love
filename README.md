# Job Your Love — Job Application Tracker

A private, spreadsheet-style job application tracker with per-user Row Level Security.

**Live app:** [job-your-love.megiapps.workers.dev](https://job-your-love.megiapps.workers.dev/)

Every user gets their own tracker: an Excel-like grid where each row is a job application, with custom columns, inline editing, and a dashboard to see how the search is going at a glance.

Built with **Next.js (App Router) + TypeScript**, **Tailwind CSS**, and **Supabase** (auth + Postgres with Row Level Security), deployed on **Cloudflare Workers**.

---

## Screenshots
## Screenshots

![Landing page — value prop and feature highlights](<img width="1598" height="944" alt="Screenshot 2026-07-07 at 10 55 53 AM" src="https://github.com/user-attachments/assets/4d4e4a4c-2e2d-4fb6-a10f-a78b1e834855" />
)
*Landing page — value prop and feature highlights*

![Dashboard — stat cards and all-applications table](screenshots/dashboard.png)
*Dashboard — stat cards and all-applications table*

![Account settings — password change and tracker switching](screenshots/account-settings.png)
*Account settings — password change and tracker switching*


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

## License

MIT — see [LICENSE](LICENSE).
