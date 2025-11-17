import { test, expect } from '@playwright/test'

test('intake page renders and fields exist', async ({ page }) => {
  await page.goto('/get-aid/apply')
  await expect(page.getByRole('heading', { name: /Who We Can Help/i })).toBeVisible()
  await expect(page.locator('#eligibility')).toBeVisible()
  await expect(page.locator('#consent')).toBeVisible()
})
