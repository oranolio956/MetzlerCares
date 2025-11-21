## Domain Setup (Vercel)

1. Add `metzlercares.com` to the Vercel project (`metzlercares`).
2. Choose DNS approach:
   - Keep current registrar DNS: set `A` for apex to `76.76.21.21` and `CNAME` `www` → `cname.vercel-dns.com`.
   - Or migrate nameservers to Vercel for auto-DNS.
3. Enforce HTTPS and redirects:
   - Redirect `www.metzlercares.com` → `metzlercares.com`.
   - Add domain to the Production environment in Vercel and set as primary.
4. Verify with Vercel’s certificate provisioning and DNS health checks.

## Design System Refinement

1. Typography: lock a clear hierarchy and tighten line-height/letter-spacing for readability.
2. Color discipline: sage/deep‑navy only; no gold accents; confirm contrast ≥ 4.5:1.
3. Components: finalize button, card, form, badge variants; remove hover‑lift globally.
4. Navigation: compact header, reduced shadows, predictable active states.

## Page‑by‑Page Cleanup Backlog

1. Beneficiary flows:
   - `get-aid/+page.svelte`, `app/apply`, `app/success`, `app/dashboard`: unify CTAs, remove hover‑lift, apply sage focus rings.
2. Donor flows:
   - `donor-dashboard`: align cards/forms/buttons to sage/deep‑navy, remove template tiles.
3. Staff flows:
   - `staff-dashboard`, `application/[id]`: ensure KPI cards, badges, progress bars use sage palette and no gold.
4. Partners:
   - `partners/+page.svelte`: remove badge bubbles, simplify trust copy.
5. Auth:
   - `auth/login`: clean form inputs, focus rings, accessible copy.

## Content & Editorial

1. Stories:
   - Use Sanity `impactStory` for featured story; add 3–5 real stories with consent and de‑identification.
   - Pair each story with live metrics sentence (already done for featured).
2. Metrics:
   - Keep Supabase as source of truth; add editorial summaries in Sanity for contextual copy.
3. Photography guidelines: consistent, real, no stock bubbles; caption with context.

## Accessibility & UX

1. Headings structure across pages; skip-link; focus-visible everywhere.
2. Form labels/help text; clear error states; ARIA for status messages.
3. Minimal microinteractions; remove unnecessary transitions; predictable tab order.

## Performance & Observability

1. Image optimization via Sanity URL params; lazy loading and sizes verified.
2. Prefetch key routes; audit bundle size; Lighthouse ≥ 90 on Performance/Accessibility/SEO.
3. Add Analytics (Vercel Analytics or Plausible) and error logging for server routes.

## Compliance & Trust

1. HIPAA/42 CFR Part 2: ensure de‑identified stories; explicit consent tracking; minimal necessary data.
2. Trust copy: clean, factual compliance notes (not badge bubbles); financials link preserved.

## Suggestions to Better Fit Your Vision

- Editorial tone: precise, empathetic, free of generic marketing.
- Visual restraint: flat design, minimal shadows, typography and white space carry the aesthetic.
- Real data integrity: avoid placeholders; prioritize actual KPIs; avoid AI‑generated sections.
- Journey clarity: beneficiary apply → approval; donor monthly emphasis; staff ops tasks.

## Items Missed / Improvements

- Remaining pages not yet refactored (beneficiary/donor/staff/auth) need the same design system pass.
- Add domain + redirect and verify SSL.
- Add analytics, QA E2E tests for core flows; SEO fine‑tuning (titles/meta/canonical consistency).

## Execution Phases

- Phase 1: Domain config and HTTPS/redirects.
- Phase 2: Design system pass across remaining routes.
- Phase 3: Accessibility/performance/analytics.
- Phase 4: Editorial content (stories, copy) and compliance checks.
- Phase 5: QA (Playwright), Lighthouse, deploy.

Confirm, and I will implement the domain pointing and proceed through these phases end‑to‑end.
