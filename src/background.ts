import './env'

import { queryClient } from './config/react-query'
import {
  onExtensionMessage,
  sendToContentScripts,
  SignOutMessage,
} from './lib/extension'

console.log('Background script loaded')

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.ignoredSites?.newValue) {
    sendToContentScripts({
      type: 'IGNORED_SITES_CHANGED',
      payload: null,
    })
  }
})

onExtensionMessage<SignOutMessage>('SIGN_OUT', () => {
  console.log('Background Received SIGN_OUT')
  console.log('queryClient', queryClient)
  queryClient.clear()
})
