# VORTEX Digital — Setup & Deployment

## Stack
React (CRA/craco) + FastAPI + MongoDB. Bilingual EN/AR with full RTL/LTR. JWT cookie auth for admin.

## Environment variables (backend/.env)
- `MONGO_URL` — MongoDB connection string
- `DB_NAME` — database name
- `JWT_SECRET` — 64-char hex secret for signing tokens
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seeded admin account (created on startup if missing)
- `EMERGENT_EMAIL_KEY` — Emergent-managed email key (inquiry notifications)
- `EMAIL_FROM_NAME` — sender display name ("VORTEX Digital")
- `EMAIL_REPLY_TO` — optional reply-to inbox
- `FRONTEND_URL` — public site origin (used for CORS, sitemap, canonicals)

## Frontend (frontend/.env)
- `REACT_APP_BACKEND_URL` — API base origin

## Initial admin creation
Admin is seeded automatically on backend startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. To rotate the password, change `ADMIN_PASSWORD` and restart the backend (seed reconciles the hash), then update /app/memory/test_credentials.md.

## Email notifications
New inquiries trigger a notification email to the "Contact email" configured in Admin → Settings. The seeded `hello@vortex.digital` is a placeholder and will be rejected as undeliverable — set a real inbox in Settings. No extra Resend setup is needed (Emergent-managed).

## Database content
Services (12), portfolio projects (6 concept projects), pricing packages (3), and site settings are seeded only when the collections are empty. All of it is editable from /admin in both languages.

## Deployment
Press Deploy in Emergent. The first deploy copies the preview database once; content entered in preview after that stays in preview — enter live content on the live site's /admin. Frontend routes are served by the SPA; all API routes are under /api. Sitemap: /api/sitemap.xml, robots: /api/robots.txt.

## Security notes
- Admin APIs require a valid JWT (httpOnly cookie); brute-force lockout after 5 failed logins.
- Inquiry endpoint: rate-limited per IP, honeypot field, server-side validation, duplicate guard.
- No secrets in frontend code; all keys live in backend/.env.
