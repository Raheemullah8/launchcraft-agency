# 🧠 LaunchCraft Portfolio & Agency Platform — Brain Document (brain.md)

> **Document Version:** 2.0.0  
> **Last Updated:** October 2026  
> **Status:** Active / Production-Ready Hybrid Architecture  
> **Application Name:** LaunchCraft (Creative & Growth Partner)

---

## 1. Project Overview & Mission

**LaunchCraft** is a high-end, editorial creative & growth agency platform built for ambitious founders, enterprise leaders, and ventures transitioning *"From Idea to Impact"*.

### Core Value Proposition & Positioning
- **Editorial Brand Architecture & Identity:** Rejecting commodity templates and heavy gradients in favor of refined typography, generous negative space, and Swiss/editorial minimalism.
- **High-Performance Web Engineering:** Next.js 16 with React 19, TypeScript, Tailwind CSS v4, and WCAG 2.2 accessibility standards.
- **Commercial Accountability:** Lead generation, consultation scheduling, CV job applications, newsletter capture, and authentic Trustpilot proof.
- **Database & Media Architecture:** Hybrid PostgreSQL (via Prisma ORM 7) with in-database binary image buffer vault (`Media` model) and centralized Axios communication.
- **Type-Safe Validation:** React Hook Form + Zod schema validation across all interactive forms.

---

## 2. Technical Stack & Architecture

| Layer | Technology / Library | Description / Version |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.3 | App Router (`src/app`), Server Components & API route handlers (Turbopack) |
| **Runtime & Language** | React 19.3.0, TypeScript 5.x | Strict typing across models, API handlers, and UI props |
| **Database & ORM** | PostgreSQL & Prisma 7.10.1 | PostgreSQL (`launchcraft` DB) via `@prisma/client` & `@prisma/adapter-pg` driver |
| **Form Management** | `react-hook-form` & `zod` | Declarative validation with `@hookform/resolvers/zod` |
| **Networking & HTTP** | Axios (v1.21.0) | Centralized client instance (`src/lib/api.ts`) with interceptors & error unwrapping |
| **Styling & Design** | Tailwind CSS v4, CSS Variables | Editorial theme (Fraunces serif + Inter sans), Warm Ivory & Charcoal palette |
| **Animation & Icons** | Lucide React (v1.61), Framer Motion (v14.6) | Clean interactive icons and smooth transitions |
| **Media Vault** | PostgreSQL BYTEA Buffer | Binary image storage in `Media` table + permanent cache streaming (`/api/media/[id]`) |
| **Auth & Security** | Bcrypt + HTTP-Only Cookie | Database admin authentication with `bcryptjs` and `launchcraft_admin_token` session |
| **Private Asset Vault** | `storage/private/cvs/` | Isolated private filesystem for CV submissions (max 5MB PDF/DOCX) |
| **Agent Engineering Runtime** | **GRAVITAS** (`.agents/skills`, `.agents/rules`) | 6 Invariants, Scoped Recon, TypeScript Extension & High-Stakes Guard |

---

## 3. Directory Structure

```text
portfolio/
├── .agents/                        <-- Antigravity Customization & GRAVITAS Runtime
│   ├── rules/
│   │   └── gravitas-invariants.md  <-- Always-on 6 Kernel Invariants rule
│   └── skills/
│       ├── gravitas/               <-- Core GRAVITAS Skill & Cognitive Loop
│       ├── gravitas-typescript/    <-- TypeScript/React/Next.js Recon & Verification
│       └── gravitas-highstakes/    <-- Tier-2 Checkpoint & Risk Mitigation Skill
├── prisma/
│   ├── schema.prisma               <-- PostgreSQL database models (User, Service, Media, etc.)
│   └── seed.ts                     <-- Automated admin initialization script
├── prisma7.config.ts               <-- Prisma 7 config file (migrations & datasource URL)
├── brain.md                        <-- System Architecture & Knowledge Base
├── AGENTS.md                       <-- Agent runtime guidelines & Next.js notices
├── package.json                    <-- Dependencies and npm scripts
├── tsconfig.json                   <-- TypeScript configuration
├── public/
│   ├── images/                     <-- Editorial project imagery (p1.jpg ... p7.jpg)
│   └── *.svg                       <-- Static SVG assets
├── storage/
│   └── private/
│       └── cvs/                    <-- Private applicant CVs (Protected from direct public URL access)
└── src/
    ├── app/                        <-- Next.js App Router Pages & API Routes
    │   ├── layout.tsx              <-- Root layout (SEO, Schema.org LD-JSON, Fraunces/Inter fonts)
    │   ├── page.tsx                <-- Homepage (Hero, Services, Case Studies, Process, Trustpilot, CTA)
    │   ├── globals.css             <-- Tailwind v4 imports, editorial color tokens, custom scrollbar
    │   ├── robots.ts & sitemap.ts  <-- Dynamic SEO metadata generators
    │   ├── not-found.tsx           <-- Branded 404 handler
    │   ├── about/page.tsx          <-- Agency positioning, team partners, principles
    │   ├── services/               <-- Capabilities catalog (Dynamic from PostgreSQL)
    │   │   ├── page.tsx            <-- All services listing with interactive filters
    │   │   └── [slug]/page.tsx     <-- Dynamic service detail (deliverables, workflow, FAQs)
    │   ├── work/                   <-- Portfolio & Case studies
    │   │   ├── page.tsx            <-- Portfolio hub with category filters & search
    │   │   └── [slug]/page.tsx     <-- Case study details (problem, scope, approach, metrics)
    │   ├── careers/                <-- Job recruitment
    │   │   ├── page.tsx            <-- Open roles directory
    │   │   └── [slug]/page.tsx     <-- Position specification & application form
    │   ├── book/page.tsx           <-- Interactive 30-min consultation booking calendar
    │   ├── contact/page.tsx        <-- Dual-mode inquiry form (general vs project inquiry)
    │   ├── admin/page.tsx          <-- Password-protected CMS Backoffice Dashboard
    │   ├── cookies/page.tsx        <-- Cookie Policy & Preference Manager
    │   ├── privacy/page.tsx        <-- GDPR / Privacy notice
    │   ├── terms/page.tsx          <-- Terms of Service
    │   ├── thank-you/page.tsx      <-- Submission confirmation page
    │   └── api/                    <-- Backend API endpoints
    │       ├── admin/
    │       │   ├── auth/route.ts   <-- Admin cookie login/logout (Email + Bcrypt Password)
    │       │   ├── data/route.ts   <-- CRUD actions for CMS entities
    │       │   └── cv/[filename]/  <-- Protected binary streaming for applicant CVs
    │       ├── services/           <-- RESTful Services CRUD endpoints
    │       │   ├── route.ts        <-- GET (all) & POST (create service)
    │       │   └── [id]/route.ts   <-- GET (by id/slug), PUT (update), DELETE (remove)
    │       ├── media/              <-- Database Binary Image Vault
    │       │   ├── [id]/route.ts   <-- High-performance streaming with 1-year immutable cache
    │       │   └── upload/route.ts <-- Admin-authenticated binary buffer image upload
    │       ├── book/route.ts       <-- Lead capture for consultation scheduler
    │       ├── careers/apply/      <-- Multipart/form-data upload & CV parser
    │       ├── contact/route.ts    <-- Project & general inquiries handler
    │       └── newsletter/route.ts <-- Newsletter subscription handler
    ├── components/
    │   ├── Navbar.tsx              <-- Navigation with mobile menu & live booking CTA
    │   ├── Footer.tsx              <-- Editorial footer with legal & social links
    │   ├── CookieBanner.tsx        <-- GDPR compliance banner (Necessary vs Analytics)
    │   ├── EmailPopup.tsx          <-- Timed newsletter modal (Powered by centralized Axios)
    │   ├── admin/
    │   │   └── AdminDashboard.tsx  <-- Multi-tab CMS dashboard with dynamic Service Form & CRUD
    │   ├── booking/
    │   │   └── ConsultationScheduler.tsx <-- Booking interface (Powered by centralized Axios)
    │   ├── careers/
    │   │   └── JobApplicationForm.tsx    <-- CV upload with React Hook Form + Zod validation
    │   ├── contact/
    │   │   └── ContactFormHub.tsx        <-- Dual-mode contact form with React Hook Form + Zod
    │   └── ui/                     <-- Reusable UI primitives (Button, Card, Input, Textarea, Badge)
    ├── data/
    │   └── cms-store.json          <-- JSON store for remaining models (Services dummy data removed)
    └── lib/
        ├── api.ts                  <-- Centralized Axios client (`api`) & error unwrap helper
        ├── prisma.ts               <-- Safe Next.js singleton for PrismaClient + PgPool adapter
        ├── analytics.ts            <-- PII-sanitized client analytics dispatcher
        ├── utils.ts                <-- Tailwind class concatenation helper (cn)
        ├── auth/
        │   └── seedAdmin.ts        <-- Automated default admin user seeding utility
        ├── validations/
        │   ├── contact.ts          <-- Zod schemas for contact & project inquiries
        │   └── careers.ts          <-- Zod schemas for candidate job applications
        └── cms/
            ├── types.ts            <-- Full TypeScript contracts & interfaces
            ├── initialData.ts      <-- Default seed data (Services array empty / DB-driven)
            ├── storage.ts          <-- Private file system manager & validator for CVs
            └── store.ts            <-- Unified data access layer (Services read/write via PostgreSQL)
```

---

## 4. Key Data Entities (`prisma/schema.prisma`)

### 1. `User` (Admin Authentication)
- **Table:** `users`
- **Fields:** `id` (cuid), `email` (unique), `name`, `password` (Bcrypt hash), `role` (`ADMIN`), `createdAt`, `updatedAt`.
- **Default Seed:** `admin@launchcraft.agency` / `123`.

### 2. `Service` (Dynamic PostgreSQL CRUD)
- **Table:** `services`
- **Fields:** `id` (cuid), `slug` (unique), `title`, `icon`, `shortBenefit`, `heroHeadline`, `valueProp`, `whoItHelps[]`, `deliverables[]`, `workflowSteps` (JSON), `faqs` (JSON), `order` (Int), `status` (`published` | `draft`), `metaTitle`, `metaDescription`, `createdAt`, `updatedAt`.
- **Status:** Fully decoupled from static JSON; 100% dynamic CRUD via Admin Dashboard modal and REST APIs (`/api/services`).

### 3. `Project` (Dynamic PostgreSQL CRUD)
- **Table:** `projects`
- **Fields:** `id` (cuid), `slug` (unique), `title`, `client`, `industry`, `categories[]`, `heroImage`, `gallery[]`, `challenge`, `scope[]`, `approach`, `outcome`, `metrics` (JSON), `featured` (Boolean), `order` (Int), `status` (`published` | `draft`), `metaTitle`, `metaDescription`, `createdAt`, `updatedAt`.
- **Status:** Fully decoupled from static JSON; 100% dynamic CRUD via Admin Dashboard modal and REST APIs (`/api/projects`). Dummy data removed.

### 4. `Media` (In-Database Image Vault)
- **Table:** `media`
- **Fields:** `id` (cuid), `filename`, `mimeType`, `data` (`Bytes` / PostgreSQL `BYTEA`), `size` (Int), `altText`, `createdAt`, `updatedAt`.
- **Delivery:** `/api/media/[id]` with `Cache-Control: public, max-age=31536000, immutable`. Zero third-party storage fees or API keys.

### 5. Remaining Models (Careers, Leads, Settings)
- **`Job` & `Application`:** Careers specification and candidate CV records.
- **`Lead`:** Project inquiries and general consultation leads.
- **`Subscriber`:** Newsletter subscriptions.
- **`Setting`:** Key-value dynamic site configurations.

---

## 5. Security & Validation Architecture

1. **Password Hashing & Database Authentication:**
   - Admin credentials verified against PostgreSQL `users` table via `bcrypt.compare`.
   - Issues an `httpOnly`, `sameSite: strict`, `secure` session cookie (`launchcraft_admin_token`).
   - Automated seeder ensures default admin presence without manual SQL queries.

2. **Client-Side & Server-Side Form Validation:**
   - Powered by `react-hook-form` and `zod`.
   - Contact form validates minimum lengths, valid business email formats, and mandatory consent.
   - Careers form validates candidate credentials, optional portfolio URL formats, and file size limits.

3. **Centralized HTTP Client (`src/lib/api.ts`):**
   - Single source of truth for all frontend-to-backend communications.
   - Automatic response interceptors for uniform error handling.
   - Built-in request timeout protection (30s).

4. **Private CV Storage Sandbox:**
   - Stored in `/storage/private/cvs/` with randomized unique keys (`cv_<timestamp>_<rand>_<sanitized_name>.<ext>`).
   - Validated: Max 5 MB, strictly `.pdf` or `.docx`.
   - Access restricted to authenticated administrators via `/api/admin/cv/[filename]`.

5. **GDPR / Privacy Compliance:**
   - Explicit consent required for all interactive form submissions.
   - Built-in Cookie Consent Banner with granular toggle (`Necessary` vs `Analytics`).
   - Analytics events (`analytics.ts`) are completely blocked if user rejects cookies.

---

## 6. How to Maintain & Run

### Development & Build
```bash
npm run dev          # Starts Next.js on http://localhost:3000
npm run build        # Production Next.js Turbopack build
npm run start        # Starts production server
npm run lint         # Runs ESLint checks
```

### Database & Prisma Operations
```bash
npm run db:push      # Synchronizes prisma/schema.prisma directly with PostgreSQL
npm run db:migrate   # Runs development migrations
npm run db:generate  # Re-generates Prisma Client types
npm run db:studio    # Opens Prisma Studio web UI for visual database inspection
npm run db:seed      # Seeds default administrator credentials into database
```

### Admin Access
- **URL:** `/admin`
- **Default Email:** `admin@launchcraft.agency`
- **Default Password:** `123`

---

## 7. Next.js 16 Cache Components Conventions
- **Forbidden configs with `cacheComponents: true`:**
  - `export const dynamic = "..."` and `export const dynamicParams = ...` must NOT be exported in route segments.
  - `generateStaticParams()` must either return real items or be completely omitted on dynamic CMS-driven dynamic routes. When omitted, Next.js serves the route dynamically on-demand with request-time data fetching and returns `404` via `notFound()` if records don't exist.
- **External Images:** Configured in `next.config.ts` under `images.remotePatterns` for universal compatibility.

---

## 8. In-Database Media Vault Architecture
- **Storage:** Images stored directly as binary buffers (`BYTEA`) in PostgreSQL `Media` table via `prisma.media`.
- **Upload Route:** `POST /api/media/upload` receives `multipart/form-data`, validates MIME type & size (<10MB), converts to Buffer, and returns `{ url: "/api/media/[id]" }`.
- **Streaming Route:** `GET /api/media/[id]` streams the binary buffer with `Cache-Control: public, max-age=31536000, immutable`.
- **Admin Dashboard Integration:**
  - Dedicated **Media Vault** tab with drag-and-drop / multi-file upload, live gallery, copy URL, and deletion.
  - In Case Studies / Projects form: Direct **"Upload DB Image"** buttons for Hero Cover and Gallery images with live thumbnail previews and vault picker.
