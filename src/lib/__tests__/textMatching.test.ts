import { describe, expect, test } from 'vitest'
import { findWordBoundaryMatches, normalizeText } from '../replaceTextSegments'

describe('Text Normalization', () => {
  test('should collapse multiple whitespace to single space', () => {
    expect(normalizeText('hello    world')).toBe('hello world')
    expect(normalizeText('hello\n\t  world')).toBe('hello world')
    expect(normalizeText('  hello   world  ')).toBe('hello world')
  })

  test('should convert to lowercase', () => {
    expect(normalizeText('Hello World')).toBe('hello world')
    expect(normalizeText('FRAMEWORKS')).toBe('frameworks')
  })

  test('should handle empty and whitespace-only strings', () => {
    expect(normalizeText('')).toBe('')
    expect(normalizeText('   ')).toBe('')
    expect(normalizeText('\n\t')).toBe('')
  })

  test('should preserve punctuation', () => {
    expect(normalizeText('Hello, world!')).toBe('hello, world!')
    expect(normalizeText('test-case')).toBe('test-case')
    expect(normalizeText('user@example.com')).toBe('user@example.com')
  })
})

describe('Word Boundary Matching', () => {
  test('should find exact word matches', () => {
    const text = 'frameworks like react and vue work in content scripts'
    const matches = findWordBoundaryMatches(text, 'work')

    expect(matches).toHaveLength(1)
    expect(matches[0]).toBe(30) // actual position of "work" in the text
  })

  test('should not match partial words', () => {
    const text = 'frameworks like react and vue work in content scripts'
    const matches = findWordBoundaryMatches(text, 'work')

    // Should not match "work" in "frameworks"
    expect(matches).not.toContain(5) // position would be inside "frameworks"
  })

  test('should find multiple matches', () => {
    const text = 'work is good work when work is meaningful'
    const matches = findWordBoundaryMatches(text, 'work')

    expect(matches).toHaveLength(3)
    expect(matches).toEqual([0, 13, 23])
  })

  test('should handle case insensitive matching', () => {
    const text = 'Work is good WORK when work is meaningful'
    const matches = findWordBoundaryMatches(text, 'work')

    expect(matches).toHaveLength(3)
  })

  test('should handle special regex characters', () => {
    const text = 'This is a test-case for special characters'
    const matches = findWordBoundaryMatches(text, 'test-case')

    expect(matches).toHaveLength(1)
    expect(matches[0]).toBe(10)
  })

  test('should handle multi-word phrases', () => {
    const text = 'This is a multi word phrase in the text'
    const matches = findWordBoundaryMatches(text, 'multi word phrase')

    expect(matches).toHaveLength(1)
    expect(matches[0]).toBe(10)
  })

  test('should handle punctuation boundaries', () => {
    const text = 'Hello, world! How are you?'
    const matches = findWordBoundaryMatches(text, 'world')

    expect(matches).toHaveLength(1)
    expect(matches[0]).toBe(7)
  })

  test('should not match when no word boundaries exist', () => {
    const text = 'frameworks'
    const matches = findWordBoundaryMatches(text, 'work')

    expect(matches).toHaveLength(0)
  })

  test('should handle empty target', () => {
    const text = 'some text here'
    const matches = findWordBoundaryMatches(text, '')

    // Empty regex with word boundaries should not match anything
    expect(matches).toHaveLength(0)
  })

  test('should handle single character matches', () => {
    const text = 'I am learning a new language'
    const matches = findWordBoundaryMatches(text, 'I')

    expect(matches).toHaveLength(1)
    expect(matches[0]).toBe(0)
  })

  test('should handle single character that appears in words', () => {
    const text = 'I am learning a new language'
    const matches = findWordBoundaryMatches(text, 'a')

    expect(matches).toHaveLength(1) // Only the standalone "a", not the "a" in "am", "learning", etc.
    expect(matches[0]).toBe(14) // position of standalone "a"
  })
})
