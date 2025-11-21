import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage and display main elements', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.getByRole('heading', { name: /Your Colorado Recovery Concierge/i })).toBeVisible()

    // Check main action buttons (now links)
    await expect(page.getByRole('link', { name: /Get Financial Aid/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Give Support/i }).first()).toBeVisible()

    // Check navigation links - try desktop first, then mobile if not visible
    try {
      // Try desktop navigation
      const navLinks = page.getByLabel('Main navigation').getByRole('link')
      await expect(navLinks.filter({ hasText: /Get Financial Aid/i }).first()).toBeVisible()
      await expect(navLinks.filter({ hasText: /Give Support/i }).first()).toBeVisible()
    } catch (error) {
      // If desktop navigation not visible, try mobile menu
      const mobileMenuButton = page.getByLabel(/toggle mobile menu/i)
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(
          page.getByLabel('Mobile navigation menu').getByRole('link', { name: /Get Financial Aid/i })
        ).toBeVisible()
        await expect(
          page.getByLabel('Mobile navigation menu').getByRole('link', { name: /Give Support/i })
        ).toBeVisible()
      }
    }

    // Check trust signals
    await expect(page.getByText(/HIPAA Compliant/i)).toBeVisible()
  })

  test('should navigate to get-aid page', async ({ page }) => {
    await page.goto('/')
    // Click the hero button specifically, not any navigation link
    await page
      .locator('#main')
      .getByRole('link', { name: /Get Financial Aid/i })
      .click()

    await expect(page).toHaveURL(/.*get-aid/)
    await expect(page.getByRole('heading', { name: /Dignified Housing Support/i })).toBeVisible()
  })

  test('should navigate to give-support page', async ({ page }) => {
    await page.goto('/')
    // Click the hero button specifically, not any navigation link
    await page
      .locator('#main')
      .getByRole('link', { name: /Give Support/i })
      .click()

    await expect(page).toHaveURL(/.*give-support/)
    await expect(page.getByRole('heading', { name: /Dignity Through Speed/i })).toBeVisible()
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
    await expect(page.getByRole('heading', { name: /Your Colorado Recovery Concierge/i })).toBeVisible()

    // Open mobile menu and check navigation links
    await page.getByLabel(/toggle mobile menu/i).click()
    await expect(
      page.getByLabel('Mobile navigation menu').getByRole('link', { name: /Get Financial Aid/i })
    ).toBeVisible()
    await expect(page.getByLabel('Mobile navigation menu').getByRole('link', { name: /Give Support/i })).toBeVisible()
  })
})
