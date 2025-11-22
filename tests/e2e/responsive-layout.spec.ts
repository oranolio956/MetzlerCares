import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'mobile', size: { width: 390, height: 844 } },
  { name: 'tablet', size: { width: 1024, height: 1366 } },
  { name: 'desktop', size: { width: 1440, height: 900 } }
]

const captureSnapshots = process.env.RESPONSIVE_SNAPSHOTS === '1'

test.describe('Homepage responsive contract', () => {
  for (const viewport of viewports) {
    test(`renders mission-critical content on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport.size)
      await page.goto('/')

      // Stabilize gradients/motion before taking assertions or snapshots
      await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' })

      await expect(
        page.getByRole('heading', { name: /Recovery infrastructure built like mission control/i })
      ).toBeVisible()
      await expect(page.getByText('Signal Layer')).toBeVisible()
      await expect(page.getByText('Proof Layer')).toBeVisible()
      await expect(page.getByText('Every partner gets a telemetry report, not a testimonial.')).toBeVisible()

      if (captureSnapshots) {
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02
        })
      }
    })
  }
})
