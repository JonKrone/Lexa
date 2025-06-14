import { describe, expect, test } from 'vitest'
import { mapNormalizedToOriginalPosition } from '../replaceTextSegments'

describe('Position Mapping', () => {
  test('should map simple text correctly', () => {
    const originalText = 'Hello world'
    const target = 'world'
    const normalizedPosition = 6 // position of "world" in normalized text

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(result!.start).toBe(6)
    expect(result!.end).toBe(11)
    expect(originalText.substring(result!.start, result!.end)).toBe('world')
  })

  test('should handle text with extra whitespace', () => {
    const originalText = 'Hello    world'
    const target = 'world'
    const normalizedPosition = 6 // position of "world" in "hello world"

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('world')
  })

  test('should handle case differences', () => {
    const originalText = 'Hello WORLD'
    const target = 'world'
    const normalizedPosition = 6

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('WORLD')
  })

  test('should handle the problematic "work" case', () => {
    const originalText = 'frameworks like React and Vue work in content scripts'
    const target = 'work'
    // In normalized text: "frameworks like react and vue work in content scripts"
    // "work" should be at position 35
    const normalizedPosition = 35

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('work')
    // Should NOT return "thfuncionanme" or any corrupted text
  })

  test('should handle text at the beginning', () => {
    const originalText = 'work is important'
    const target = 'work'
    const normalizedPosition = 0

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(result!.start).toBe(0)
    expect(result!.end).toBe(4)
    expect(originalText.substring(result!.start, result!.end)).toBe('work')
  })

  test('should handle text at the end', () => {
    const originalText = 'this is important work'
    const target = 'work'
    const normalizedPosition = 18 // position in normalized text

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('work')
  })

  test('should handle multi-word phrases', () => {
    const originalText = 'This is a content script example'
    const target = 'content script'
    const normalizedPosition = 10 // approximate position in normalized text

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe(
      'content script',
    )
  })

  test('should return null for non-existent text', () => {
    const originalText = 'Hello world'
    const target = 'nonexistent'
    const normalizedPosition = 0

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).toBeNull()
  })

  test('should handle edge case with punctuation', () => {
    const originalText = 'Hello, world!'
    const target = 'world'
    const normalizedPosition = 7 // position in "hello, world!"

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('world')
  })

  test('should handle the "same" bug case', () => {
    const originalText = 'The same functionality'
    const target = 'same'
    const normalizedPosition = 4 // position in "the same functionality"

    const result = mapNormalizedToOriginalPosition(
      originalText,
      target,
      normalizedPosition,
    )

    expect(result).not.toBeNull()
    expect(originalText.substring(result!.start, result!.end)).toBe('same')
    // Should NOT corrupt the text
  })
})
