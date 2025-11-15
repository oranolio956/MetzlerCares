## Goals
- Retrieve and serve the “Website Audit and Improvement Plan” PDF from the correct storage.
- Verify file accessibility, completeness, and formatting.
- Execute performance/accessibility audits and implement improvements aligned with repo patterns.

## Phase 1: Locate/Ingest PDF
- Check Supabase Storage buckets (likely source based on current code usage) and identify object path.
- If not present, upload the PDF to a dedicated bucket (e.g., `public-docs`) with appropriate ACLs.
- Record canonical path or set up a server-side proxy endpoint for controlled access.

## Phase 2: Public Access Route
- Create a server endpoint to serve the PDF at `GET /audit/plan.pdf` that:
  - Streams the file from Supabase Storage or redirects via a signed URL.
  - Sets `Content-Type: application/pdf` and caching headers.
- Add a navigation link to the site header pointing to `/audit/plan.pdf`.
  - Header file reference: `src/routes/resources/[slug]/+page.svelte:150`.

## Phase 3: Verification
- Confirm the endpoint returns 200, correct MIME type, and non-zero size.
- Open via the preview server and validate render in-browser.
- Add a simple Playwright test that fetches `/audit/plan.pdf` and asserts headers and size.

## Phase 4: Run Audits
- Use existing Lighthouse CI config (`lighthouse.config.js`, `lighthouse-budgets.json`) and run against preview.
  - Script available: `npm run perf:audit` (`package.json:14`).
- Store the generated Lighthouse report artifact for review (local `./.lighthouseci/` or `./reports/`).

## Phase 5: Implement Improvements
- Performance
  - Ensure image sizes and `srcset` are consistent (already present in `+page.svelte:214–223, 240–248`).
  - Verify caching headers on content pages (`src/routes/resources/[slug]/+page.server.ts:5–9`).
  - Add preconnect hints for critical third-parties (Supabase, Sanity) where beneficial.
  - Review bundle size vs Lighthouse budgets and trim unused code.
- Accessibility
  - Validate heading structure and TOC anchors (`+page.svelte:304–308, 193–205`).
  - Add skip-to-content link and ensure focus management for SPA navigation.
  - Contrast check pass; adjust Tailwind tokens if needed.
- SEO
  - Confirm structured data (`+page.svelte:65–121`) and canonical tags.
  - Ensure meta descriptions and keywords are set from CMS props.

## Phase 6: Monitoring
- Extend `/health` to check Storage availability for the PDF (`src/routes/health/+server.ts`).
- Optional: log access events for the PDF via Supabase (simple insert to `audit_logs`).

## Deliverables
- Working `/audit/plan.pdf` endpoint and header link.
- Verified PDF accessibility and formatting.
- Lighthouse report with noted issues and a prioritized fix list.
- Implemented performance, accessibility, and SEO improvements with measurable gains.

Please confirm the storage location (Supabase bucket/object path or alternative). Once confirmed, I will implement the plan immediately.