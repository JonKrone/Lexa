import { Page } from 'puppeteer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  getTranslationElements,
  loadContentScriptWithMocks,
  measureInjectionTime,
  Translation,
  waitForTimeout,
  waitForTranslations,
} from './harness'
import { createTestPage, getFixtureUrl } from './setup'

describe('CRXJS Docs E2E Tests', () => {
  let page: Page

  beforeEach(async () => {
    page = await createTestPage()
  })

  afterEach(async () => {
    await page.close()
  })

  it('should inject translations into the CRXJS docs page using the real content script', async () => {
    // Test translations for the CRXJS docs page
    const testTranslations: Translation[] = [
      {
        original: 'Content Scripts',
        translation: 'Scripts de Contenido',
        context: 'Page title referring to Chrome extension content scripts',
      },
      {
        original: 'host page',
        translation: 'página anfitriona',
        context: 'The page where the content script runs',
      },
      {
        original: 'Static Assets',
        translation: 'Recursos Estáticos',
        context: 'Section about importing static assets in content scripts',
      },
    ]

    // Navigate to the fixture page
    await page.goto(getFixtureUrl('crxjs-docs.html'))

    // Wait for page to load
    await page.waitForSelector('body')

    // Load content script with mocks - this will trigger the natural flow
    await loadContentScriptWithMocks(page, testTranslations)

    // Wait for translation elements to appear (natural flow takes time)
    await waitForTranslations(page, testTranslations.length, 10000)

    // Get all translation elements
    const elements = await getTranslationElements(page)

    // Verify we have the expected number of translations
    expect(elements.length).toBe(testTranslations.length)

    // Verify each translation
    for (const testTranslation of testTranslations) {
      const element = elements.find(
        (el) => el.original === testTranslation.original,
      )
      expect(element).toBeDefined()
      expect(element?.translation).toBe(testTranslation.translation)
      expect(element?.className).toContain('lexa-root-node')
    }
  })

  it('should not duplicate translations when content script runs multiple times', async () => {
    const testTranslations: Translation[] = [
      {
        original: 'host page',
        translation: 'página anfitriona',
        context: 'The page where the content script runs',
      },
    ]

    await page.goto(getFixtureUrl('crxjs-docs.html'))
    await page.waitForSelector('body')

    // Load content script first time
    await loadContentScriptWithMocks(page, testTranslations)
    await waitForTranslations(page, 1, 10000)

    // Load content script again (simulating extension reload)
    await loadContentScriptWithMocks(page, testTranslations)

    // Wait a bit for any potential duplicates to appear
    await waitForTimeout(page, 1000)

    const elements = await getTranslationElements(page)

    // Should still only have 1 translation, not duplicated
    expect(elements.length).toBe(1)
  })

  it('should inject translations within performance threshold', async () => {
    const testTranslations: Translation[] = [
      {
        original: 'Content Scripts',
        translation: 'Scripts de Contenido',
        context: 'Page title',
      },
      {
        original: 'host page',
        translation: 'página anfitriona',
        context: 'The page where the content script runs',
      },
    ]

    await page.goto(getFixtureUrl('crxjs-docs.html'))
    await page.waitForSelector('body')

    // Measure only the script injection time (excluding DOM polling)
    const injectionTime = await measureInjectionTime(page, () =>
      loadContentScriptWithMocks(page, testTranslations),
    )

    // Wait for translations to actually appear before asserting other tests
    await waitForTranslations(page, testTranslations.length, 10000)

    // Performance should be under 200ms as specified in the plan
    expect(injectionTime).toBeLessThan(200)
  })

  it('should handle dynamic DOM changes without breaking', async () => {
    const testTranslations: Translation[] = [
      {
        original: 'host page',
        translation: 'página anfitriona',
        context: 'The page where the content script runs',
      },
    ]

    await page.goto(getFixtureUrl('crxjs-docs.html'))
    await page.waitForSelector('body')

    // Load content script and wait for initial translations
    await loadContentScriptWithMocks(page, testTranslations)
    await waitForTranslations(page, 1, 10000)

    // Add dynamic content as specified in the test plan
    await page.evaluate(() => {
      const p = document.createElement('p')
      p.textContent = 'extra content with host page text'
      document.body.prepend(p)
    })

    // Wait for mutation observer to process changes
    await waitForTimeout(page, 1000)

    const elements = await getTranslationElements(page)

    // Should not have increased the count (de-duplication check)
    // The mutation observer should prevent duplicate processing
    expect(elements.length).toBe(1)
  })
})
