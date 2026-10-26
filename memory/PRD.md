# PRD — VORTEX Digital (Bilingual Agency Website)

## Original problem statement
Build a production-ready, premium bilingual (EN/AR, full RTL/LTR) website for a digital agency: multi-page marketing site (home, services + detail, portfolio + case studies, pricing, about, contact, quote, privacy, terms, 404), a real lead-generation quote system, and a secure bilingual admin dashboard managing inquiries, portfolio, services, pricing, and settings. Dark near-black + warm-white + electric-lime art direction, Awwwards-level motion (kinetic masked hero, marquee, scroll reveals, Lenis smooth scroll).

## User personas
- Business owner (restaurant, hotel, retail, clinic, etc.) — browses services/work, requests a quote in EN or AR.
- Agency admin — manages inquiries, content, pricing, and settings in EN or AR.

## Architecture
- Frontend: React 19 + react-router 7, Tailwind, framer-motion, Lenis, custom i18n context (localStorage persistence, dir/lang switch), routes /en/* and /ar/*, admin under /admin.
- Backend: FastAPI + Motor (MongoDB). Public endpoints /api/public/*, /api/inquiries; admin endpoints /api/admin/* behind JWT httpOnly-cookie auth; Resend email via Emergent managed proxy.
- DB collections: users, inquiries, services, projects, packages, settings, login_attempts. Indexes on email, slugs, reference, status.

## Implemented (2026-10-25)
- Full bilingual public site: all 12 required pages in EN + AR, language switcher preserving page context, RTL layout with Arabic fonts.
- Kinetic hero with masked line reveal + parallax mockups, editorial marquee, bento services grid, industry solutions, filterable portfolio with concept labels, case studies, 6-step process, 3 pricing packages (custom quote), FAQ accordion, final CTA, footer.
- Multi-step quote form (4 steps) + contact form → /api/inquiries with validation, honeypot, rate limit, duplicate guard, reference number (VX-XXXXXX), success state, email notification.
- Admin dashboard: overview stats, inquiries (search/filter/sort/paginate/detail/status/notes/archive/delete/CSV export), projects/services/packages CRUD with bilingual fields + translation-missing warnings, site settings editor.
- Security: JWT auth, brute-force lockout, server-side authorization, 401 for unauthenticated admin API.
- SEO: per-page titles/descriptions, canonical + hreflang, sitemap.xml, robots.txt.

## Verified
- Quote form submitted end-to-end (ref VX-168519), visible in admin, status changed, note added.
- AR/EN switch flips dir and content; AR portfolio filter + case study OK; mobile 375px OK.
- Admin CRUD for projects OK; CSV export OK; unauthenticated /api/admin/* returns 401.
- Email send attempted and correctly blocked for placeholder address (hello@vortex.digital is not a real inbox — set real email in Settings).

## Backlog
- P0: WhatsApp alerts — code ready, awaiting Twilio keys (user skipped secrets card; re-request when user provides a Twilio account).
- P1: Testimonials section (currently hidden — needs genuine reviews only).
- P1: Demo websites linked from concept projects (preview_url field exists).
- P2: Admin password change inside the dashboard; multi-admin roles.
- P2: Object-storage image uploads (currently URL-based).

## Updates (2026-10-25, later)
- Contact email set to mohamadaboaloyoun3@gmail.com; inquiry email notifications verified delivering (202 Accepted).
- WhatsApp alert sender implemented (whatsapp_utils.py, fires on every inquiry); inactive until Twilio credentials are saved.
