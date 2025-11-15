import { test, expect } from '@playwright/test'

test('partner outcome success page renders', async ({ page }) => {
  await page.goto('/partner-update/success')
  await expect(page.getByRole('heading', { name: 'Outcome Submitted' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Return to Home' })).toBeVisible()
})