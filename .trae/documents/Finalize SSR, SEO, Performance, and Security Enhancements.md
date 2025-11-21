## Objectives

- Complete SSR migrations for any remaining client-side data fetching
- Strengthen technical SEO (structured data, sitemap coverage, link previews)
- Optimize performance (images, caching, hydration)
- Harden security and observability (logging, edge functions usage)

## Phase 1: SSR & Data Loading

- Audit routes still using `onMount`/browser Supabase
- Migrate donor dashboard to `+page.server.ts` using `locals.supabase`
- Ensure all server loads/actions use `locals.getSession()` and enforce roles

## Phase 2: SEO Enhancements

- Extend structured data:
  - Impact page: `WebPage` schema with organization association
  - Resources: confirm `Article` JSON-LD completeness for pillar/cluster
- Expand sitemap to include any additional dynamic routes (partners, resources variations)
- Confirm canonical URLs on all pages; ensure duplicate paths resolve to canonical

## Phase 3: Performance Optimizations

- Image optimization:
  - Use responsive `srcset/sizes` (completed on resources) across any other media-heavy pages
  - Optional: low-quality placeholder blurs for large hero images (no external libs)
- Caching:
  - Add `Cache-Control` headers to public pages (impact, homepage done), extend to partners/resources listing
  - Evaluate ETag on API-like endpoints for better client caching
- Hydration:
  - Confirm SSR data hydration across dashboards reduces TTI; remove spinners where not needed

## Phase 4: Security & Observability

- Edge functions:
  - Apply structured logging via `logger` in functions with sensitive flows
  - Enforce token checks consistently (done on intake workflow), review others
- Storage policies:
  - Validate `private-verifications` bucket policies align with staff-only access patterns
- Rate limiting:
  - Add lightweight request throttling on sensitive server actions (approve/deny/disburse)

## Phase 5: Internal Linking & UX

- Add breadcrumbs to partner/resources listings and cluster pages (resources breadcrumbs added)
- Improve cross-links between impact and donate flows

## Verification & QA

- Run `npm run check` and lint before/after each change
- Manual verification: user journeys (apply, staff approve/deny/disburse, donor dashboard)
- Lighthouse audits on homepage/resources/impact to capture CWV improvements

## Deliverables

- Updated server loads/actions for all affected routes
- SEO metadata and JSON-LD extensions
- Performance changes (images, caching)
- Security logging and checks
- QA report with metrics and follow-up tasks
