import { test, expect } from '@playwright/test'

test('homepage triage buttons', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'A safe bed is the first step.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Get Financial Aid' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Give Support' })).toBeVisible()
})
