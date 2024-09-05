import { mountLexaRoot } from './components/LexaPhrase/mountLexaRoot'
import { extractUsefulText } from './utils/extractUsefulText'
import { isCurrentSiteIgnored } from './utils/storage'

console.log('Content script loaded')

// Your content script logic will go here
// For example, you might want to scan the page for words in the target language

function replaceTextInElement(
  element: HTMLElement,
  searchText: string,
  _replacementHTML: string,
) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)
  const nodesToReplace = []
  let node

  // Find all text nodes containing the search text
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.includes(searchText)) {
      nodesToReplace.push(node)
    }
  }

  // Replace the text in each found node
  nodesToReplace.forEach((textNode) => {
    const parent = textNode.parentNode
    const parts = textNode.nodeValue!.split(searchText)
    console.log('parts', parts)
    const fragment = document.createDocumentFragment()

    parts.forEach((part, index) => {
      fragment.appendChild(document.createTextNode(part))
      if (index < parts.length - 1) {
        const span = document.createElement('span')
        fragment.appendChild(span)
        mountLexaRoot(span, part)
        // span.className = 'lexa-root-node'
        // span.innerHTML = replacementHTML
      }
    })

    parent?.replaceChild(fragment, textNode)
  })
}

async function initializeLexaExtension() {
  const isIgnored = await isCurrentSiteIgnored()
  if (!isIgnored) {
    // Initialize Lexa functionality
    const element = document.querySelector('#add-a-content-script')
    console.log('node', element)
    if (element && element.isConnected) {
      // mountLexaPhrase(element as HTMLElement, 'script')
      replaceTextInElement(element as HTMLElement, 'script', 'guion')
      return
    }
    console.log('Lexa is active on this site')
    // Add your Lexa initialization code here
    const markdown = extractUsefulText(document.body)
    console.log('Markdown:', markdown)
  } else {
    console.log('Lexa is disabled for this site')
  }
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
