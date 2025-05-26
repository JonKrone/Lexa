import { AuthResponse } from '@supabase/supabase-js'

interface ExtensionMessage<K extends string, T = unknown> {
  type: K
  payload: T
}

export type SignInWithOtpMessage = ExtensionMessage<
  'OTP_VERIFIED',
  AuthResponse['data']
>

export type SignOutMessage = ExtensionMessage<'SIGN_OUT'>

export type IgnoredSitesChangedMessage = ExtensionMessage<
  'IGNORED_SITES_CHANGED',
  null
>

export type ExtensionMessages =
  | SignInWithOtpMessage
  | SignOutMessage
  | IgnoredSitesChangedMessage

export function sendExtensionMessage<T extends ExtensionMessages>(message: T) {
  sendToBackgroundScript(message)
  sendToContentScripts(message)
}

export function onExtensionMessage<T extends ExtensionMessages>(
  key: T['type'],
  callback: (message: T['payload']) => void,
): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === key) {
      callback(message.payload)
      // If you need to send a response asynchronously, return true
      // sendResponse(/* your response */)
      // return true
    }
  })
}

function sendToBackgroundScript<T extends ExtensionMessages>(message: T): void {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        'Error sending message to background script:',
        chrome.runtime.lastError,
      )
    }
  })
}

export function sendToContentScripts<T extends ExtensionMessages>(
  message: T,
): void {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id) continue // Tab is, i.e. DevTools tab or chrome://

      chrome.tabs.sendMessage(tab.id, message)
    }
  })
}

/**
 * Whether the executing script is a service worker, which is the part of our extension that runs
 * in the background.
 */
export function isServiceWorker() {
  try {
    // @ts-expect-error: ServiceWorkerGlobalScope is not defined in TypeScript.
    return self instanceof ServiceWorkerGlobalScope
  } catch (e) {
    return false
  }
}

/**
 * Whether the executing script is a popup, which is the part of our extension that is the popup
 * that opens when you click the extension icon or when you're on the chrome-extension://... page.
 */
export function isPopup() {
  return !isServiceWorker() && !!chrome.runtime.getBackgroundPage
}

/**
 * Whether the executing script is a content script, which is the part of our extension that runs in
 * the user's browser page.
 */
export function isContentScript() {
  return !isServiceWorker() && !chrome.runtime.getBackgroundPage
}
