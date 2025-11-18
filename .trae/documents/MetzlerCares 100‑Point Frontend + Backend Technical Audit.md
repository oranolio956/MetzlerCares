## Objectives

* Eliminate 500 errors across all API routes and pages

* Build and run the site reliably in preview mode

* Execute comprehensive Playwright E2E and accessibility checks

* Capture a homepage screenshot after successful verification

## Findings (Read‑Only Audit)

* Playwright setup at `playwright.config.ts` with `testDir: tests/e2e` and `baseURL: http://localhost:4173`

* API routes include `src/routes/api/insurance/verify/+server.ts` and several others (`facilities`, `analytics/track`, `seo/*`, `health`, `sitemap.xml`, staff CSV routes)

* No `error(500)` usage; handlers return `json(..., { status: 500 })`

* Insurance verify handler has a critical bug: in `catch` it calls `await request.json()` again to read the body, which is already consumed, likely causing internal errors and masking the intended 500 response

## Implementation Plan

### Phase 1: Baseline & Config

* Ensure `playwright.config.ts` uses `webServer` pointing to SvelteKit preview on port `4173` and `use.baseURL` is `http://localhost:4173`

* Validate Tailwind plugins (`@tailwindcss/forms`, `@tailwindcss/typography`) and Svelte config (`vitePreprocess`) are present

* Verify environment variables used (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `VITE_*`) are optional and null‑safe in server code

### Phase 2: API Hardening

* Fix `src/routes/api/insurance/verify/+server.ts` to parse the request body once and reuse fields; remove re‑parsing in `catch`

* Add defensive guards around Supabase calls (handle `{ error }` response, avoid `single()` throws)

* Standardize error responses with consistent shape: `{ ok: false, error, message }` and appropriate status codes

* Review other `+server.ts` files for similar patterns (double body reads, unhandled promise rejections) and patch as needed

### Phase 3: Build & Preview

* Run `npm run build` to surface compile/runtime issues

* Start `npm run preview` on `4173`; verify server readiness

### Phase 4: E2E Route Health

* Create Playwright tests to visit key pages and assert `200` and no console errors:

  * `/`, `/get-aid`, `/give-support`, `/impact`, `/partners`, `/privacy`, `/(staff)/staff-dashboard`, `/sitemap.xml`

* Add network assertions: no failed requests, no `500` responses

### Phase 5: API Contract Tests

* Use Playwright `request` to POST realistic payloads to:

  * `/api/insurance/verify`

  * `/api/facilities`

  * `/api/analytics/track`

  * `/api/seo/*` endpoints

* Assert status codes, response shapes, and caching behavior; specifically validate error handling returns JSON with `{ status: 500 }` without throwing

### Phase 6: Accessibility

* Run axe‑core checks on main templates; assert zero critical violations and acceptable contrast

### Phase 7: Screenshot & Report

* After all tests pass and preview is healthy, capture a full‑page screenshot of `/` and attach as proof

* Provide a concise test summary: passed counts, any non‑blocking warnings, and the screenshot

## Deliverables

* Patches to `+server.ts` files (at minimum `api/insurance/verify`) fixing error handling

* Updated or added Playwright tests covering routes and APIs

* Successful build and preview run

* Final screenshot of homepage

## Rollback & Safety

* Keep changes scoped and atomic per file; avoid global refactors

* If any test failures remain, isolate by endpoint/page and provide targeted fixes

## Next Step

* Proceed to implement the plan end‑to‑end, run the suite, and produce the screenshot. Please confirm to exit plan mode and resume autonomous execution.

