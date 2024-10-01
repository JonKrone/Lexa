import './env'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Providers } from './components/Providers'
import { WholeAppErrorBoundary } from './components/WholeAppErrorBoundary'
import { queryClient } from './config/react-query'
import './index.css'
import { onExtensionMessage, SignInWithOtpMessage } from './lib/extension'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WholeAppErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </WholeAppErrorBoundary>
  </React.StrictMode>,
)

onExtensionMessage<SignInWithOtpMessage>('OTP_VERIFIED', async (data) => {
  console.log('Main: Received OTP_VERIFIED', data)

  await queryClient.invalidateQueries({ predicate: () => true })
})
