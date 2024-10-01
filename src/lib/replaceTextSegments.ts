import { ITranslation } from '../ai/generatePageTranslations'
import { mountLexaRoot } from '../components/Lexa/mountLexaRoot'

const STOP_AFTER_FIRST_MATCH = false

/**
 * Replaces text segments in the DOM with custom elements.
 * @param rootNode The root DOM node to start the search from (e.g., document.body).
 * @param translations An array of translations obtained from the LLM.
 */
export function replaceTextSegments(
  rootNode: Node,
  translations: ITranslation[],
) {
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null)

  const textNodes: Text[] = []
  let node: Text | null

  // Collect all text nodes
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node)
  }

  translations.forEach((translation) => {
    findAndReplaceTextNode(textNodes, translation)
  })
}

/**
 * Finds and replaces text nodes that match the original text and context.
 * @param textNodes Array of text nodes to search within.
 * @param translation The translation object containing original text, translation, and context.
 */
function findAndReplaceTextNode(textNodes: Text[], translation: ITranslation) {
  const normalizedTranslationContext = normalizeText(translation.context)
  const normalizedOriginal = normalizeText(translation.original)
  // console.log('normalizedTranslationContext', normalizedTranslationContext)

  let found = false
  let misses = []
  for (const textNode of textNodes) {
    const textContent = textNode.textContent || ''
    const normalizedTextContent = normalizeText(textContent)

    const index = normalizedTextContent.indexOf(normalizedOriginal)
    // if (textContent.includes('root element')) {
    //   console.log('********************')
    //   console.log('Found an instance')
    //   console.log('normalizedTextContent', normalizedTextContent)
    //   console.log('textContent', normalizedOriginal)
    // }

    if (index !== -1) {
      // console.log('Found an instance')
      // Get the context from the parent element
      const nodeContext = normalizeText(
        getNodeContext(textNode, translation.context.length),
      )

      // Check if the translation context is included in the node context
      if (nodeContext.includes(normalizedTranslationContext)) {
        console.log('Verified Context')

        // Calculate the actual index in the original text content
        const actualIndex = textContent
          .toLowerCase()
          .indexOf(normalizedOriginal.toLowerCase())

        replaceTextWithElement(textNode, actualIndex, translation)

        found = true
        if (STOP_AFTER_FIRST_MATCH) {
          break
        }
      } else {
        misses.push({
          nodeContext,
        })
      }
    }
  }

  if (__DEBUG__ && !found) {
    console.log('Never Found:', translation)
    console.log('Misses:', misses)
  }
}

/**
 * Gets the surrounding context of a text node. Moves up the DOM collecting textContent until
 * the context is at least minContextLength.
 * @param textNode The text node from which to extract context.
 * @param minContextLength The minimum length of the context to return.
 * @returns A string representing the context around the text node.
 */
function getNodeContext(
  textNode: Text,
  minContextLength: number = 100,
): string {
  let currentElement: Element | null = textNode.parentElement
  let contextParts: string[] = [textNode.textContent || '']
  let contextLength = contextParts[0].length

  while (currentElement && contextLength < minContextLength) {
    if (currentElement.textContent) {
      contextParts.unshift(currentElement.textContent)
      contextLength += currentElement.textContent.length
    }
    currentElement = currentElement.parentElement
  }

  return normalizeText(contextParts.join(' '))
}

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with a single space
    .replace(/\*\*|__|~~/g, '') // Remove "**", "__", and "~~"
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
    .trim()
    .toLowerCase() // Convert to lowercase
}

/**
 * Replaces a portion of a text node with a custom element containing the translation.
 * @param textNode The text node to modify.
 * @param index The starting index of the text to replace.
 * @param translation The translation object.
 */
function replaceTextWithElement(
  textNode: Text,
  index: number,
  translation: ITranslation,
) {
  const range = document.createRange()
  range.setStart(textNode, index)
  range.setEnd(textNode, index + translation.original.length)

  // Mount the LexaRoot
  mountLexaRoot(range, translation)
}
