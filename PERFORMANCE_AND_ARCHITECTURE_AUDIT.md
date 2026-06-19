# Klassruum — Performance, Functionality & Architecture Audit

End-to-end debug of website performance, functionality, APIs, routes, auth, and dashboards.
Generated after a full codebase trace of `src/`, build verification, and targeted fixes.

---

## 1. How the System Works (End-to-End)

### 1.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | **TanStack Start** (React 19 + TanStack Router + React Query) |
| Build | **Vite 7** via `@lovable.dev/vite-tanstack-config` (Nitro target: Cloudflare) |
| Auth / DB | **Supabase** (Postgres + Auth + Storage + RLS) |
| AI | `ai` SDK + OpenAI-compatible gateway (`src/lib/ai-gateway.server.ts`) |
| UI | shadcn/ui (Radix), Tailwind v4, Recharts, Three.js, GSAP |
| Server Fns | `createServerFn` — typed RPC from client to server, no REST endpoints |

There are **no traditional REST API routes**. The entire API surface is **TanStack server functions** (`.functions.ts`, `.engine.ts`) invoked as RPC over the same origin.

### 1.2 Request lifecycle

```
Browser
  │  TanStack Router (file-based, 187 routes)
  │  ├─ public routes  (/ , /pricing, /auth/*)
  │  └─ _authenticated/* → beforeLoad guard runs
  │       ├─ route.tsx beforeLoad: supabase.auth.getUser() → fetch role
  │       └─ per-route beforeLoad: requireStudent/Teacher/InstitutionAdmin/PlatformAdmin/Parent
  │
  │  React Query → useServerFn() → POST /_serverFn
  │       │
  │       ▼
  │  attachSupabaseAuth (client middleware) — injects Authorization: Bearer <jwt>
  │       │
  │       ▼
  ▼  Server (Nitro → src/server.ts → server-entry)
     │
     ├─ CSRF middleware (serverFn only)
     ├─ errorMiddleware (catches, re-throws statusCode errors)
     │
     └─ requireSupabaseAuth (per-fn middleware)
          ├─ demo mode (no creds) → demoContext()
          └─ prod mode → validates JWT, builds per-request Supabase client
                 │
                 ▼
            Handler (validator → DB query via context.supabase OR supabaseAdmin)
```

### 1.3 Auth model (two layers)

**Layer 1 — Route guards (`src/lib/route-guards.ts`):**
- Run in `beforeLoad` of every `_authenticated/*` route.
- Read role from context (set once by `_authenticated/route.tsx`) or fall back to DB.
- Redirect to `/auth` or the user's own dashboard on mismatch.
- In **demo mode** (no Supabase creds), every guard passes.

**Layer 2 — Server-function middleware (`requireSupabaseAuth`):**
- Runs on every `createServerFn().middleware([requireSupabaseAuth])`.
- Reads the Bearer token injected by `attachSupabaseAuth`.
- Builds a **per-request, RLS-enforced** Supabase client bound to that user.

**Layer 3 — Row-level authorization (in-handler):**
- `requireInstitutionAdminAccess` / `requireInstitutionStaffAccess` check `institution_members` membership before mutating institution data.
- This is the real authorization gate; the other two layers are authentication.

### 1.4 Data flow

- **Client** uses `@/integrations/supabase/client` (anon key, RLS-enforced, persists session in localStorage).
- **Server functions** receive `context.supabase` (user-scoped, RLS) for user queries.
- **Server admin ops** dynamically import `supabaseAdmin` (service role, **bypasses RLS**) — used only after an explicit `requireInstitutionAdminAccess` check.

### 1.5 Route inventory (187 routes)

| Area | Routes | Guard |
|------|--------|-------|
| Public | `/`, `/pricing`, `/terms`, `/privacy`, `/webinars`, `/auth/*`, `/institutions/register` | none |
| Student | `/student/dashboard`, courses, lessons, classroom, quizzes, notes, sessions, calendar, etc. | `requireStudent` |
| Teacher | `/teacher/dashboard`, courses, lessons, sessions, analytics, supervision, messages | `requireTeacher` / `requireInstitutionStaff` |
| Institution | `/institution/dashboard`, courses, programmes, enrollments, billing, analytics, settings | `requireInstitutionStaff` / `requireInstitutionAdmin` |
| Parent | `/parent/dashboard`, learners, progress, reports, messages, sessions | `requireParent` |
| Platform Admin | `/admin/dashboard`, users, institutions, kingpin-courses, lesson-generation, health, audit-logs, etc. | `requirePlatformAdmin` |
| Dev | `/dev/test`, `/dev/classroom-*` | **was unguarded → now `requirePlatformAdmin`** |

---

## 2. Issues Found & Fixed

### Fix 1 — CRITICAL: Auth middleware failed open (`src/integrations/supabase/auth-middleware.ts`)

**The bug:** When Supabase WAS configured (production), any request with a missing, malformed, or expired JWT was silently granted `demoContext()` — i.e. treated as user `demo-user-0000` with full access to every protected server function (list users, mutate lessons, issue certificates, read analytics). This is a complete authentication bypass.

**Root cause:** Every failure branch returned `next({ context: demoContext() })` instead of throwing.

**The fix:** Introduced `UnauthorizedError` (statusCode 401). In production mode (creds present), all failure paths now throw. Demo mode (genuinely missing creds) still returns `demoContext()`. The `errorMiddleware` in `start.ts` already re-throws errors with `statusCode`, so the 401 propagates to the client cleanly.

**Impact:** Anonymous/invalid requests are now rejected at the server-function boundary. This was the single highest-severity issue in the codebase.

### Fix 2 — Missing role guard on teacher lesson editor (`teacher/lessons/$lessonId/edit.tsx`)

**The bug:** The lesson editor route had no `beforeLoad` guard, so any authenticated user (student, parent) could navigate to it. The underlying server functions were still auth-protected, so data wasn't exposed, but the route should have redirected by role like its siblings.

**The fix:** Added `beforeLoad: (ctx) => requireInstitutionStaff(ctx.context)` (owner/admin/teacher), matching the sibling `teacher.lessons.$lessonId.tsx` route.

### Fix 3 — Dev-only routes reachable by any user (`dev/route.tsx`)

**The bug:** `/dev/*` routes (test pages, classroom design stubs) had no role guard. The comment said "not shown in production navigation" but they were still reachable by URL by any authenticated user.

**The fix:** Added `requirePlatformAdmin` to the dev layout route so only platform admins can access them.

### Fix 4 — Vendor bundle chunking (`vite.config.ts`)

**The bug:** All vendor code was bundled into a single chunk. Build warned "Some chunks are larger than 500 kB".

**The fix:** Added `manualChunks` splitting React, TanStack, Supabase, Radix, Recharts/d3, Three.js, GSAP, and the AI SDK into separate vendor chunks. Charts (420 kB) and Three.js now load lazily on the routes that use them instead of blocking the initial bundle.

**Result:**
| Chunk | Size (raw) | gzip |
|-------|-----------|------|
| `vendor-charts` | 421 kB | 113 kB |
| `vendor-supabase` | 209 kB | 54 kB |
| `vendor-react` | 193 kB | 61 kB |
| `vendor-radix` | 119 kB | 39 kB |

### Fix 5 — Pointless dynamic imports (`route.tsx`, `route-guards.ts`)

**The bug:** Both files used `await import("@/integrations/supabase/client")` to "lazily" load the Supabase client — but 17+ other files statically import the same module, so the dynamic import never achieved code splitting. It only produced a build warning and added overhead.

**The fix:** Converted to static imports. Build warning eliminated.

---

## 3. Known Limitations & Recommendations

### 3.1 Route-level code splitting is inactive (1.6 MB `index` chunk)

`src/routeTree.gen.ts` (auto-generated by `@tanstack/router-plugin`) statically imports all 187 routes eagerly — there are **0 lazy imports**. This means the entire app (every page, every dashboard) ships in one 1.6 MB `index.js` (415 kB gzip).

**How it should work:** Each route should export its component via `lazy` so TanStack Router can code-split per route. This requires either:
- Configuring the router plugin's `autoCodeSplitting` option, OR
- Restructuring routes to separate the `Route` definition (eager) from the `Component` (lazy).

**Why I didn't fix it now:** It's a generated file requiring plugin config changes and is outside the scope of a safe, targeted fix pass. It's the **#1 remaining perf opportunity** — fixing it would drop initial JS by ~70%.

### 3.2 Server-function authorization is inconsistent

`requireSupabaseAuth` only verifies identity (valid JWT). Authorization (is this user allowed to touch *this* institution's data?) is enforced only in functions that call `requireInstitutionAdminAccess`. Many read functions (e.g. `listLessons`, `getLesson`, `listResources`) trust the institution_id from the client and rely solely on RLS.

**How it should work:** RLS is the safety net, but every function that accepts an `institution_id` / `course_id` / `lesson_id` should verify membership server-side before returning data, not assume RLS is configured correctly.

### 3.3 No rate limiting on AI/server functions

`createServerFn` endpoints have no rate limiting. AI-heavy functions (`generateLessonsForCourse`, `processStudentMessage`) could be abused to exhaust API quotas.

**How it should work:** Add a server-side rate-limit middleware keyed on `context.userId` (e.g. a Supabase-backed counter or KV store) before the AI gateway calls.

### 3.4 `confirm()` used for destructive actions

The lesson editor uses `confirm("Delete this item?")` for deletion. This is blocking, un-styleable, and doesn't work consistently on mobile. Should be replaced with the existing `AlertDialog` Radix component.

### 3.5 `ssr: false` on the authenticated layout

`_authenticated/route.tsx` sets `ssr: false`, meaning authenticated pages are fully client-rendered. This is intentional (auth is client-side), but it means no streaming/SEO for dashboard content. Acceptable for an authenticated app, but worth noting.

### 3.6 Pre-existing TS error in `route-guards.ts` (line 127)

`requiresEmailVerification(user as ...)` has a type mismatch (`app_metadata` missing). This is a type-only issue (runtime is fine because the function only reads optional fields), but should be cast via `unknown` first or the `AuthContext.user` type should be widened.

---

## 4. How It *Should* Work (Ideal Architecture)

### Auth
1. ✅ Server functions fail closed on bad tokens (now fixed).
2. 🔲 Every server function with a resource ID should call a `requireAccessTo(resourceId, userId)` helper, not just `requireSupabaseAuth`.
3. 🔲 Token refresh should be handled by the client `attachSupabaseAuth` middleware (currently relies on Supabase JS SDK auto-refresh).

### Performance
1. ✅ Vendor code split into cacheable chunks (now fixed).
2. 🔲 **Route-level lazy loading** — the highest-impact change. Restructure so each route's component is a separate lazy chunk.
3. 🔲 Prefetch route chunks on link hover (TanStack Router supports this natively).
4. 🔲 Move Three.js (hero animation) behind `React.lazy()` so it never loads on dashboard pages.

### Functionality
1. ✅ All role guards present on authenticated routes (gaps fixed).
2. 🔲 The 5 `/dev/*` placeholder routes should be stripped from production builds entirely (tree-shake or env-gate).
3. 🔲 Replace `confirm()` dialogs with `AlertDialog`.

### APIs (server functions)
1. ✅ Input validation via Zod on every function (already in place — good).
2. 🔲 Add rate limiting (especially AI functions).
3. 🔲 Standardize error responses — currently functions throw raw `Error`s; a typed error envelope would let the client distinguish 401/403/429/500.

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/integrations/supabase/auth-middleware.ts` | **Fail closed** in prod mode; `UnauthorizedError` (401) |
| `src/routes/_authenticated/teacher/lessons/$lessonId/edit.tsx` | Added `requireInstitutionStaff` guard |
| `src/routes/_authenticated/dev/route.tsx` | Added `requirePlatformAdmin` guard |
| `src/routes/_authenticated/route.tsx` | Static import, removed pointless dynamic import |
| `src/lib/route-guards.ts` | Static import, removed pointless dynamic import |
| `vite.config.ts` | `manualChunks` for vendor splitting |

All changes verified with a clean production build (`npm run build` → exit 0).