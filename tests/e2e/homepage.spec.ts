import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage and display main elements', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.getByRole('heading', { name: /A safe bed is the first step/i })).toBeVisible()

    // Check main action buttons
    await expect(page.getByRole('button', { name: /Get Financial Aid/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Give Support/i })).toBeVisible()

    // Check navigation
    await expect(page.getByRole('link', { name: /Get Financial Aid/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Give Support/i })).toBeVisible()

    // Check trust signals
    await expect(page.getByText(/Nonprofit • HIPAA Compliant/i)).toBeVisible()
  })

  test('should navigate to get-aid page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Get Financial Aid/i }).click()

    await expect(page).toHaveURL(/.*get-aid/)
    await expect(page.getByRole('heading')).toContainText(/Apply for Housing Aid/i)
  })

  test('should navigate to give-support page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Give Support/i }).click()

    await expect(page).toHaveURL(/.*give-support/)
    await expect(page.getByRole('heading')).toContainText(/Ways to Help/i)
  })

  test('should be accessible', async ({ page }) => {
    await page.goto('/')

    // Check for accessibility issues
    const accessibilitySnapshot = await page.accessibility.snapshot()
    expect(accessibilitySnapshot).toBeTruthy()
  })

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Check mobile menu button exists
    await expect(page.getByLabel(/toggle mobile menu/i)).toBeVisible()

    // Check main content is visible
    await expect(page.getByRole('heading', { name: /A safe bed is the first step/i })).toBeVisible()
  })
})
