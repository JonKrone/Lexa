import ReactDOM from 'react-dom/client'
import { Providers } from '../Providers'
import { ShadowDOM } from '../ShadowDOM'
import { LexaRoot, LexaRootProps } from './LexaRoot'

export function mountLexaRoot(range: Range, translation: LexaRootProps): void {
  // Create a wrapper element
  const customElement = document.createElement('span')
  customElement.textContent = translation.translation
  customElement.dataset.originalText = translation.original
  customElement.classList.add('lexa-root-node')

  customElement.style.display = 'inline-block'
  // customElement.style.all = 'unset'
  customElement.style.willChange = 'opacity'
  customElement.style.transitionProperty = 'opacity'
  customElement.style.transitionDuration = '200ms'
  customElement.style.transitionTimingFunction = 'ease-in-out'
  customElement.style.opacity = '1'
  customElement.classList.add('lexa-test-wrapper')

  // Render the LexaRoot
  ReactDOM.createRoot(customElement).render(
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
