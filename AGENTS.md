# MULTI-AGENT PLAN – LINKR

This file defines specialised roles so multiple AI agents can collaborate without chaos.

---

## 1. SYSTEM ARCHITECT

**Goal**: Keep the whole system coherent and consistent with the audits.

Responsibilities:

- Own `/docs` summary and keep it in sync with implementation.
- Define and maintain the folder structure.
- Review API contracts between backend, frontend, and mobile.
- Maintain `README.md` and high-level diagrams (even as Markdown).

When in doubt, **architect wins**: other agents must respect these decisions.

---

## 2. BACKEND ENGINEER

**Stack**: Node.js, Express 5, TypeScript, Prisma, PostgreSQL.

Responsibilities:

- Create `backend/` project structure.
- Define `prisma/schema.prisma` with all entities from the audits:
  - User, Profile, Subscription, PaymentTransaction, VerificationToken,
    SafetyAlert, MediaAsset, AuditLog, etc.
- Implement modules:
  - `auth`, `users`, `profiles`, `subscriptions`, `payments`,
    `kyc`, `media`, `safety`, `admin`.
- Implement full auth flows:
  - Registration, email verification, login, refresh token, logout.
  - Password reset, 2FA (TOTP), account deletion, data export.
- Integrate payment webhooks (SegPay/CCBill) in a clean, testable way.
- Implement Jumio KYC callback and status tracking.
- Implement encrypted Safety Center / Black Book using AES-256-GCM.
- Write tests with Jest + Supertest.

Output: **Production-ready API** that the frontend/mobile can consume.

---

## 3. FRONTEND ENGINEER (WEB)

**Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS.

Responsibilities:

- Create `frontend/` Next.js project.
- Implement Dark Luxury design (charcoal + gold, accessible).
- Pages:
  - Public: landing, city/category browsing, profile view.
  - Auth: login, register, email verify, forgot/reset password, 2FA.
  - Provider dashboard: overview, profile editor, subscription management, safety tools.
  - Admin dashboard: users, profiles, payments, KYC, safety alerts.
- Implement SEO:
  - SSR, ISR for listings.
  - Sitemap, robots.txt, schema.org JSON-LD for profiles.
- Connect to backend API via `NEXT_PUBLIC_API_BASE_URL`.

Output: Web experience matching the audits and wired to the real API.

---

## 4. MOBILE ENGINEER

**Stack**: React Native (Expo), TypeScript.

Responsibilities:

- Create `mobile/` Expo app.
- Implement:
  - Auth (login, register, 2FA, password reset).
  - Provider dashboard: basic stats, profile quick edit, photo upload.
  - Safety Center: panic button and check-in timers with push notifications.
- Use the same API contracts as the web frontend.
- Prepare config for building Android APK and iOS IPA.

Output: A working mobile app that can be built and published once credentials are added.

---

## 5. DEVOPS / INFRA ENGINEER

**Stack**: Docker, GitHub Actions, DigitalOcean/AWS, Cloudflare.

Responsibilities:

- Maintain `docker-compose.yml` and `docker-compose.aws.yml`.
- Make Dockerfiles for `backend/` and `frontend/`.
- Prepare GitHub Actions workflows for:
  - Tests + lint on PR.
  - Build and push Docker images.
- Add scripts under `infra/scripts/`:
  - DB migrations.
  - Backup helpers.
- Document deployment to DigitalOcean + Cloudflare, using the technical audit.

Output: Reproducible infra setup with clear commands.

---

## 6. QA / TEST ENGINEER

Responsibilities:

- Write automated tests:
  - Backend: unit + integration (Jest + Supertest).
  - Frontend: Playwright / Cypress for critical paths.
- Ensure:
  - Password reset, account deletion, and safety flows are tested.
  - Payments webhooks are covered by tests with mocked providers.
- Maintain a simple `docs/TESTING.md` guide.

---

## 7. DOCUMENTATION ENGINEER

Responsibilities:

- Keep `/docs` up to date with the actual code.
- Summarise complex flows (KYC, payments, safety) in diagrams/markdown.
- Ensure AGENT instructions stay aligned with implementation.

---

All agents must:

- Prefer **small, composable PR-sized changes**.
- Keep `.env.example` aligned with code.
- Never break existing tests without updating them.
