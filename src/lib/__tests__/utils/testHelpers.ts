import { expect } from 'vitest'
import { ITranslation } from '../../../ai/generatePageTranslations'
import { LEXA_ROOT_CLASS } from '../../../components/Lexa/mountLexaRoot'
import { createTestDOM } from './mockDOM'

/**
 * Creates a test scenario with DOM and translations
 */
export function createTestScenario(html: string, translations: ITranslation[]) {
  const container = createTestDOM(html)
  return { container, translations }
}

/**
 * Asserts that text was correctly replaced
 */
export function expectTextReplaced(
  container: Element,
  originalText: string,
  expectedTranslation: string,
) {
  const lexaElements = Array.from(
    container.querySelectorAll(`.${LEXA_ROOT_CLASS}`),
  ) as HTMLElement[]
  const element = lexaElements.find(
    (el) => el.dataset.originalText === originalText,
  )

  expect(element).toBeTruthy()
  expect(element?.textContent).toBe(expectedTranslation)
}

/**
 * Asserts that text was NOT replaced
 */
export function expectTextNotReplaced(
  container: Element,
  originalText: string,
) {
  const lexaElements = Array.from(
    container.querySelectorAll(`.${LEXA_ROOT_CLASS}`),
  ) as HTMLElement[]
  const element = lexaElements.find(
    (el) => el.dataset.originalText === originalText,
  )

  expect(element).toBeFalsy()
}

/**
 * Gets the count of Lexa components in the container
 */
export function getLexaComponentCount(container: Element): number {
  return container.querySelectorAll(`.${LEXA_ROOT_CLASS}`).length
}

/**
 * Checks if the original text still exists in the DOM (not replaced)
 */
export function hasOriginalText(container: Element, text: string): boolean {
  return container.textContent?.includes(text) ?? false
}
