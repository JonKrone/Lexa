/**
 * Translate‑in‑place injection powered by mark.js
 * ----------------------------------------------
 *  – Works across text‑nodes, punctuation, diacritics.
 *  – No string‑offset math, no multi‑node edge cases.
 *  – Batches the DOM mutations and de‑dupes elements.
 */

import Mark from 'mark.js'
import { ITranslation } from '../ai/generatePageTranslations'
import { logger } from './logger'
import { observer } from './mutationObserver'

/** Internal cache to avoid mounting twice on the same element. Particularly useful for SPA-apps */
const processed = new WeakSet<Element>()

/** Re‑usable Mark instance so incremental calls are cheap */
const mark = new Mark(document.body)

/**
 * Inject one or many translations.
 * Pass the **new** translations only (ones you have not tried before).
 */
export function injectTranslations(translations: ITranslation[]) {
  if (translations.length === 0) return

  // 1️⃣  Pause the page‑wide MutationObserver to avoid recursive triggers
  observer?.disconnect()

  translations.forEach((t) => {
    mark.mark(t.original, {
      separateWordSearch: false,
      accuracy: {
        value: 'exactly', // no fuzzy matches
        limiters: [' ', ',', '.', '?', '!', '–', '—', '…'],
      },
      element: 'span',
      className: 'lexa-root-node',
      noMatch: (term) => {
        logger.log(`No match found for ${term}`)
      },
      each: (element) => {
        if (processed.has(element)) return

        processed.add(element)

        // mark.js keeps the **original** text inside <span>. We'll let the portal
        // handle rendering the translation text, so we clear the textContent.
        element.textContent = ''
        element.setAttribute('data-original-text', t.original)

        // Register the anchor with the overlay manager
        if (window.__lexaRegisterAnchor) {
          window.__lexaRegisterAnchor(element, t)
        }
      },
    })
  })

  // 2️⃣  Resume the observer after all DOM work is done
  observer?.observe(document.body, { childList: true, subtree: true })
  logger.log(`Injected ${translations.length} translation(s).`)
}
