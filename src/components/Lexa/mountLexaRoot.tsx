import ReactDOM from 'react-dom/client'
import { Providers } from '../Providers'
import { ShadowDOM } from '../ShadowDOM'
import { LexaRoot, LexaRootProps } from './LexaRoot'

export const LEXA_ROOT_CLASS = 'lexa-root-node'

interface LexaRootWrapper {
  root: ReactDOM.Root
  originalText: string
  range: Range
}

// Keep track of all LexaRoots so we can unmount them when we logout or pause the extension.
let lexaRoots: LexaRootWrapper[] = []

/**
 * When we logout or pause the extension, we need to unmount the LexaRoots.
 * Otherwise, we'll have a bunch of unmounted React trees that are still hanging around.
 */
export function unmountLexaRoots() {
  for (const wrapper of lexaRoots) {
    wrapper.root.unmount()
    wrapper.range.deleteContents()
    wrapper.range.insertNode(document.createTextNode(wrapper.originalText))
  }

  lexaRoots = []
}

export function mountLexaRoot(range: Range, translation: LexaRootProps): void {
  // Create a wrapper element
  const customElement = document.createElement('span')
  customElement.textContent = translation.translation
  customElement.dataset.originalText = translation.original
  customElement.classList.add(LEXA_ROOT_CLASS)

  customElement.style.display = 'inline-block'
  // customElement.style.all = 'unset'
  customElement.style.willChange = 'opacity'
  customElement.style.transitionProperty = 'opacity'
  customElement.style.transitionDuration = '200ms'
  customElement.style.transitionTimingFunction = 'ease-in-out'
  customElement.style.opacity = '1'
  customElement.classList.add('lexa-test-wrapper')

  // Render the LexaRoot
  const root = ReactDOM.createRoot(customElement, {
    // React typically logs errors that are caught by an error boundary. Because our Lexa instances
    // are living within another website, we want to swallow any handled errors in order to keep the
    // console clean.
    onCaughtError(error) {
      if (__DEBUG__ && typeof window !== 'undefined') {
        console.log('Lexa: LexaListener caught error', error)
      }
    },
  })
  lexaRoots.push({ root, originalText: translation.original, range })

  root.render(
    <ShadowDOM as="span">
      <Providers>
        <LexaRoot {...translation} />
      </Providers>
    </ShadowDOM>,
  )

  // Replace the original text with the custom element
  range.deleteContents()
  range.insertNode(customElement)
}
