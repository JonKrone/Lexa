import { generatePageTranslations } from './ai/generatePageTranslations'
import { mountLexaRoot } from './components/LexaPhrase-mui/mountLexaRoot'
import { htmlToMarkdown } from './utils/htmlToMarkdown'
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
    const fragment = document.createDocumentFragment()

    parts.forEach((part, index) => {
      fragment.appendChild(document.createTextNode(part))
      if (index < parts.length - 1) {
        const span = document.createElement('span')
        span.className = 'lexa-root-node'
        fragment.appendChild(span)
        mountLexaRoot(span, _replacementHTML)
        // span.className = 'lexa-root-node'
      }
    })

    parent?.replaceChild(fragment, textNode)
  })
}

async function initializeLexaExtension() {
  const isIgnored = await isCurrentSiteIgnored()

  if (isIgnored) {
    console.log('Lexa is disabled for this site')
    return
  } else {
    console.log('Lexa is active on this site')
  }

  // Initialize Lexa functionality
  // For now, just working on the crxjs.dev site for testing the extension
  if (window.location.href.includes('https://crxjs.dev/')) {
    const markdown = htmlToMarkdown(document.body)
    console.log('Markdown:', markdown)

    const result = generatePageTranslations(markdown, {
      targetLanguage: 'Spanish',
      learningGoals: 'Learn Spanish',
      proficiencyLevel: 'Intermediate',
      preferredPhraseLength: 'Short',
      translationDensityPercent: 10,
    })
    console.log('Result:', result)

    // replaceTextInElement(element as HTMLElement, 'script', 'guion')
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
