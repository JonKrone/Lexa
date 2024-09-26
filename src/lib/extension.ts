import { User } from '@supabase/supabase-js'

interface ExtensionMessage<K extends string, T = unknown> {
  type: K
  payload: T
}

type SignInWithOtpMessage = ExtensionMessage<'SIGN_IN_WITH_OTP', User>
type SignOutMessage = ExtensionMessage<'SIGN_OUT'>

type ExtensionMessages = SignInWithOtpMessage | SignOutMessage

export function sendExtensionMessage<T extends ExtensionMessages>(
  message: T,
): Promise<any> {
  console.log('sending message', message)

  return new Promise((resolve, reject) => {
    // Send message to other extension parts
    chrome.runtime.sendMessage(message, (response) => {
      // TODO: Unsure how best to handle this.
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }

      // Forward message to content scripts
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, message, (_response) => {
              // Optionally handle response from content scripts
              if (chrome.runtime.lastError) {
                // console.error(
                //   `Error sending message to tab ${tab.id}:`,
                //   chrome.runtime.lastError,
                // )
              }
            })
          }
        })
      })
    })
  })
}

export function onExtensionMessage<T extends ExtensionMessages>(
  key: T['type'],
  callback: (message: T['payload']) => void,
): void {
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.type === key) {
      callback(message.payload)
      // If you need to send a response asynchronously, return true
      // sendResponse(/* your response */)
      // return true
    }
  })
}
