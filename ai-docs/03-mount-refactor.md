### **Task 1 – Single React root & Overlay Manager**

| Item          | Details                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Replace the per‑phrase `ReactDOM.createRoot` calls with one global root that owns every translated anchor via React portals.                                                        |
| **Key files** | `src/components/Lexa/mountLexaListener.tsx`, **add** `src/components/Lexa/LexaOverlayManager.tsx`, delete `mountLexaRoot.tsx`.                                                      |
| **Steps**     |                                                                                                                                                                                     |
| 1             | Inside `mountLexaListener` after `<Providers>`, render `<LexaOverlayManager/>`.                                                                                                     |
| 2             | `LexaOverlayManager` keeps a `Map<Element, TranslationData>` (`TranslationData = {original, translation, context}`) and exposes `window.__lexaRegisterAnchor = (el, data) => void`. |
| 3             | It renders nothing itself, but iterates over the map and `createPortal(<TranslationAnchor …/>, el)` for each entry.                                                                 |
| 4             | `TranslationAnchor` contains the styled `<span>` plus hover logic (was `<LexaRoot>`).                                                                                               |
| 5             | Delete `mountLexaRoot`, `lexaRoots[]`, and the WeakSet; migrate call‑sites in `injectTranslations` to `window.__lexaRegisterAnchor(...)`.                                           |
| **Done when** | 1 React root is created per page; runtime log shows **zero** `LexaRoot` calls to `ReactDOM.createRoot`.                                                                             |

---

### **Task 2 – Provider collapse**

| Item          | Details                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Remove duplicated context providers to cut memory and avoid mismatched caches.                                                            |
| **Key files** | `src/components/Providers.tsx`, `LexaRoot.tsx`, `HoverCard.tsx`, `mountLexaListener.tsx`.                                                 |
| **Steps**     |                                                                                                                                           |
| 1             | Keep `<Providers>` only at the top level inside `mountLexaListener`.                                                                      |
| 2             | Delete every nested `<Providers>` import (in `ShadowDOM`, `HoverCard`, etc.). Ensure children rely on React context from the single root. |
| **Done when** | Chrome React DevTools shows a single `QueryClientProvider`, `ThemeProvider`, `Router` in the tree.                                        |

---

### **Task 3 – Shadow DOM rationalisation**

| Item          | Details                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Drop inline ShadowRoot; keep one ShadowRoot only around the hover card.                                                          |
| **Key files** | `src/components/ShadowDOM.tsx`, `TranslationAnchor`, `HoverCard.tsx`.                                                            |
| **Steps**     |                                                                                                                                  |
| 1             | For `TranslationAnchor` return a plain `<span class="lexa-anchor">` styled via global stylesheet; delete `ShadowDOM` usage here. |
| 2             | Keep `ShadowDOM` wrapper **only** inside `HoverCard` for the popper content.                                                     |
| 3             | Remove the `as` prop logic and unnecessary `style.*` mutations (will be class‑based now).                                        |
| **Done when** | DevTools shows 1 ShadowRoot per hover instance, none around inline anchors.                                                      |

---

### **Task 4 – Emotion cache memoisation**

| Item          | Details                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Re‑use the same Emotion cache instance across all hover‑card ShadowRoots.                                                                                                                          |
| **Key files** | `ShadowDOM.tsx`.                                                                                                                                                                                   |
| **Steps**     |                                                                                                                                                                                                    |
| 1             | Replace `cacheCache = new Map()` with a `WeakMap<ShadowRoot, EmotionCache>` wrapped in `memoize`.                                                                                                  |
| 2             | On first access of a given ShadowRoot create the cache, else re‑use.                                                                                                                               |
| 3             | Name the key `"lexa"` to avoid duplicate `<style>` tags.                                                                                                                                           |
| **Done when** | Inspect hover over 3 phrases: DevTools > Styles tab should show a **single** `<style data-emotion="lexa …">` per ShadowRoot; console memory profiler shows cache objects count ≤ ShadowRoot count. |

---

### **Task 5 – Event delegation**

| Item          | Details                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Remove per‑anchor React handlers; delegate hover/click to one listener to reduce event objects.                                           |
| **Key files** | `TranslationAnchor.tsx`, **add** helpers in `LexaOverlayManager`.                                                                         |
| **Steps**     |                                                                                                                                           |
| 1             | Give every anchor `data-lexa-anchor-id=<nanoid>` attr.                                                                                    |
| 2             | Inside `LexaOverlayManager.useEffect` add `document.addEventListener('mouseenter', handler, true)` and `click` likewise.                  |
| 3             | `handler` resolves `e.target.closest('[data-lexa-anchor-id]')`, looks up translation data in the Map, and sets overlay state accordingly. |
| 4             | Remove HoverCard’s custom `mouseEnter/Leave` timers; overlay manager controls open/close centrally.                                       |
| **Done when** | Only **2** event listeners (mouseenter, click) are present on `document`; no per‑anchor listeners.                                        |

---

### **Task 6 – Remove manual unmount bookkeeping**

| Item          | Details                                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Goal**      | Rely on React unmount to clean portals; eliminate `unmountLexaRoots` / `processed` WeakSet.                                                                     |
| **Key files** | `injectTranslations.ts`, `mountLexaListener.tsx`.                                                                                                               |
| **Steps**     |                                                                                                                                                                 |
| 1             | In `injectTranslations` just call `window.__lexaRegisterAnchor(el,data)`. No WeakSet needed; overlay manager can ignore duplicates with its own Map `.has(el)`. |
| 2             | `mountLexaListener`’s cleanup function simply `root.unmount()`.                                                                                                 |
| **Done when** | Reload extension ➜ memory snapshot shows zero detached DOM nodes; no references to old anchor elements.                                                         |

---

### Acceptance & Validation Checklist

1. **E2E smoke test** on a page with 300 injected phrases – hover, click, note, quiz work.
2. Lighthouse (desktop) – “Total JS heap size” **< 12 MB**.
3. Performance panel – time‑to‑interactive after injection ≤ 300 ms (95 % CI).
4. Unit: A Jest test ensures `LexaOverlayManager.addAnchor` idempotently ignores the same span twice.
5. ESLint/TypeScript compile clean; no new TODOs.
