import { LexaListener } from './LexaListener'

import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { logger } from '../../lib/logger'
import { Providers } from '../Providers'
import { WholeAppErrorBoundary } from '../WholeAppErrorBoundary'
import { unmountLexaRoots } from './mountLexaRoot'

export const mountLexaListener = () => {
  const customElement = document.createElement('div')
  customElement.id = 'lexa-settings-listener'
  document.body.appendChild(customElement)

  logger.log('Mounting LexaListener')

  const root = ReactDOM.createRoot(customElement, {
    // React typically logs errors that are caught by an error boundary. Because our Lexa instances
    // are living within another website, we want to swallow any handled errors that happen to keep
    // the console clean.
    onCaughtError(error) {
      if (__DEBUG__ && typeof window !== 'undefined') {
        logger.log('LexaListener caught error', error)
      }
    },
  })

  root.render(
    <WholeAppErrorBoundary>
      <Providers>
        <Suspense fallback={<div>Loading...</div>}>
          <LexaListener />
        </Suspense>
      </Providers>
    </WholeAppErrorBoundary>,
  )

  return () => {
    logger.log('Unmounting LexaListener')
    root.unmount()
    unmountLexaRoots()
  }
}
