import './env'

console.log('Background script loaded')

// TODO: Move types to a dedicated file
export type IgnoredSitesChangedMessage = {
  type: 'IGNORED_SITES_CHANGED'
}

export type LexaCrossBoundaryEvents = IgnoredSitesChangedMessage

// You could also set up periodic tasks here, e.g., to refresh the user's word list
// chrome.alarms.create('refreshWordList', { periodInMinutes: 60 })
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'refreshWordList') {
//     // Refresh the word list
//   }
// })

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.ignoredSites?.newValue) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.id) return // Tab is, i.e. DevTools tab or chrome://

        // Tell all tabs to check their ignored sites
        chrome.tabs.sendMessage(tab.id, {
          type: 'IGNORED_SITES_CHANGED',
        })
      })
    })
  }
})
