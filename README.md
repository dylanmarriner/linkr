# Linkr – Premium Escort Marketing Platform (NZ)

> Monorepo skeleton + AI orchestration files so multiple AIs can build the full stack:
> **backend API, Next.js frontend, React Native mobile apps (Android APK + iOS IPA).**

---

## 1. High-Level Overview

Linkr is a **New Zealand–focused, safety-first, inclusive escort marketing platform**.

The core product:

- **Frontend**: Next.js 14 + Tailwind, Dark Luxury theme, SEO-optimised.
- **Backend**: Node.js + Express + Prisma + PostgreSQL.
- **Mobile**: React Native (Expo), sharing the same REST API.
- **Infra**: Docker-based, deployable to DigitalOcean + Cloudflare (or AWS if needed).

Key modules (from the technical audit):

- `auth` – registration, login, password reset, 2FA, email verification.
- `users` – user accounts, roles, bans, account deletion & data export.
- `profiles` – provider profiles, photos, availability, inclusive gender/identity model.
- `subscriptions` – 6-tier weekly + 5-tier monthly plans, self-service upgrade/downgrade.
- `payments` – SegPay / CCBill webhooks, subscription lifecycle.
- `kyc` – Jumio-based age verification (status + ref ID only, no ID images stored).
- `media` – uploads, AI watermarking, signed URLs, CDN integration.
- `safety` – panic alerts, safety check-ins, encrypted Black Book client alerts.
- `search` – Elasticsearch/OpenSearch based discovery & filters.
- `admin` – moderation, analytics, KYC review, safety center.
- `notifications` – email + in-app notifications, safety reminders.
- `analytics` – PostHog event tracking (Phase 1+).

This repo is intentionally **light on code and heavy on instructions** so that AI tools
(Gemini, Claude, Cursor, Windsurf, ChatGPT etc.) can generate the implementation.

---

## 2. Repository Structure

Planned structure (AI should create these folders and code):

```text
.
├── backend/                 # Express + Prisma API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── profiles/
│   │   │   ├── subscriptions/
│   │   │   ├── payments/
│   │   │   ├── kyc/
│   │   │   ├── media/
│   │   │   ├── safety/
│   │   │   └── admin/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # Next.js 14 (App Router)
│   ├── app/
│   │   ├── (public)/
│   │   ├── (dashboard)/
│   │   └── (admin)/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── Dockerfile
│   └── package.json
│
├── mobile/                  # React Native (Expo) app
│   ├── app/
│   ├── components/
│   ├── app.config.ts
│   └── package.json
│
├── infra/                   # Deployment, CI/CD, k8s (later)
│   ├── github/
│   ├── k8s/
│   └── scripts/
│
├── docs/                    # Technical audit, legal framework, etc.
│   ├── TECHNICAL_AUDIT/
│   ├── LEGAL/
│   └── PRODUCT/
│
├── .env.example
├── docker-compose.yml
├── docker-compose.aws.yml
├── AGENT.md
├── AGENTS.md
├── .cursorrules
├── .clinerules
├── .windsurfrules
├── .gemini.md
├── CLAUDE.md
└── README.md
