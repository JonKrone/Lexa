import { FC, forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from '../index.css?inline'
console.log('not-italic?', styles.includes('not-italic'))
console.log('decoration-solid?', styles.includes('decoration-solid'))

interface Props {
  element: HTMLElement
  children: React.ReactNode
  styleContent: string
}

const useStylesheet = () => {
  const stylesheet = useRef<CSSStyleSheet>(new CSSStyleSheet())

  useEffect(() => {
    stylesheet.current.replaceSync(`${styles}`)
  }, [styles])

  return stylesheet.current
}

export const ShadowRootComponent: FC<Props> = forwardRef(
  ({ element, children, styleContent }, ref) => {
    const stylesheet = useStylesheet()
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
    const debug = element.id === 'lexa-hover-card-container'
    if (debug) {
      console.log(
        'shadowRoot',
        shadowRoot,
        shadowRoot?.adoptedStyleSheets[0].cssRules,
      )
      for (const rule of shadowRoot?.adoptedStyleSheets[0]?.cssRules ?? []) {
        if (
          rule?.cssText?.includes('text-red') ||
          rule?.cssText?.includes('decoration-solid')
        ) {
          console.log('rule', rule.cssText)
        }
      }
    }

    useEffect(() => {
      const shdwRoot = element.shadowRoot
        ? element.shadowRoot
        : element.attachShadow({ mode: 'open' })
      setShadowRoot(shdwRoot)

      if (shdwRoot) {
        shdwRoot.adoptedStyleSheets = [stylesheet]

        // Find existing style tag or create a new one
        let styleElement = shdwRoot.querySelector('style[data-lexa-styles]')
        if (!styleElement) {
          styleElement = document.createElement('style')
          styleElement.setAttribute('data-lexa-styles', '')
          shdwRoot.appendChild(styleElement)
        }

        styleElement.textContent = styles + ' ' + styleContent
        // console.log('textContent', styleElement.textContent)
      }
    }, [element, styleContent, stylesheet])

    if (!shadowRoot) return null

    return createPortal(children, shadowRoot)
  },
)
