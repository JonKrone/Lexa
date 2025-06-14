# Lexa Extension - Unique Chrome Extension Patterns

This document outlines the sophisticated patterns and architectures unique to the Lexa language learning extension.

## Multi-Root React Management Pattern

### Dynamic React Root Tracking

```typescript
// Pattern: Track multiple React roots for proper cleanup
interface LexaRootWrapper {
  root: ReactDOM.Root
  originalText: string
  range: Range
}

let lexaRoots: LexaRootWrapper[] = []
```

### Coordinated Cleanup System

```typescript
// Pattern: Clean up all React roots on logout/disable
export function unmountLexaRoots() {
  for (const wrapper of lexaRoots) {
    wrapper.root.unmount()
    wrapper.range.deleteContents()
    wrapper.range.insertNode(document.createTextNode(wrapper.originalText))
  }
  lexaRoots = []
}
```

**Key Insight**: The extension creates multiple React roots dynamically in the host page's DOM. Each root must be tracked and properly cleaned up to prevent memory leaks and restore original content.

## Shadow DOM Isolation Pattern

### Isolated React Rendering

```typescript
// Pattern: Render React in Shadow DOM with style isolation
export const ShadowDOM: React.FC<ShadowDOMProps> = ({ children, as = 'span' }) => {
  const shadowRoot = hostRef.current.attachShadow({ mode: 'open' })

  // Create isolated Emotion cache per Shadow DOM
  const cache = createCache({
    key: 'shadow-styles',
    container: shadowRoot,
  })

  ReactDOM.createRoot(shadowRoot).render(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  )
}
```

**Key Insight**: Each translation uses Shadow DOM to prevent CSS conflicts with the host page. Emotion caches are isolated per Shadow DOM instance.

## Conditional Extension Activation Pattern

### Site-Specific and Auth-Dependent Mounting

```typescript
// Pattern: Conditional activation based on multiple factors
async function initializeLexaExtension() {
  const isIgnored = await isCurrentSiteIgnored()

  if (isIgnored) return
  if (!location.href.includes('crxjs.dev')) return // Dev restriction
  if (!settings) return // Auth requirement

  unmountLexaListener = mountLexaListener()
}
```

### Dynamic State Changes

```typescript
// Pattern: React to auth and settings changes
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'IGNORED_SITES_UPDATED') {
    initializeLexaExtension() // Re-evaluate activation
  }
})

onExtensionMessage<SignOutMessage>('SIGN_OUT', () => {
  unmountLexaListener?.()
  unmountLexaListener = null
})
```

**Key Insight**: Extension activation is conditional and dynamic, responding to auth state, site preferences, and runtime messages.

## DOM Range-Based Text Replacement Pattern

### Precise Text Node Manipulation

```typescript
// Pattern: Replace text with React components using DOM ranges
function replaceTextWithElement(
  textNode: Text,
  index: number,
  translation: ITranslation,
) {
  const range = document.createRange()
  range.setStart(textNode, index)
  range.setEnd(textNode, index + translation.original.length)

  // Replace range content with React root
  mountLexaRoot(range, translation)
}
```

### Context-Aware Text Matching

```typescript
// Pattern: Verify context before replacement
function findAndReplaceTextNode(textNodes: Text[], translation: ITranslation) {
  const normalizedTranslationContext = normalizeText(translation.context)

  for (const textNode of textNodes) {
    const nodeContext = normalizeText(getNodeContext(textNode))

    // Only replace if context matches
    if (nodeContext.includes(normalizedTranslationContext)) {
      replaceTextWithElement(textNode, actualIndex, translation)
    }
  }
}
```

**Key Insight**: Text replacement uses DOM ranges for precision and context verification to ensure accurate replacements.

## AI Streaming DOM Integration Pattern

### Real-Time Translation Streaming

```typescript
// Pattern: Stream AI results directly into DOM using AI SDK v5
import { generateObject } from 'ai'
import { Models } from '@/ai/models'

useEffect(() => {
  const doTranslations = async () => {
    const result = await generateObject({
      model: Models.openai.gpt41Mini, // Use latest models
      schema: TranslationArraySchema,
      prompt: `Translate these text segments: ${markdown}`,
    })

    // Process structured output
    for (const translation of result.object) {
      replaceTextSegments(document.body, [translation])
    }
  }

  doTranslations()
}, [settings])
```

### Structured AI Output with AI SDK v5

```typescript
// Pattern: Use Zod schemas with AI SDK v5 provider pattern
import { generateObject, streamObject } from 'ai'
import { Models } from '@/ai/models'

const TranslationSchema = z.object({
  original: z.string().describe('The exact text segment from the markdown.'),
  translation: z.string().describe('The translated text.'),
  context: z.string().describe('Surrounding text or sentence for reference.'),
})

// For streaming responses
const result = await streamObject({
  model: Models.openai.gpt41,
  schema: z.array(TranslationSchema),
  prompt: 'Translate these segments...',
})

// For immediate structured output
const result = await generateObject({
  model: Models.openai.gpt41Mini,
  schema: TranslationSchema,
  prompt: 'Translate this text...',
})
```

**Key Insight**: AI SDK v5 provides enhanced type safety with dedicated providers and supports both streaming and immediate structured outputs.

## Extension Context Detection Pattern

### Runtime Environment Awareness

```typescript
// Pattern: Detect execution context
export function isServiceWorker() {
  try {
    return self instanceof ServiceWorkerGlobalScope
  } catch (e) {
    return false
  }
}

export function isContentScript() {
  return !isServiceWorker() && !chrome.runtime.getBackgroundPage
}
```

### Context-Specific Behavior

```typescript
// Pattern: Adapt behavior based on execution context
if (isContentScript()) {
  // Content script specific logic
  initializeLexaExtension()
} else if (isServiceWorker()) {
  // Background script logic
  chrome.runtime.onInstalled.addListener(/* ... */)
}
```

**Key Insight**: The extension detects its execution context and adapts behavior accordingly.

## Typed Extension Messaging Pattern

### Type-Safe Message Passing

```typescript
// Pattern: Strongly typed message system
interface ExtensionMessage<K extends string, T = unknown> {
  type: K
  payload: T
}

export type SignInWithOtpMessage = ExtensionMessage<
  'OTP_VERIFIED',
  AuthResponse['data']
>
export type SignOutMessage = ExtensionMessage<'SIGN_OUT'>

// Type-safe message handling
onExtensionMessage<SignInWithOtpMessage>('OTP_VERIFIED', (data) => {
  // data is properly typed as AuthResponse['data']
  queryClient.setQueryData(['auth', 'user'], { user: data.user })
})
```

**Key Insight**: All extension messaging is type-safe with proper TypeScript interfaces.

## Error Handling in Host Pages Pattern

### Graceful Error Isolation

```typescript
// Pattern: Prevent extension errors from affecting host page
const root = ReactDOM.createRoot(customElement, {
  onCaughtError(error) {
    if (__DEBUG__) {
      console.log('Lexa caught error', error)
    }
    // Swallow errors to keep host page console clean
  },
})
```

**Key Insight**: Extension errors are isolated and logged separately to avoid polluting the host page's console.

## Key Implementation Guidelines

1. **Always track React roots** for proper cleanup
2. **Use Shadow DOM** for style isolation in content scripts
3. **Verify context** before DOM manipulation
4. **Stream AI responses** for better UX
5. **Detect execution context** for appropriate behavior
6. **Type all extension messages** for safety
7. **Isolate errors** to prevent host page interference
8. **Clean up resources** on auth changes and unmount
