import './env'

import { mountLexaListener } from './components/Lexa/mountLexaListener'
import { queryClient } from './config/react-query'
import { supabase } from './config/supabase'
import {
  onExtensionMessage,
  SignInWithOtpMessage,
  SignOutMessage,
} from './lib/extension'
import { isCurrentSiteIgnored } from './lib/storage'

console.log('Content script loaded')

let unmountLexaListener: null | (() => void) = null
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

  unmountLexaListener = mountLexaListener()
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

onExtensionMessage<SignInWithOtpMessage>('OTP_VERIFIED', async (data) => {
  console.log('Content: Received OTP_VERIFIED', data)
  const result = await supabase.auth.initialize()
  if (result.error) {
    console.error('Supabase initialization failed', result.error)
    return
  }

  queryClient.setQueryData(['auth', 'user'], { user: data.user })
  queryClient.setQueryData(['auth', 'session'], { session: data.session })

  initializeLexaExtension()
})

onExtensionMessage<SignOutMessage>('SIGN_OUT', () => {
  console.log('Received SIGN_OUT')
  queryClient.clear()
  unmountLexaListener?.()
  unmountLexaListener = null
  // queryClient.refetchQueries({ queryKey: ['auth'] })
  // queryClient.refetchQueries({ queryKey: ['auth', 'user'] })
  // queryClient.refetchQueries({ queryKey: ['auth', 'session'] })
})
