# IKOCT Backend API Reference

Base URL: `http://localhost:4000/api` (or your deployed backend's URL)

All request/response bodies are JSON. Protected routes require:
`Authorization: Bearer <token>`

Every resource below (`events`, `news`, `blog`, `stories`, `programs`,
`projects`, `gallery`) follows the same pattern, so only `events` is shown
in full detail — the others are listed by their field differences only.

---

## Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | `{ email, password }` → `{ token, admin }` |
| GET | `/auth/me` | admin | Current admin's profile |
| POST | `/auth/change-password` | admin | `{ currentPassword, newPassword }` |
| POST | `/auth/admins` | super_admin | Create a new admin account |
| GET | `/auth/admins` | super_admin | List all admins |
| PATCH | `/auth/admins/:id/active` | super_admin | `{ is_active: true/false }` |

Login is rate-limited to 10 attempts / 15 minutes per IP.

---

## Events

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/events` | — | Active events only, ordered for the slider |
| GET | `/events/:id` | — | Single event |
| GET | `/events/admin/all` | admin | All events, including inactive |
| POST | `/events` | admin | Create |
| PUT | `/events/:id` | admin | Update |
| DELETE | `/events/:id` | admin | Delete |

Fields: `title` (required), `description` (required), `location`,
`start_date` (required, ISO 8601), `end_date`, `image_path`,
`display_order`, `is_active`.

---

## News, Blog, Stories, Programs, Projects, Gallery

Same route shape as Events (`GET /`, `GET /:id`, `GET /admin/all`,
`POST /`, `PUT /:id`, `DELETE /:id`), mounted at:

- `/news` — fields: `title`, `body`, `image_path`, `is_published`, `published_at`
- `/blog` — fields: `title`, `excerpt`, `body`, `author_name`, `image_path`, `is_published`, `published_at`
- `/stories` — fields: `title`, `child_name`, `body`, `image_path`, `is_published`
- `/programs` — fields: `title`, `summary`, `body`, `icon`, `image_path`, `is_active`, `display_order`
- `/projects` — fields: `title`, `summary`, `body`, `status` (planned/ongoing/completed), `image_path`, `is_active`, `display_order`
- `/gallery` — fields: `caption`, `category`, `image_path` (required), `is_active`, `display_order`

The public `GET /` for each only returns published/active rows; the admin
`GET /admin/all` returns everything, drafts included.

---

## Contact Messages

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/contact` | — | Submit the public contact form. Rate-limited (20/hour/IP). |
| GET | `/contact` | admin | List all messages |
| PATCH | `/contact/:id/read` | admin | Mark as read |
| DELETE | `/contact/:id` | admin | Delete |

---

## Settings

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/settings/public` | — | Only non-secret display settings (org phone/email/address, social links, Paystack *public* key) |
| GET | `/settings` | super_admin | All settings |
| PUT | `/settings/:key` | super_admin | `{ value }` |

Secret keys (e.g. `PAYSTACK_SECRET_KEY`) are never stored in the
`settings` table — they live only in the backend's `.env`.

---

## Uploads

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/uploads` | admin | `multipart/form-data`, field name `image`. Returns `{ path }` to store against a record's `image_path`. |

Accepts JPEG, PNG, WEBP, SVG. Size limit set by `MAX_UPLOAD_MB` (default 5MB).

---

## Health check

`GET /api/health` → `{ status: "ok", env: "..." }` — no auth required.

---

## Error format

```json
{ "error": "Human-readable message", "details": [ ... ] }
```

`details` is only present on validation failures (400).
