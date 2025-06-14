/**
 * Translate‑in‑place injection powered by mark.js
 * ----------------------------------------------
 *  – Works across text‑nodes, punctuation, diacritics.
 *  – No string‑offset math, no multi‑node edge cases.
 *  – Batches the DOM mutations and de‑dupes elements.
 */

import Mark from 'mark.js'
import { ITranslation } from '../ai/generatePageTranslations'
import { mountLexaRoot } from '../components/Lexa/mountLexaRoot'
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

        // mark.js keeps the **original** text inside <span>.  We want to show the
        // translation, so we replace the textContent before mounting React.
        element.textContent = t.translation
        element.setAttribute('data-original-text', t.original)

        // Build a Range that covers <span> so existing mountLexaRoot still works
        const range = document.createRange()
        range.selectNodeContents(element)

        mountLexaRoot(range, t)
      },
    })
  })

  // 2️⃣  Resume the observer after all DOM work is done
  observer?.observe(document.body, { childList: true, subtree: true })
  logger.log(`Injected ${translations.length} translation(s).`)
}
