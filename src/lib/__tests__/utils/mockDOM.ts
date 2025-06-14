import { vi } from 'vitest'
import { buildTextMap } from '../../replaceTextSegments'

/**
 * Creates a DOM element from HTML string and appends it to document.body
 */
export function createTestDOM(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html.trim()
  document.body.appendChild(container)
  return container
}

/**
 * Creates a text node with the given content
 */
export function createTextNode(content: string): Text {
  return document.createTextNode(content)
}

/**
 * Creates a simple paragraph element with text content
 */
export function createParagraph(text: string): HTMLParagraphElement {
  const p = document.createElement('p')
  p.textContent = text
  return p
}

/**
 * Gets all text nodes from a given element using the real buildTextMap implementation
 */
export function getTextNodes(element: Element): Text[] {
  const textMap = buildTextMap(element)
  return textMap.nodes.map((nodeInfo) => nodeInfo.node)
}

/**
 * Gets the concatenated text content from all text nodes
 */
export function getFullTextContent(element: Element): string {
  return getTextNodes(element)
    .map((node) => node.textContent || '')
    .join('')
}

/**
 * Finds elements with the Lexa root class
 */
export function getLexaRootElements(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll('.lexa-root-node'))
}

/**
 * Checks if text was replaced by looking for Lexa components
 */
export function isTextReplaced(
  container: Element,
  originalText: string,
): boolean {
  const lexaElements = getLexaRootElements(container)
  return lexaElements.some((el) => el.dataset.originalText === originalText)
}

/**
 * Gets the translation text from a Lexa component
 */
export function getTranslationText(
  container: Element,
  originalText: string,
): string | null {
  const lexaElements = getLexaRootElements(container)
  const element = lexaElements.find(
    (el) => el.dataset.originalText === originalText,
  )
  return element ? element.textContent : null
}

/**
 * Mock ReactDOM.createRoot for testing
 */
export function mockReactDOM() {
  const mockRoot = {
    render: vi.fn(),
    unmount: vi.fn(),
  }

  const mockCreateRoot = vi.fn(() => mockRoot)

  // Mock the ReactDOM module
  vi.doMock('react-dom/client', () => ({
    default: {
      createRoot: mockCreateRoot,
    },
  }))

  return { mockRoot, mockCreateRoot }
}
