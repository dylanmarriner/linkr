

---

## `AGENT.md` (single AI instructions)

```markdown
# AGENT BRIEF – LINKR MONOREPO

You are an expert **full-stack + mobile + DevOps engineer** tasked with building the
entire Linkr platform from this skeleton.

Your constraints:

1. **Monorepo**: All code lives under this root. Use:
   - `backend/` – Node.js + Express + Prisma + PostgreSQL
   - `frontend/` – Next.js 14 + Tailwind (App Router)
   - `mobile/` – React Native (Expo + TypeScript)
   - `infra/` – deployment, CI/CD, scripts

2. **Stack (hard requirements)**

   - Language: TypeScript for backend + frontend + mobile.
   - Backend:
     - Express 5, Prisma ORM, PostgreSQL.
     - JWT auth (access + refresh), bcrypt for passwords.
     - Pino logging, Zod validation, Helmet, rate limiting, CORS.
   - Frontend:
     - Next.js 14 App Router, Tailwind CSS.
     - Dark Luxury theme (charcoal + gold).
     - Server Components for SEO; client components for interactivity.
   - Mobile:
     - Expo (managed workflow).
     - Reuse API models from backend as much as possible (shared types later via `shared/`).

3. **Feature Scope for MVP**

   Implement the modules described in the technical audits:

   - Auth + Users (registration, login, email verify, password reset, 2FA, roles).
   - Profiles (providers, inclusive gender/identity model, photos, pricing, availability).
   - Subscriptions & Payments (5 monthly tiers + 6 weekly tiers, self-serve upgrade/downgrade).
   - KYC (Jumio age verification flow, webhooks).
   - Media (upload, watermarking hooks, signed URLs).
   - Safety Center (panic, check-ins, encrypted Black Book).
   - Admin (moderation, KYC review, safety alerts, analytics/dashboard).
   - Search (OpenSearch or Elasticsearch; basic filters for MVP).
   - Notifications (email + in-app).

4. **Non-Negotiable Security / Compliance**

   - CSRF protection on all state-changing endpoints.
   - JWT rotation and invalidation on logout.
   - Strong password policies and bcrypt cost ≥ 12.
   - Account deletion and data export flows to comply with NZ Privacy Act 2020.
   - Audit logging for admin actions and security-sensitive events.

5. **Development Approach**

   - Start with **backend**: Prisma schema, migrations, modules, REST endpoints.
   - Then the **frontend**: pages that exercise all backend flows (auth, dashboard, profile, search, admin).
   - Then **mobile**: minimal but real provider app hitting same API.
   - Add **tests**: Jest + Supertest for API, Playwright (or Cypress) for critical frontend flows.

6. **Output Style**

   - Write production-grade, well-typed TypeScript.
   - Use clear folder structure and meaningful names.
   - Document non-trivial functions and modules with comments.
   - Keep env variables in `.env.example` in sync with what the code expects.

If something is ambiguous, implement the **simplest version that is obviously correct**, but
leave clear `// TODO:` notes referencing the intended behaviour from the audits.


Copy .env.example → .env and fill in secrets.

Build and run services:

docker compose up --build


Services:

API: http://localhost:4000

Frontend: http://localhost:3000

PostgreSQL: localhost:5432

OpenSearch (optional): http://localhost:9200

4. MVP MUST-HAVE FEATURE CHECKLIST

These are non-negotiable for launch, based on the technical audit and legal framework:

Security & Auth

Email/password login with bcrypt (cost ≥ 12).

Email verification before first login.

Password reset flow (email token, 30 min expiry).

Optional 2FA (TOTP) for providers and admins.

JWT access + refresh tokens with rotation.

IP + device logging for suspicious activity.

CSRF protection on all state-changing endpoints.

Rate limiting on auth and contact endpoints.

Privacy & Compliance

Account deletion (soft delete + GDPR/Privacy Act compliant purge).

Data export (JSON/CSV of personal data).

Terms of Service + Privacy Policy acceptance logging (versioned).

Cookie consent for tracking/non-essential cookies.

Logging & audit trails for admin actions (non-deletable).

Safety & Trust

Jumio KYC age verification flow (backend + frontend).

Safety Center: panic button, scheduled check-ins.

Encrypted Safety alerts / Black Book system (AES-256-GCM).

Media watermarking per-client (design hooks in place, can stub advanced AI parts).

Moderation queue for all new/edited profiles & media.

Subscriptions & Payments

5-tier monthly subscriptions (as per business plan).

6-tier weekly subscriptions with discount logic.

Self-service upgrade/downgrade/cancel.

Payment webhooks (SegPay/CCBill) updating subscription + audit logs.

The AGENT files in this repo tell AIs exactly how to implement these.

5. Mobile Apps (Android APK + iOS IPA)

The mobile/ app must:

Use React Native (Expo) with TypeScript.

Share domain models and API contracts with backend/.

Support at least:

Provider login / sign-up with KYC status.

Manage profile (photos, bio, availability).

View and respond to messages/leads (Phase 1.5+).

Safety: panic button & check-in timers with push notifications.

APK / IPA build configs should be generated by the AI following Expo’s latest best practices.

6. How To Use This Repo With AI Tools

Point your AI (ChatGPT, Claude, Gemini, Cursor, Windsurf, etc.) at:

README.md (this file)

AGENT.md

AGENTS.md

.gemini.md / CLAUDE.md / .cursorrules / .clinerules / .windsurfrules

Ask it to create missing directories and files and implement the full feature set.

Force it to keep everything in one monorepo, not scattered sample apps.

All the strategy, legal and tech details live in the docs/ folder (to be copied from your PDFs).
