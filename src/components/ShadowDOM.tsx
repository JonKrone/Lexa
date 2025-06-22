import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import React, { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ShadowDOMProps {
  children: React.ReactNode
}

// Cache emotion caches per shadow root
const cacheMap = new WeakMap<ShadowRoot, ReturnType<typeof createCache>>()

export const ShadowDOM: React.FC<ShadowDOMProps> = ({ children }) => {
  const hostRef = useRef<HTMLSpanElement>(null)
  const shadowRootRef = useRef<ShadowRoot | null>(null)

  useLayoutEffect(() => {
    if (!hostRef.current || shadowRootRef.current) return

    // Create shadow root
    shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' })

    // Create or get emotion cache for this shadow root
    if (!cacheMap.has(shadowRootRef.current)) {
      const cache = createCache({
        key: 'lexa',
        container: shadowRootRef.current,
        prepend: true,
      })
      cacheMap.set(shadowRootRef.current, cache)
    }
  }, [])

  const shadowRoot = shadowRootRef.current
  const cache = shadowRoot ? cacheMap.get(shadowRoot) : null

  return (
    <span ref={hostRef} className="lexa-shadow-root">
      {shadowRoot &&
        cache &&
        createPortal(
          <CacheProvider value={cache}>{children}</CacheProvider>,
          shadowRoot,
        )}
    </span>
  )
}
