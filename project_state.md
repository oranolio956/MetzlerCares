## Project State – MetzlerCares Frontend

### 1. Environment & Tooling Setup
- **Requirements**
  - Node.js 20.x (GitHub Actions uses 20 via `actions/setup-node@v4`)
  - npm 10+
  - Playwright browsers (`npx playwright install --with-deps chromium`)
  - Optional: Sanity/Supabase credentials once CMS wiring is completed
- **Bootstrap**
  ```bash
  cp .env.example .env            # fill in API keys as needed
  npm install
  npm run dev                     # start SvelteKit locally
  npm run storybook               # component previews
  npm run test:responsive         # Playwright responsive contract
  ```
- **Quality Gates**
  - `npm run check` (svelte-check + TS)
  - `npm run lint` (if enabled)
  - `npm run test:responsive` (set `RESPONSIVE_SNAPSHOTS=1` to record baselines)
  - Storybook build: `npm run storybook:build`
  - CI workflow: `.github/workflows/visual-regression.yml` runs Storybook build and responsive tests on PRs

### 2. Current Architecture Snapshot
- **Homepage Composition**
  - UI split into `src/lib/components/homepage/*.svelte`
  - Content owned by `src/lib/content/homepage.ts` (`HomepageContent` type + EN/ES data)
  - `src/routes/+page.server.ts` loads content (locale-aware) and passes to `+page.svelte`
    - Storybook story `src/stories/Homepage.stories.ts` hydrates with `getHomepageFixture('en')`
- **Design System**
  - Tailwind brand tokens (`brand-*`) and CSS variables in `src/app.css`
  - Self-hosted fonts via `@fontsource-variable/*`
- **Analytics**
  - `trackEvent` + `trackFormInteraction` in `src/lib/utils/analytics.ts`
  - Hero CTA, secondary CTA, outcomes CTA instrumented; more events pending (see TODO)
- **Testing**
  - Playwright spec `tests/e2e/responsive-layout.spec.ts`
  - Storybook for hero/credibility/blueprint/outcomes/CTA components + full page

### 3. Work Completed (since branch creation)
1. **Visual & Structural Overhaul**
   - Homepage extracted into dedicated components
   - Typography, background gradients, and glassmorphism polish implemented
   - Reduced motion & accessibility pass (focus-visible, semantic buttons, etc.)
2. **Content System**
   - `HomepageContent` type with hero/credibility/loops/pillars/outcomes/CTA data
   - EN + ES static datasets with outcome sources & footnotes
   - Locale-aware server load introduced
3. **Interaction & Analytics**
   - CTA/hero/outcome events tracked via `trackEvent`
   - Fly/staggered animations gated by `prefers-reduced-motion`
4. **Shared Iconography**
   - `src/lib/components/icons/IconSymbol.svelte` eliminates duplicated SVG markup
5. **Quality Gates**
   - Storybook args/controls documented for every homepage section
   - Visual regression GitHub Action added (Storybook build + responsive tests)
   - `premium/PremiumHero.svelte` selectors cleaned up to satisfy svelte-check

### 4. Remaining Tasks (ordered)
1. **CMS Integration**
   - Replace static `getHomepageContent()` with real Sanity or Supabase queries (existing clients in repo)
   - Validate data with Zod, provide fallbacks, and mock CMS data inside Storybook
2. **Localization & Internationalization**
   - Wire locale detection to CMS content (EN/ES parity); prep for future languages (RTL readiness)
   - Ensure chip/heading alignment responds to directionality
3. **Outcome Evidence Enhancements**
   - Extend `OutcomeStat` with optional `sourceLink`; render tooltips/footnotes
   - Provide per-stat info badges referencing audit context
4. **Hero Media & Brand Motion**
   - Add bespoke illustration or short looped video in hero (optimize via AVIF/WEBP or Lottie)
   - Respect `prefers-reduced-motion` for autoplay media
5. **Micro-interactions & A11y**
   - Add intersection-observer-driven reveals for credibility/blueprint cards
   - Enhance keyboard focus indicators; ensure analytics track these interactions
6. **Analytics Coverage**
   - Track credibility card interactions (`credibility_inspect`)
   - Track pillar hover/click (`pillar_expand`)
   - Track outcome tooltip opens (`outcome_context`)
7. **CI & Snapshot Hygiene**
   - Upload Playwright screenshots as artifacts in CI
   - Add scheduled job to refresh responsive snapshots nightly on main
   - Consider adding `npm run check` to the visual workflow for quicker feedback
8. **Documentation**
   - Update `docs/architecture.md` with CMS data flow + testing commands
   - Document new env vars required for CMS fetch in `.env.example`

### 5. How to Continue Development
1. **Sync & Branching**
   - `git checkout main`
   - `git pull origin main`
   - `git checkout -b feature/<descriptive-name>`
2. **Implement Tasks**
   - Follow order in “Remaining Tasks”
   - Keep changes modular; update Storybook mocks/tests alongside code
3. **Verify Locally**
   - `npm run check`
   - `npm run test:responsive` (add `RESPONSIVE_SNAPSHOTS=1` if visuals changed)
   - `npm run storybook:build`
4. **Commit & Push**
   ```bash
   git add <files>
   git commit -m "feat: <summary>"
   git push origin feature/<descriptive-name>
   ```
5. **Merge to Main**
   - Open PR targeting `main`
   - Ensure GitHub Actions visual workflow passes
   - After approval: `git checkout main && git pull && git merge feature/<name> && git push origin main`

### 6. Deployment / Verification
- Production deploys via the existing pipeline (Vercel/GitHub Actions—confirm with ops)
- After merge, monitor:
  - Storybook build artifacts in CI
  - Playwright screenshot comparisons
  - Analytics dashboards (CTA/hero events should appear)

### 7. Quick Reference Commands
| Purpose | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Type/svelte check | `npm run check` |
| Storybook (dev/build) | `npm run storybook` / `npm run storybook:build` |
| Playwright responsive test | `npm run test:responsive` |
| Record snapshots | `RESPONSIVE_SNAPSHOTS=1 npm run test:responsive -- --update-snapshots` |
| Visual CI workflow | `.github/workflows/visual-regression.yml` |

This document should give any contributor (or AI agent) full situational awareness to resume work, finish the remaining roadmap, and safely merge the branch into `main`.
