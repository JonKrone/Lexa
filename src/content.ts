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

setTimeout(() => {
  function replaceTextWithComponent(node: Node) {
    console.log('replaceTextWithComponent', node)
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      // This is a simplified example. In reality, you'd have a more sophisticated
      // mechanism to decide which words to replace.
      const words = text.split(/\s+/)
      const fragment = document.createDocumentFragment()

      words.forEach((word) => {
        if (shouldReplace(word)) {
          const lexaWord = document.createElement('lexa-word')
          lexaWord.setAttribute('data-original', word)
          lexaWord.setAttribute('data-translation', translate(word))
          fragment.appendChild(lexaWord)
        } else {
          fragment.appendChild(document.createTextNode(word + ' '))
        }
      })

      if (node.parentNode) {
        node.parentNode.replaceChild(fragment, node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
      node.childNodes.forEach(replaceTextWithComponent)
    }
  }

  // Helper functions (to be implemented)
  function shouldReplace(word: string): boolean {
    // Logic to determine if a word should be replaced
    // This could involve checking against a list of words to translate,
    // or using some heuristic based on the user's learning level
    return Math.random() < 0.1 // Example: replace 10% of words randomly
  }

  function translate(word: string): string {
    // Logic to translate the word
    // This could involve calling an API or checking against a local dictionary
    return `Translated: ${word}` // Placeholder implementation
  }

  // Start the replacement process
  replaceTextWithComponent(document.body)
}, 1000)
