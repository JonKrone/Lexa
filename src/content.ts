import './env'

import { mountLexaListener } from './components/LexaListener'
import { queryClient } from './config/react-query'
import { onExtensionMessage } from './lib/extension'
import { isCurrentSiteIgnored } from './lib/storage'

console.log('Content script loaded')

async function initializeLexaExtension() {
  const isIgnored = await isCurrentSiteIgnored()

  if (isIgnored) {
    if (__DEBUG__) {
      console.log('Lexa is disabled for this site')
    }
    return
  } else {
    // For now, we only want to translate crxjs.dev
    if (!location.href.includes('crxjs.dev')) {
      return
    }

    if (__DEBUG__) {
      console.log('Lexa is active on this site')
    }
  }

  mountLexaListener()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLexaExtension)
} else {
  initializeLexaExtension()
}

// Listen for updates to the ignored sites list
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'IGNORED_SITES_UPDATED') {
    initializeLexaExtension()
  }
})

onExtensionMessage('SIGN_IN_WITH_OTP', (data) => {
  console.log('Received SIGN_IN_WITH_OTP', data)
  queryClient.setQueryData(['auth', 'user'], data)
  queryClient.invalidateQueries({ queryKey: ['auth'] })
  queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
  queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
})

onExtensionMessage('SIGN_OUT', () => {
  console.log('Received SIGN_OUT')
  queryClient.clear()
  queryClient.getQueryCache().clear()
})
