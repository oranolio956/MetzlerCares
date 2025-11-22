# MetzlerCares Frontend Quickstart

## Visual Regression & Responsive QA

Run Storybook and responsive Playwright tests locally before pushing UI changes:

```bash
npm install

# Storybook (live component preview)
npm run storybook

# Responsive contract tests (Chromium, Firefox, WebKit + mobile breakpoints)
npm run test:responsive

# Update stored snapshots when expected visuals change
RESPONSIVE_SNAPSHOTS=1 npm run test:responsive -- --update-snapshots
```

Storybook uses the real homepage fixture data, so it mirrors the CMS-backed layout without reaching out to Sanity. The responsive test bootstraps a production build (`npm run build && npm run preview`) before asserting mission-critical UI across viewports.
