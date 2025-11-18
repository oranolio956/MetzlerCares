import { test, expect } from '@playwright/test'

test('footer has legal links', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  await expect(footer.getByRole('link', { name: 'Privacy' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Terms' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Cookie Policy' })).toBeVisible()
})

test('homepage shows HIPAA compliance as trust indicator', async ({ page }) => {
  await page.goto('/')
  // HIPAA compliance is displayed as a trust indicator in the current design
  await expect(page.getByText('HIPAA Compliant')).toBeVisible()
})

test('CMP opens and saves preferences', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cookie Preferences' }).click()
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' })
  await expect(dialog).toBeVisible()
  await page.getByLabel('Allow analytics cookies').check()
  await page.getByLabel('Allow marketing cookies').uncheck()
  await page.getByRole('button', { name: 'Save preferences' }).click()
  const cookies = await page.context().cookies()
  expect(cookies.some(c => c.name === 'cmp-consent')).toBeTruthy()
})

test('impact shows chart or clear state', async ({ page }) => {
  await page.goto('/impact')
  const canvas = page.locator('canvas[aria-label="Program vs Administrative donut chart"]')
  const error = page.getByRole('alert')
  const hasCanvas = await canvas.count()
  const hasError = await error.count()
  expect(hasCanvas + hasError).toBeGreaterThan(0)
})