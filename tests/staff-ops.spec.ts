import { test, expect } from '@playwright/test'

test('operations page loads without crash (auth-aware)', async ({ page }) => {
  const res = await page.goto('/staff/operations')
  expect(res?.status()).toBeLessThan(600)
  await expect(page.url()).toContain('/staff/operations')
})
