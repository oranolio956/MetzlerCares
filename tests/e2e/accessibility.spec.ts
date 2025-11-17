import { test, expect } from '@playwright/test'

// Axe-core accessibility testing
test.describe('Accessibility Tests', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('get-aid page should have no accessibility violations', async ({ page }) => {
    await page.goto('/get-aid')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('give-support page should have no accessibility violations', async ({ page }) => {
    await page.goto('/give-support')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('impact page should have no accessibility violations', async ({ page }) => {
    await page.goto('/impact')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('partners page should have no accessibility violations', async ({ page }) => {
    await page.goto('/partners')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('privacy page should have no accessibility violations', async ({ page }) => {
    await page.goto('/privacy')
    
    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run()
    })
    
    // Check for violations
    expect(results.violations.length).toBe(0)
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check that h1 exists and is unique
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check that headings are in logical order
    const headings = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      return headings.map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent?.trim() || '',
        level: parseInt(h.tagName.substring(1))
      }))
    })
    
    // Check heading hierarchy
    let previousLevel = 0
    for (const heading of headings) {
      if (previousLevel > 0 && heading.level > previousLevel + 1) {
        throw new Error(`Heading hierarchy issue: ${heading.tag} follows h${previousLevel}`)
      }
      previousLevel = heading.level
    }
  })

  test('should have proper skip links', async ({ page }) => {
    await page.goto('/')
    
    // Check for skip link
    const skipLink = page.locator('a[href="#main"]')
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toHaveText('Skip to main content')
    
    // Check that main element exists
    const mainElement = page.locator('#main')
    await expect(mainElement).toBeVisible()
  })

  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/')
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()
    
    // Check for navigation landmarks
    const navigation = page.locator('nav, [role="navigation"]')
    await expect(navigation).toBeVisible()
    
    // Check for banner landmark (header)
    const banner = page.locator('header, [role="banner"]')
    await expect(banner).toBeVisible()
    
    // Check for contentinfo landmark (footer)
    const contentinfo = page.locator('footer, [role="contentinfo"]')
    await expect(contentinfo).toBeVisible()
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/get-aid/apply')
    
    // Check that all form inputs have labels
    const inputs = await page.locator('input, textarea, select').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const hasLabel = await page.locator(`label[for="${id}"]`).count() > 0 || 
                      await input.locator('..').locator('label').count() > 0
      
      if (!hasLabel && await input.getAttribute('type') !== 'hidden') {
        const inputType = await input.getAttribute('type') || 'unknown'
        throw new Error(`Input with type "${inputType}" is missing a label`)
      }
    }
  })

  test('should have proper image alt text', async ({ page }) => {
    await page.goto('/')
    
    // Check that all images have alt text
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')
      
      if (!alt || alt.trim() === '') {
        throw new Error(`Image with src "${src}" is missing alt text`)
      }
    }
  })

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('/')
    
    // Check that all buttons have accessible names
    const buttons = await page.locator('button').all()
    
    for (const button of buttons) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      
      if (!text?.trim() && !ariaLabel && !ariaLabelledBy) {
        throw new Error('Button is missing accessible name')
      }
    }
  })

  test('should have proper link text', async ({ page }) => {
    await page.goto('/')
    
    // Check that all links have meaningful text
    const links = await page.locator('a').all()
    
    for (const link of links) {
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const href = await link.getAttribute('href')
      
      const linkText = (text?.trim() || ariaLabel || '').toLowerCase()
      
      // Skip if it's just a fragment link or has meaningful text
      if (href === '#' || linkText.length > 3) {
        continue
      }
      
      // Check for common non-descriptive link text
      const nonDescriptiveTexts = ['click here', 'read more', 'more', 'here', 'link']
      if (nonDescriptiveTexts.includes(linkText)) {
        throw new Error(`Link with href "${href}" has non-descriptive text: "${text?.trim()}"`)
      }
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Inject axe-core for contrast testing
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    })
    
    // Run contrast-specific accessibility scan
    const results = await page.evaluate(async () => {
      return await (window as any).axe.run(document, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })
    
    // Filter for color contrast violations
    const contrastViolations = results.violations.filter(
      (violation: any) => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations.length).toBe(0)
    
    if (contrastViolations.length > 0) {
      console.log('Color contrast violations found:', contrastViolations)
    }
  })

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab through the page and ensure all interactive elements are reachable
    const tabbableElements = await page.evaluate(() => {
      const tabbable = Array.from(
        document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      )
      return tabbable.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || el.getAttribute('aria-label') || '',
        tabIndex: el.getAttribute('tabindex')
      }))
    })
    
    // Ensure we have tabbable elements
    expect(tabbableElements.length).toBeGreaterThan(0)
    
    // Tab through the first few elements to ensure focus is visible
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement
      return {
        tag: active?.tagName.toLowerCase(),
        text: active?.textContent?.trim() || active?.getAttribute('aria-label') || ''
      }
    })
    
    expect(focusedElement.tag).toBeTruthy()
  })
})