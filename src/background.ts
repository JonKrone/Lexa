console.log('Background script loaded')

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SELECTED_TEXT') {
    // console.log('Selected text:', message.text)
    // Here you could process the selected text, e.g., translate it or add it to the user's vocab list
    // You might want to use chrome.storage to persist data
    // chrome.storage.local.set({ lastSelectedText: message.text })
  }
})

// You could also set up periodic tasks here, e.g., to refresh the user's word list
// chrome.alarms.create('refreshWordList', { periodInMinutes: 60 })
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'refreshWordList') {
//     // Refresh the word list
//   }
// })
