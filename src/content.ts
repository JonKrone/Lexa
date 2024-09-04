console.log('Content script loaded')

// Your content script logic will go here
// For example, you might want to scan the page for words in the target language

document.body.addEventListener('mouseup', () => {
  const selectedText = window.getSelection()?.toString().trim()
  if (selectedText) {
    // Here you could send the selected text to your background script
    // for translation or to add to the user's vocabulary list
    chrome.runtime.sendMessage({ type: 'SELECTED_TEXT', text: selectedText })
  }
})
