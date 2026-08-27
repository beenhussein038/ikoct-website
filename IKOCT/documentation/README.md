# IKOCT — Ikara Orphanage Charity Trust Website

Modernized public website, admin dashboard, and backend API for IKOCT.

## 1. Project Overview

This project preserves the existing IKOCT public website (content, wording,
structure, and identity unchanged) while adding:

- A **dynamic, auto-rotating Events section** on the homepage
- A separate **Admin Dashboard** for managing events, news, blog posts,
  stories, programs, projects, gallery images, and site settings — no
  coding required
- A **backend REST API** (Node.js + Express) backing both the public site
  and the dashboard
- A **SQLite database** with a migration system, ready to move to
  PostgreSQL later without a rebuild

Nothing on the original 16 public pages was rewritten, reworded, or
removed. One stray leftover character in `index.html`'s nav markup was
fixed; everything else in the frontend is untouched except the new events
slider section and its supporting CSS/JS, which were *added*, not
substituted in place of anything.

## 2. Architecture

```
IKOCT/
├── frontend/       Public website (existing, mostly untouched)
├── admin/          Admin dashboard (new)
├── backend/        Express REST API (new)
├── database/       Schema + migrations (new)
├── api/            API reference (this folder → see api/API.md)
└── documentation/  This README lives at project root; see also here
```

Data flow:

```
frontend (public site)  ─┐
                          ├─►  backend (Express API)  ─►  database (SQLite)
admin (dashboard)       ─┘
```

The frontend calls the **public** endpoints (no auth) to render live
content — right now, only the homepage events slider does this. The
admin dashboard calls the **admin** endpoints (JWT-protected) to manage
everything. If the backend isn't deployed or is temporarily unreachable,
the frontend falls back to its existing static content instead of
breaking.

## 3. Technologies

| Layer     | Technology                                    |
|-----------|------------------------------------------------|
| Frontend  | Plain HTML/CSS/JS (no framework, no build step) — unchanged from the existing site |
| Admin     | Plain HTML/CSS/JS, same approach — no framework needed for this scope |
| Backend   | Node.js, Express                               |
| Database  | SQLite via `better-sqlite3` (file-based; portable to Postgres later) |
| Auth      | JWT (`jsonwebtoken`) + bcrypt password hashing |
| Security  | `helmet`, `express-rate-limit`, `express-validator`, CORS allow-list |
| Uploads   | `multer`, validated by MIME type and size      |

## 4. Installation

### Prerequisites
- Node.js 18 or later
- npm

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set JWT_SECRET to a long random string, and set
# SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD for your first admin login.
npm run migrate   # creates the SQLite database and applies the schema
npm run seed      # creates your first admin account + real program entries
npm start         # starts the API on http://localhost:4000
```

Generate a strong `JWT_SECRET` with:
```bash
openssl rand -hex 64
```

### Frontend setup

The frontend is fully static — no build step. Open `frontend/index.html`
directly, or serve the folder with any static file server, e.g.:

```bash
cd frontend
npx serve .
```

By default the homepage events slider looks for the API at
`http://localhost:4000/api`. To point it at a different backend (e.g. in
production), set this before `script.js` loads, in `index.html`:

```html
<script>window.IKOCT_API_BASE_URL = "https://api.yourdomain.org/api";</script>
<script src="script.js"></script>
```

### Admin dashboard setup

Also fully static. Serve the `admin/` folder the same way, or open
`admin/pages/login.html` directly. Set `window.IKOCT_API_BASE_URL` the
same way as above if your backend isn't on `localhost:4000`.

Log in with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set in
`.env` before running `npm run seed`. **Change that password immediately**
after first login (a change-password endpoint exists at
`POST /api/auth/change-password`; a UI for it can be added to the
dashboard's settings area if not already present).

## 5. Environment Variables

See `backend/.env.example` for the full list with descriptions. Never
commit a real `.env` file. Required at minimum:

- `JWT_SECRET` — long random string
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` — for the first `npm run seed`
- `ALLOWED_ORIGINS` — comma-separated list of domains allowed to call the API

## 6. Database Setup

Schema lives at `database/schema/schema.sql`; the same content is also the
first migration, `database/migrations/001_initial_schema.sql`. Future
schema changes should be added as new numbered files in
`database/migrations/` (e.g. `002_add_something.sql`) — running
`npm run migrate` applies only what hasn't been applied yet, so it's safe
to run on every deploy.

Tables: `admins`, `events`, `news`, `blog_posts`, `stories`, `programs`,
`projects`, `gallery_images`, `contact_messages`, `donations`, `settings`,
`audit_log`.

## 7. How to Add an Administrator

1. Log into the dashboard as a `super_admin`.
2. Go to **Admin Users** in the sidebar (only visible to super admins).
3. Click **+ Add Admin**, fill in name/email/temporary password/role.
4. Share the temporary password with them securely (not by plain email)
   and have them change it on first login.

Only a `super_admin` can create other admins or disable accounts.
`editor` accounts can manage content but not other admin users.

## 8. How to Add/Edit Events (powers the homepage slider)

1. Log into the dashboard → **Events** in the sidebar.
2. Click **+ Add Event**. Fill in title, description, location, start
   date (required), end date (optional), and upload an image.
3. Leave **Active** checked for it to appear in the homepage slider.
   Uncheck it to hide an event without deleting it.
4. **Display Order** controls slide order (lower numbers show first).
5. Save. The homepage slider fetches this automatically on next page
   load — no code changes needed.

To remove an event from the slider, either uncheck **Active** or delete
it entirely from the Events table.

## 9. Managing Other Dynamic Content

News, Blog Posts, Stories, Programs, Projects, and Gallery Images all
work the same way from their respective dashboard pages: a table of
existing items, an **+ Add New** button, and Edit/Delete actions per row.
Items with a **Published**/**Active** toggle only appear on the public
site when that toggle is on.

## 10. API Documentation

See `api/API.md` for the full endpoint reference.

## 11. Deployment

This is a standard three-tier deployment:

- **Backend**: any Node.js host (Render, Railway, a VPS, etc.). Run
  `npm run migrate` once on first deploy, `npm run seed` once to create
  the first admin, then `npm start` (or a process manager like `pm2`).
  The SQLite file at `DATABASE_PATH` should live on persistent storage —
  if your host wipes the filesystem between deploys, either use a
  persistent disk/volume or migrate to a managed Postgres instance.
- **Frontend & Admin**: any static host (Netlify, Vercel, GitHub Pages,
  a plain Nginx server). Set `window.IKOCT_API_BASE_URL` to your deployed
  backend's public URL before `script.js`/`api.js` loads.
- **CORS**: set `ALLOWED_ORIGINS` in the backend's `.env` to the exact
  domain(s) the frontend and admin dashboard are served from.

## 12. Backup Instructions

The entire database is one file (`backend/database/ikoct.db` by default,
or wherever `DATABASE_PATH` points). Back it up by copying that file —
stop write traffic briefly or use SQLite's `.backup` command for a
consistent snapshot:

```bash
sqlite3 ikoct.db ".backup 'ikoct-backup-$(date +%F).db'"
```

Also back up the `backend/uploads/` folder (or wherever `UPLOAD_DIR`
points), since uploaded images are stored there, not in the database.

## 13. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Homepage shows the fallback event instead of real events | Backend isn't running, or `IKOCT_API_BASE_URL` isn't set correctly, or no events are marked Active |
| Admin login fails with "Invalid email or password" | Check `.env` seed values were correct at seed time; if forgotten, an existing super_admin can create a new admin, or re-run migrate+seed against a fresh database |
| "Too many login attempts" | Login is rate-limited to 10 attempts / 15 minutes per IP — wait and retry |
| CORS error in browser console | Add your frontend/admin's exact origin to `ALLOWED_ORIGINS` in the backend `.env` |
| Image upload fails | Check file is JPEG/PNG/WEBP/SVG and under `MAX_UPLOAD_MB` |

## 14. Notes on this modernization pass

- `events.html` still shows its existing static event list/countdown —
  left untouched deliberately, per the "preserve existing content" rule.
  It could be wired to `GET /api/events` the same way the homepage
  slider is, as a follow-up.
- No organizational statistics, achievements, or events were invented
  anywhere in this pass — the seed script only carries over the five
  real, existing program names/summaries from `programs.html`.
- Payment integration (Paystack) is scaffolded (settings field, `.env`
  placeholders) but not wired up — `donate.html`'s button is still a
  placeholder, exactly as it was before this pass, since building a real
  payment flow wasn't part of the current request.
