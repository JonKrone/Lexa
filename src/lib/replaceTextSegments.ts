import { ITranslation } from '../ai/generatePageTranslations'
import {
  LEXA_ROOT_CLASS,
  mountLexaRoot,
} from '../components/Lexa/mountLexaRoot'
import { logger } from './logger'

interface TextNodeInfo {
  node: Text
  originalText: string // Keep original text
  normalizedText: string // Normalized for searching
  startOffset: number // Global offset in fullText
  endOffset: number // Global offset in fullText
}

export interface TextMap {
  fullText: string // Concatenated normalized text
  originalFullText: string // Concatenated original text
  nodes: TextNodeInfo[]
}

interface Match {
  globalOffset: number
  length: number
  translation: ITranslation
  spanningNodes: { node: Text; startOffset: number; endOffset: number }[]
}

/**
 * Replaces text segments in the DOM with custom elements.
 * Uses a flattened offset mapping approach to handle cross-node text spans reliably.
 */
export function replaceTextSegments(
  rootNode: Node,
  translations: ITranslation[],
) {
  // Build a flattened text map of all valid text nodes
  const textMap = buildTextMap(rootNode)

  if (textMap.nodes.length === 0) {
    logger.log('No valid text nodes found')
    return
  }

  // Find all matches
  const matches = translations
    .map((translation) => findMatch(textMap, translation))
    .filter((match): match is Match => match !== null)

  if (__DEBUG__) {
    logger.log(
      `Found ${matches.length} matches out of ${translations.length} translations`,
    )
  }

  // Sort matches by position (reverse order to preserve indices during replacement)
  matches.sort((a, b) => b.globalOffset - a.globalOffset)

  // Replace from end to start to avoid index shifting
  for (const match of matches) {
    replaceAtPosition(match)
  }
}

/**
 * Builds a flattened text map from all valid text nodes in the DOM.
 * This allows us to search across element boundaries.
 */
export function buildTextMap(rootNode: Node): TextMap {
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT

      // Skip script, style, textarea, and our own components
      const tagName = parent.tagName.toLowerCase()
      if (['script', 'style', 'textarea', 'noscript'].includes(tagName)) {
        return NodeFilter.FILTER_REJECT
      }

      // Skip our own Lexa components
      if (
        parent.classList.contains(LEXA_ROOT_CLASS) ||
        parent.closest(`.${LEXA_ROOT_CLASS}`)
      ) {
        return NodeFilter.FILTER_REJECT
      }

      // Skip empty or whitespace-only nodes
      const text = node.textContent || ''
      if (text.trim().length === 0) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes: TextNodeInfo[] = []
  let fullText = ''
  let originalFullText = ''
  let node: Text | null

  while ((node = walker.nextNode() as Text | null)) {
    const originalText = node.textContent || ''
    const normalizedText = normalizeText(originalText)

    nodes.push({
      node,
      originalText,
      normalizedText,
      startOffset: fullText.length,
      endOffset: fullText.length + normalizedText.length,
    })

    fullText += normalizedText
    originalFullText += originalText
  }

  return { fullText, originalFullText, nodes }
}

/**
 * Simplified text normalization - only collapse whitespace and lowercase.
 * No punctuation stripping to avoid index mapping issues.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Collapse multiple whitespace to single space
    .trim()
    .toLowerCase()
}

/**
 * Finds a match for a translation in the text map using word boundary detection.
 */
function findMatch(textMap: TextMap, translation: ITranslation): Match | null {
  const normalizedOriginal = normalizeText(translation.original)
  const normalizedContext = normalizeText(translation.context)

  // Find all occurrences of the text with word boundaries
  const matches = findWordBoundaryMatches(textMap.fullText, normalizedOriginal)

  if (matches.length === 0) {
    if (__DEBUG__) {
      logger.log('Text not found:', {
        original: translation.original,
        normalized: normalizedOriginal,
        searchIn: textMap.fullText.substring(0, 200) + '...',
      })
    }
    return null
  }

  // Find the best match based on context
  for (const index of matches) {
    // Quick context verification using surrounding text
    const contextRadius = 100 // Characters before and after to check
    const contextStart = Math.max(0, index - contextRadius)
    const contextEnd = Math.min(
      textMap.fullText.length,
      index + normalizedOriginal.length + contextRadius,
    )
    const localContext = textMap.fullText.substring(contextStart, contextEnd)

    if (localContext.includes(normalizedContext)) {
      // Find which nodes this text spans across
      const spanningNodes = getSpanningNodes(
        textMap,
        index,
        normalizedOriginal.length,
      )

      if (spanningNodes.length > 0) {
        return {
          globalOffset: index,
          length: normalizedOriginal.length,
          translation,
          spanningNodes,
        }
      }
    }
  }

  if (__DEBUG__) {
    logger.log('Context verification failed for all matches:', {
      original: translation.original,
      expectedContext: normalizedContext,
      foundMatches: matches.length,
    })
  }

  return null
}

/**
 * Finds all word-boundary matches of the target text in the source text.
 * This prevents partial word matches like "work" in "frameworks".
 */
export function findWordBoundaryMatches(
  text: string,
  target: string,
): number[] {
  const matches: number[] = []

  // Create a regex that matches the target with word boundaries
  // Escape special regex characters in the target
  const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Use word boundaries (\b) to ensure we match whole words/phrases
  const regex = new RegExp(`\\b${escapedTarget}\\b`, 'gi')

  let match
  while ((match = regex.exec(text)) !== null) {
    matches.push(match.index)
    // Reset lastIndex to find overlapping matches if any
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }
  }

  return matches
}

/**
 * Determines which text nodes a match spans across and their local offsets.
 */
function getSpanningNodes(
  textMap: TextMap,
  globalStart: number,
  length: number,
): { node: Text; startOffset: number; endOffset: number }[] {
  const globalEnd = globalStart + length
  const spanningNodes: {
    node: Text
    startOffset: number
    endOffset: number
  }[] = []

  for (const nodeInfo of textMap.nodes) {
    // Check if this node overlaps with our match
    if (
      nodeInfo.endOffset <= globalStart ||
      nodeInfo.startOffset >= globalEnd
    ) {
      continue // No overlap
    }

    // Calculate local offsets within this node
    const localStart = Math.max(0, globalStart - nodeInfo.startOffset)
    const localEnd = Math.min(
      nodeInfo.normalizedText.length,
      globalEnd - nodeInfo.startOffset,
    )

    spanningNodes.push({
      node: nodeInfo.node,
      startOffset: localStart,
      endOffset: localEnd,
    })
  }

  return spanningNodes
}

/**
 * Replaces text at the specified position with a LexaRoot component.
 */
function replaceAtPosition(match: Match) {
  try {
    // For now, we'll handle the simple case of single-node matches
    // Multi-node spans will be addressed in a future iteration
    if (match.spanningNodes.length !== 1) {
      if (__DEBUG__) {
        logger.log('Skipping multi-node match (not yet supported):', {
          original: match.translation.original,
          nodeCount: match.spanningNodes.length,
        })
      }
      return
    }

    const spanningNode = match.spanningNodes[0]
    const textNode = spanningNode.node

    // Map from normalized position back to original text position
    const originalPosition = mapNormalizedToOriginalPosition(
      textNode.textContent || '',
      match.translation.original,
      spanningNode.startOffset,
    )

    if (originalPosition === null) {
      if (__DEBUG__) {
        logger.log('Could not map to original position:', {
          original: match.translation.original,
          nodeText: textNode.textContent,
        })
      }
      return
    }

    // Create range for the original text
    const range = document.createRange()
    range.setStart(textNode, originalPosition.start)
    range.setEnd(textNode, originalPosition.end)

    // Mount the LexaRoot component
    mountLexaRoot(range, match.translation)

    if (__DEBUG__) {
      logger.log('Successfully replaced text:', match.translation.original)
    }
  } catch (error) {
    if (__DEBUG__) {
      logger.log('Error replacing text:', error)
    }
  }
}

/**
 * Maps a position in normalized text back to the original text position.
 * This preserves the exact original text boundaries including spacing.
 */
export function mapNormalizedToOriginalPosition(
  originalText: string,
  targetOriginal: string,
  normalizedStart: number,
): { start: number; end: number } | null {
  // The key insight: we need to find the original text that, when normalized,
  // matches our target at the given position

  const normalizedText = normalizeText(originalText)
  const normalizedTarget = normalizeText(targetOriginal)

  // Find the target in the normalized text starting from our position
  const normalizedIndex = normalizedText.indexOf(
    normalizedTarget,
    normalizedStart,
  )
  if (normalizedIndex === -1) {
    return null
  }

  // Now we need to map this back to the original text
  // We'll do this by walking through both strings character by character
  let originalIndex = 0
  let normalizedIndex2 = 0

  // Find the start position in original text
  while (
    normalizedIndex2 < normalizedIndex &&
    originalIndex < originalText.length
  ) {
    const originalChar = originalText[originalIndex]
    const normalizedChar = normalizeText(originalChar)

    if (normalizedChar) {
      normalizedIndex2 += normalizedChar.length
    }
    originalIndex++
  }

  const startPos = originalIndex

  // Find the end position by looking for the exact original text
  // Use a simple approach: try to match the original target text directly
  const directMatch = originalText
    .toLowerCase()
    .indexOf(targetOriginal.toLowerCase(), startPos - 10)
  if (directMatch !== -1 && directMatch <= startPos + 10) {
    return {
      start: directMatch,
      end: directMatch + targetOriginal.length,
    }
  }

  // Fallback: estimate based on target length
  return {
    start: startPos,
    end: Math.min(startPos + targetOriginal.length, originalText.length),
  }
}
