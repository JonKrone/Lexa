import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { theme } from '../config/theme'

const cacheCache = new Map()

interface ShadowDOMProps {
  children: React.ReactNode
  as?: 'div' | 'span'
}

export const ShadowDOM: React.FC<ShadowDOMProps> = ({
  children,
  as = 'span',
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    const shadowRoot =
      hostRef.current.shadowRoot ??
      hostRef.current.attachShadow({ mode: 'open' })

    if (!cacheCache.has(shadowRoot)) {
      const cache = createCache({
        key: 'shadow-styles',
        prepend: true,
        container: shadowRoot,
      })
      cacheCache.set(shadowRoot, cache)
    }

    const reactDOMRoot = ReactDOM.createRoot(shadowRoot)
    reactDOMRoot.render(
      <CacheProvider value={cacheCache.get(shadowRoot)}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>,
    )

    return () => {
      hostRef.current = null
      setTimeout(() => {
        reactDOMRoot.unmount()
      })
    }
  }, [children])

  return React.createElement(as, {
    className: 'lexa-shadow-root',
    ref: hostRef,
  })
}
