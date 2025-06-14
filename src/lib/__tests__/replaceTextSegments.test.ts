import { beforeEach, describe, expect, test, vi } from 'vitest'
import { htmlSamples, problemCases } from './fixtures/htmlSamples'
import { edgeCaseTranslations, testTranslations } from './fixtures/translations'
import { createTestDOM } from './utils/mockDOM'
import {
  expectTextNotReplaced,
  expectTextReplaced,
  getLexaComponentCount,
} from './utils/testHelpers'

// Mock the mountLexaRoot function since we're testing the logic, not the React rendering
vi.mock('../../components/Lexa/mountLexaRoot', () => ({
  LEXA_ROOT_CLASS: 'lexa-root-node',
  mountLexaRoot: vi.fn((range, translation) => {
    // Create a simple mock element to simulate the replacement
    const element = document.createElement('span')
    element.className = 'lexa-root-node'
    element.textContent = translation.translation
    element.dataset.originalText = translation.original

    // Replace the range content with our mock element
    range.deleteContents()
    range.insertNode(element)
  }),
}))

// Import the function we want to test
import { LEXA_ROOT_CLASS } from '../../components/Lexa/mountLexaRoot'
import { replaceTextSegments } from '../replaceTextSegments'

describe('replaceTextSegments Integration Tests', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  test('should replace simple text in basic HTML', () => {
    container = createTestDOM(htmlSamples.simple)
    const translations = [testTranslations[0]] // "work" -> "funcionan"

    replaceTextSegments(container, translations)

    expectTextReplaced(container, 'work', 'funcionan')
  })

  test('should replace multiple translations in complex HTML', () => {
    container = createTestDOM(htmlSamples.complex)
    const translations = [
      testTranslations[4], // "browser extension" -> "extensión del navegador"
      testTranslations[5], // "language learning" -> "aprendizaje de idiomas"
    ]

    replaceTextSegments(container, translations)

    expectTextReplaced(
      container,
      'browser extension',
      'extensión del navegador',
    )
    expectTextReplaced(container, 'language learning', 'aprendizaje de idiomas')
  })

  test('should not replace text in script or style elements', () => {
    container = createTestDOM(htmlSamples.withScripts)
    const translations = [
      {
        original: 'console',
        translation: 'consola',
        context: 'console.log statement',
      },
    ]

    replaceTextSegments(container, translations)

    expectTextNotReplaced(container, 'console')
  })

  test('should skip existing Lexa components', () => {
    container = createTestDOM(htmlSamples.withExistingLexaComponents)
    const translations = [testTranslations[0]] // "work" -> "funcionan"

    const initialLexaCount = getLexaComponentCount(container)
    replaceTextSegments(container, translations)
    const finalLexaCount = getLexaComponentCount(container)

    // Should not create additional Lexa components for already replaced text
    expect(finalLexaCount).toBe(initialLexaCount)
  })

  test('should handle word boundary detection correctly', () => {
    container = createTestDOM(problemCases.partialWordMatch)
    const translations = [
      {
        original: 'work',
        translation: 'funcionan',
        context: 'The framework works well, but frameworks are better',
      },
    ] // Better context match

    replaceTextSegments(container, translations)

    // Should replace "work" but not affect "framework" or "frameworks"
    expect(container.textContent).toContain('framework')
    expect(container.textContent).toContain('frameworks')
    expectTextReplaced(container, 'work', 'funcionan')
  })

  test('should handle edge cases with single characters', () => {
    container = createTestDOM(htmlSamples.edgeCases)
    const translations = [
      edgeCaseTranslations[0], // "a" -> "un"
      edgeCaseTranslations[1], // "I" -> "yo"
    ]

    replaceTextSegments(container, translations)

    expectTextReplaced(container, 'a', 'un')
    expectTextReplaced(container, 'I', 'yo')
  })

  test('should handle hyphenated words', () => {
    container = createTestDOM(htmlSamples.edgeCases)
    const translations = [edgeCaseTranslations[2]] // "test-case" -> "caso-de-prueba"

    replaceTextSegments(container, translations)

    expectTextReplaced(container, 'test-case', 'caso-de-prueba')
  })

  test('should handle multi-word phrases', () => {
    container = createTestDOM(
      `<div><p>This is a multi word phrase that works well.</p></div>`,
    )
    const translations = [
      {
        original: 'multi word phrase',
        translation: 'frase de múltiples palabras',
        context: 'This is a multi word phrase that works well',
      },
    ] // Better context match

    replaceTextSegments(container, translations)

    expectTextReplaced(
      container,
      'multi word phrase',
      'frase de múltiples palabras',
    )
  })

  test('should process matches in reverse order to preserve indices', () => {
    container = createTestDOM(
      `<div><p>The work and more work is important work.</p></div>`,
    )
    const translations = [
      {
        original: 'work',
        translation: 'funcionan',
        context: 'The work and more work is important work',
      },
    ] // Better context match

    replaceTextSegments(container, translations)

    // Should replace all instances of "work"
    const lexaElements = container.querySelectorAll(`.${LEXA_ROOT_CLASS}`)
    expect(lexaElements.length).toBe(3)

    lexaElements.forEach((element) => {
      expect(element.textContent).toBe('funcionan')
      expect((element as HTMLElement).dataset.originalText).toBe('work')
    })
  })

  test('should handle empty translations array', () => {
    container = createTestDOM(htmlSamples.simple)

    replaceTextSegments(container, [])

    expect(getLexaComponentCount(container)).toBe(0)
  })

  test('should handle translations with no matches', () => {
    container = createTestDOM(htmlSamples.simple)
    const translations = [
      {
        original: 'nonexistent',
        translation: 'no existe',
        context: 'this text does not exist',
      },
    ]

    replaceTextSegments(container, translations)

    expectTextNotReplaced(container, 'nonexistent')
  })

  test('should handle nested HTML elements correctly', () => {
    container = createTestDOM(htmlSamples.nested)
    const translations = [
      {
        original: 'language learning',
        translation: 'aprendizaje de idiomas',
        context:
          'Browser extensions can help with language learning by replacing text',
      },
    ] // Better context match

    replaceTextSegments(container, translations)

    expectTextReplaced(container, 'language learning', 'aprendizaje de idiomas')
  })

  test('should handle context verification', () => {
    container = createTestDOM(
      `<div><p>This work is different from that work context.</p></div>`,
    )
    const translations = [
      {
        original: 'work',
        translation: 'funcionan',
        context: 'frameworks like React and Vue work in content scripts', // Different context
      },
    ]

    replaceTextSegments(container, translations)

    // Should not replace because context doesn't match
    expectTextNotReplaced(container, 'work')
  })

  test('should handle whitespace normalization correctly', () => {
    container = createTestDOM(
      `<div><p>Multiple   spaces   between   words</p></div>`,
    )
    const translations = [
      {
        original: 'spaces between',
        translation: 'espacios entre',
        context: 'Multiple spaces between words',
      },
    ]

    replaceTextSegments(container, translations)

    expectTextReplaced(container, 'spaces between', 'espacios entre')
  })
})
