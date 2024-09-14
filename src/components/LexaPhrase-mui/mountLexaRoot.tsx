import ReactDOM from 'react-dom/client'
import { ShadowDOM } from './ShadowDOM'
import { TranslatedSegment, TranslatedSegmentProps } from './TranslatedSegment'

export function mountLexaRoot(
  node: Element,
  details: TranslatedSegmentProps,
): void {
  // Create a wrapper element
  const wrapper = document.createElement('span')
  wrapper.style.display = 'inline-block'
  // wrapper.style.all = 'unset'
  wrapper.style.willChange = 'opacity'
  wrapper.style.transitionProperty = 'opacity'
  wrapper.style.transitionDuration = '200ms'
  wrapper.style.transitionTimingFunction = 'ease-in-out'
  wrapper.style.opacity = '1'

  // Replace the original node with our wrapper
  node.parentNode?.replaceChild(wrapper, node)

  // Render our React app inside the shadow DOM
  ReactDOM.createRoot(wrapper).render(
    <ShadowDOM as="span">
      <TranslatedSegment {...details} />
    </ShadowDOM>,
  )
}
