## Scope and Findings

- Site structure covers beneficiaries, donors, partners, staff, resources, impact and health endpoints; strong SSR adoption is underway.

- Security: some edge functions still parse JWTs naively; CSP/security headers not enforced globally; rate-limiting and abuse controls are missing.

- Performance/SEO: image srcset used inconsistently; some client-only fetch patterns remain; sitemap/canonical coverage good but resources listing needs richer metadata and internal links; minor svelte-check warnings.

- UX/Accessibility: consistent "Grounded Hope" palette largely adhered to; beneficiary flow accessible but needs better keyboard/focus, aria and error states; partner outcome page improved but can add resend flow; donate embed can be hardened.

- Observability: structured logging added to several functions; unify across all edge functions and staff actions.

- Staff dashboards: operations and queue SSR added; outcomes analytics added; export/filter views, charting and audit logs remain desirable.

## Implementation Plan

### Phase 1: Security Hardening

1. Standardize JWT across edge functions using `djwt` (verify/sign) for:

   - `submit-outcome-update` (verify currently naive)

   - `generate-partner-update-token` (sign currently custom)

2. Add global security headers via `hooks.server.ts`:

   - `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`

3. Add rate-limits and abuse controls:

   - Lightweight in-function throttles for public endpoints (verify/submit/update, health)

   - Optional IP-based buckets leveraging Supabase Edge Runtime KV or Postgres counters

4. CSRF protection for critical POST forms (intake, partner application) with double-submit token pattern.

### Phase 2: Performance/SEO

1. Image optimization

   - Audit all `img` tags to ensure `srcset/sizes`, lazy-loading and decoding="async" are consistent

   - Add responsive helpers to hero images across donor/beneficiary pages

2. Fonts & critical rendering

   - Preload font CSS and set `font-display: swap`; consolidate preconnects

3. Resources SEO hub

   - Enrich resources directory cards with schema.org `Organization` microdata

   - Add internal links from cluster pages back to pillar and lateral clusters

   - Fix remaining svelte-check warnings (line-clamp standard property)

4. Sitemap expansion

   - Ensure resources/pillar/cluster entries included and lastmod populated from Sanity

### Phase 3: UX & Accessibility

1. Beneficiary intake

   - Add keyboard/focus management between steps, aria-live for errors/success

   - Improve error messages, field-level validations and helper text

2. Partner portal

   - Add “Resend link” flow: small form to request a fresh token for an outcome (calls `generate-partner-update-token`)

   - Add confirmation receipt email trigger (non-PHI) via webhook

3. Donate page

   - Harden Donorbox embed: iframe title, `sandbox` attributes where supported, accessible loading states

4. Global navigation

   - Confirm consistent header/footer on all public pages; add skip-links and focus ring consistency

### Phase 4: Staff Dashboards

1. Operations dashboard

   - Charts: line/bar charts for outcomes by interval; donut for completed-by-metric

   - Filters: date range, interval, metric; CSV export

2. Queue/disbursement

   - Add bulk actions and audit-log view (who approved, when); structured logs on actions

3. Outcomes log

   - Tabbed table listing outcomes with filters; quick stats and export

### Phase 5: Observability & Reliability

1. Structured JSON logging everywhere (edge functions, server actions), with request IDs
2. Health/status

   - Expand `/health` to check DB, Sanity, functions reachability; return structured JSON

3. Error boundaries

   - Friendly 404/500 pages and capture to logs

### Phase 6: Testing & QA

1. Playwright E2E

   - Smoke: homepage triage, give-support, donate load

   - Beneficiary intake: 3-step submit with automated verification mocked

   - Partner outcome: verify token, submit metric, success page

   - Staff ops: role gate, SSR data render, filters

2. Contract tests for edge functions (verify, submit outcome, token generation)
3. Lighthouse/perf budgets on key pages (home, impact, give-support, resources)

## Task List (High-Level)

- Security: djwt everywhere; CSP; rate-limits; CSRF

- Performance/SEO: images, fonts, resources metadata, sitemap

- UX/Accessibility: intake aria/focus/errors; partner resend; donate embed hardening; nav/skip-links

- Staff: charts, filters, export, audit logs; outcomes log tab

- Observability: unified logging; enhanced health; 404/500

- Testing: E2E flows; edge function contracts; Lighthouse budgets

## Execution Order

1. Security Hardening → 2) Performance/SEO → 3) UX/Accessibility → 4) Staff Dashboards → 5) Observability → 6) Testing

## Acceptance Criteria

- All public/staff pages pass svelte-check with 0 errors; perf budgets met

- Edge functions use proper JWT sign/verify; rate-limits active; headers applied

- Intake and partner flows accessible (focus/aria), resilient error states

- Staff dashboards provide charts, filters and exports; outcomes tab present

- Health/status returns green across dependencies; logs consistent across services

- E2E tests green; Lighthouse scores improved on target pages
