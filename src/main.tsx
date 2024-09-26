import './env'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Providers } from './components/Providers'
import { WholeAppErrorBoundary } from './components/WholeAppErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WholeAppErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </WholeAppErrorBoundary>
  </React.StrictMode>,
)
