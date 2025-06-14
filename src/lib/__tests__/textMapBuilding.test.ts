import { beforeEach, describe, expect, test } from 'vitest'
import { buildTextMap } from '../replaceTextSegments'
import { htmlSamples } from './fixtures/htmlSamples'
import { createTestDOM, getTextNodes } from './utils/mockDOM'

// We need to import the actual functions from the source file
// Since they're not exported, we'll test the behavior through integration
// But we can test the DOM traversal logic separately

describe('buildTextMap Function', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should build text map for simple HTML', () => {
    container = createTestDOM(htmlSamples.simple)
    const textMap = buildTextMap(container)

    expect(textMap.nodes).toHaveLength(1)
    expect(textMap.fullText).toContain('frameworks like react and vue work')
    expect(textMap.originalFullText).toContain(
      'frameworks like React and Vue work',
    )
  })

  test('should build text map for complex HTML', () => {
    container = createTestDOM(htmlSamples.complex)
    const textMap = buildTextMap(container)

    // Should find text in h1, p elements, and li elements
    expect(textMap.nodes.length).toBeGreaterThan(5)

    expect(textMap.fullText).toContain('browser extension development')
    expect(textMap.fullText).toContain('react components')
    expect(textMap.fullText).toContain('vue templates')
  })

  test('should skip script and style elements', () => {
    container = createTestDOM(htmlSamples.withScripts)
    const textMap = buildTextMap(container)

    expect(textMap.fullText).not.toContain('console.log')
    expect(textMap.fullText).not.toContain('color: red')
    expect(textMap.fullText).toContain('this content should be processed')
  })

  test('should skip existing Lexa components', () => {
    container = createTestDOM(htmlSamples.withExistingLexaComponents)
    const textMap = buildTextMap(container)

    expect(textMap.fullText).toContain('this is normal text')
    expect(textMap.fullText).toContain('this should still be processed')
    // Should not include the Lexa component text
    expect(textMap.fullText).not.toContain('funcionan')
  })

  test('should handle nested elements correctly', () => {
    container = createTestDOM(htmlSamples.nested)
    const textMap = buildTextMap(container)

    expect(textMap.nodes.length).toBeGreaterThan(2)
    expect(textMap.fullText).toContain('language learning')
    expect(textMap.fullText).toContain('browser extensions can help')
    expect(textMap.fullText).toContain('this approach makes learning')
  })

  test('should skip empty and whitespace-only text nodes', () => {
    const html = `
      <div>
        <p>   </p>
        <p>Real content</p>
        <p></p>
        <p>More content</p>
      </div>
    `
    container = createTestDOM(html)
    const textMap = buildTextMap(container)

    expect(textMap.nodes).toHaveLength(2)
    expect(textMap.fullText).toContain('real content')
    expect(textMap.fullText).toContain('more content')
  })

  test('should calculate correct global offsets', () => {
    const html = '<div><p>First</p><p>Second</p></div>'
    container = createTestDOM(html)
    const textMap = buildTextMap(container)

    expect(textMap.nodes).toHaveLength(2)

    expect(textMap.nodes[0].startOffset).toBe(0)
    expect(textMap.nodes[0].endOffset).toBe(5) // "first".length
    expect(textMap.nodes[1].startOffset).toBe(5)
    expect(textMap.nodes[1].endOffset).toBe(11) // 5 + "second".length
  })

  test('should handle normalized vs original text correctly', () => {
    const html = '<div><p>  Multiple   Spaces  </p></div>'
    container = createTestDOM(html)
    const textMap = buildTextMap(container)

    expect(textMap.nodes).toHaveLength(1)
    expect(textMap.nodes[0].originalText).toBe('  Multiple   Spaces  ')
    expect(textMap.nodes[0].normalizedText).toBe('multiple spaces')
    expect(textMap.fullText).toBe('multiple spaces')
    expect(textMap.originalFullText).toBe('  Multiple   Spaces  ')
  })
})

// Keep the original DOM Text Node Collection tests for the utility functions
describe('DOM Text Node Collection', () => {
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('should find all text nodes in simple HTML', () => {
    container = createTestDOM(htmlSamples.simple)
    const textNodes = getTextNodes(container)

    expect(textNodes).toHaveLength(1)
    expect(textNodes[0].textContent).toContain(
      'frameworks like React and Vue work',
    )
  })

  test('should find multiple text nodes in complex HTML', () => {
    container = createTestDOM(htmlSamples.complex)
    const textNodes = getTextNodes(container)

    // Should find text in h1, p elements, and li elements
    expect(textNodes.length).toBeGreaterThan(5)

    const textContents = textNodes
      .map((node) => node.textContent?.trim())
      .filter(Boolean)
    expect(textContents).toContain('Browser Extension Development')
    expect(textContents).toContain('React components')
    expect(textContents).toContain('Vue templates')
  })

  test('should skip script and style elements', () => {
    container = createTestDOM(htmlSamples.withScripts)
    const textNodes = getTextNodes(container)

    const allText = textNodes.map((node) => node.textContent).join(' ')
    expect(allText).not.toContain('console.log')
    expect(allText).not.toContain('color: red')
    expect(allText).toContain('This content should be processed')
  })

  test('should skip existing Lexa components', () => {
    container = createTestDOM(htmlSamples.withExistingLexaComponents)
    const textNodes = getTextNodes(container)

    const allText = textNodes.map((node) => node.textContent).join(' ')
    expect(allText).toContain('This is normal text')
    expect(allText).toContain('This should still be processed')
    // Should not include the Lexa component text
    expect(allText).not.toContain('funcionan')
  })

  test('should handle nested elements correctly', () => {
    container = createTestDOM(htmlSamples.nested)
    const textNodes = getTextNodes(container)

    expect(textNodes.length).toBeGreaterThan(2)

    const textContents = textNodes
      .map((node) => node.textContent?.trim())
      .filter(Boolean)
    expect(textContents).toContain('Language Learning')
    expect(textContents).toContain(
      'Browser extensions can help with language learning',
    )
    expect(textContents).toContain(
      'This approach makes learning more contextual',
    )
  })

  test('should skip empty and whitespace-only text nodes', () => {
    const html = `
      <div>
        <p>   </p>
        <p>Real content</p>
        <p></p>
        <p>More content</p>
      </div>
    `
    container = createTestDOM(html)
    const textNodes = getTextNodes(container)

    expect(textNodes).toHaveLength(2)
    expect(textNodes[0].textContent?.trim()).toBe('Real content')
    expect(textNodes[1].textContent?.trim()).toBe('More content')
  })

  test('should handle text nodes with mixed content', () => {
    const html = `
      <div>
        <p>Text before <strong>bold text</strong> and after</p>
      </div>
    `
    container = createTestDOM(html)
    const textNodes = getTextNodes(container)

    expect(textNodes).toHaveLength(3)
    expect(textNodes[0].textContent).toBe('Text before ')
    expect(textNodes[1].textContent).toBe('bold text')
    expect(textNodes[2].textContent).toBe(' and after')
  })
})

describe('Text Map Offset Calculation', () => {
  test('should calculate correct global offsets for single node', () => {
    const html = '<div><p>Hello world</p></div>'
    const container = createTestDOM(html)
    const textNodes = getTextNodes(container)

    expect(textNodes).toHaveLength(1)

    // Simulate what buildTextMap would do
    let globalOffset = 0
    const nodeInfo = {
      node: textNodes[0],
      originalText: textNodes[0].textContent || '',
      startOffset: globalOffset,
      endOffset: globalOffset + (textNodes[0].textContent?.length || 0),
    }

    expect(nodeInfo.startOffset).toBe(0)
    expect(nodeInfo.endOffset).toBe(11) // "Hello world".length
  })

  test('should calculate correct global offsets for multiple nodes', () => {
    const html = '<div><p>First</p><p>Second</p></div>'
    const container = createTestDOM(html)
    const textNodes = getTextNodes(container)

    expect(textNodes).toHaveLength(2)

    // Simulate buildTextMap offset calculation
    let globalOffset = 0
    const nodeInfos = textNodes.map((node) => {
      const text = node.textContent || ''
      const info = {
        node,
        originalText: text,
        startOffset: globalOffset,
        endOffset: globalOffset + text.length,
      }
      globalOffset += text.length
      return info
    })

    expect(nodeInfos[0].startOffset).toBe(0)
    expect(nodeInfos[0].endOffset).toBe(5) // "First".length
    expect(nodeInfos[1].startOffset).toBe(5)
    expect(nodeInfos[1].endOffset).toBe(11) // 5 + "Second".length
  })

  test('should handle normalized text offsets', () => {
    const html = '<div><p>  Multiple   spaces  </p></div>'
    const container = createTestDOM(html)
    const textNodes = getTextNodes(container)

    const originalText = textNodes[0].textContent || ''
    const normalizedText = originalText
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()

    expect(originalText).toBe('  Multiple   spaces  ')
    expect(normalizedText).toBe('multiple spaces')

    // The mapping between original and normalized positions is complex
    // This is where the position mapping bug likely occurs
    expect(normalizedText.length).toBeLessThan(originalText.length)
  })
})
