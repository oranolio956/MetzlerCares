import { test } from '@playwright/test'

test('homepage screenshot', async ({ page }, testInfo) => {
  await page.goto('/')
  const shot = await page.screenshot({ fullPage: true })
  await testInfo.attach('homepage.png', { body: shot, contentType: 'image/png' })
})

test('give-support screenshot', async ({ page }, testInfo) => {
  await page.goto('/give-support')
  const shot = await page.screenshot({ fullPage: true })
  await testInfo.attach('give-support.png', { body: shot, contentType: 'image/png' })
})

test('impact screenshot', async ({ page }, testInfo) => {
  await page.goto('/impact')
  const shot = await page.screenshot({ fullPage: true })
  await testInfo.attach('impact.png', { body: shot, contentType: 'image/png' })
})

test('resources directory screenshot', async ({ page }, testInfo) => {
  await page.goto('/resources/colorado')
  const shot = await page.screenshot({ fullPage: true })
  await testInfo.attach('resources-colorado.png', { body: shot, contentType: 'image/png' })
})

test('intake apply screenshot', async ({ page }, testInfo) => {
  await page.goto('/get-aid/apply')
  const shot = await page.screenshot({ fullPage: true })
  await testInfo.attach('get-aid-apply.png', { body: shot, contentType: 'image/png' })
})