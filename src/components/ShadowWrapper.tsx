import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import React, { useMemo, useState } from 'react'
import shadow from 'react-shadow'

interface ShadowWrapperProps {
  children: React.ReactNode
}

export const ShadowWrapper: React.FC<ShadowWrapperProps> = ({ children }) => {
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null)

  /* cache created once the shadow host exists */
  const cache = useMemo(
    () =>
      rootEl
        ? createCache({
            key: 'lexa',
            container: rootEl.shadowRoot!,
            prepend: true,
          })
        : null,
    [rootEl],
  )

  return (
    <shadow.div
      ref={(el: HTMLDivElement) => setRootEl(el)}
      className="lexa-shadow-root"
      style={{ all: 'initial' }} /* optional global reset */
    >
      {cache && <CacheProvider value={cache}>{children}</CacheProvider>}
    </shadow.div>
  )
}
