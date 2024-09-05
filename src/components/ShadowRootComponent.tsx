import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ShadowDomStyles = `/* @vite-plugin-inject-css */`

interface Props {
  element: HTMLElement
  children: React.ReactNode
  styleContent: string
}

const useDynamicCSSImport = () => {
  const [cssContent, setCssContent] = useState('')

  useEffect(() => {
    const loadCSS = async () => {
      try {
        // @ts-expect-error Importing from dist is not typed.
        const { default: manifest } = await import('/dist/.vite/manifest.json')
        const cssFileName = manifest['index.html'].css[0]
        const response = await fetch(chrome.runtime.getURL(`${cssFileName}`))
        const css = await response.text()
        setCssContent(css)
      } catch (error) {
        console.error('Failed to load CSS:', error)
      }
    }

    loadCSS()
  }, [])

  return cssContent
}

const useStylesheet = () => {
  const css = useDynamicCSSImport()
  const stylesheet = useRef<CSSStyleSheet>(new CSSStyleSheet())

  useEffect(() => {
    if (css) {
      console.log('css', css.length)
      stylesheet.current.replaceSync(`${css} span{font-size: 24px;}`)
      console.log('stylesheet', stylesheet.current)
    }
  }, [css])

  return stylesheet.current
}

export const ShadowRootComponent: FC<Props> = ({
  element,
  children,
  styleContent,
}) => {
  const stylesheet = useStylesheet()
  const host = useRef<HTMLElement | null>(null)
  const shadowRoot = useRef<ShadowRoot | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!host.current) {
      // host.current = element
      host.current = document.createElement('span')
      host.current.setAttribute('class', 'lexa-shadow-root')
      element.appendChild(host.current)
    }

    if (!shadowRoot.current) {
      shadowRoot.current = host.current.attachShadow({ mode: 'open' })

      // TODO: Convert to an constructed StyleSheet that can be reused across instances.
      const styles = document.createElement('style')
      styles.textContent = styleContent
      shadowRoot.current.adoptedStyleSheets = [stylesheet]
      shadowRoot.current.appendChild(styles)

      setIsReady(true)
    }

    return () => {
      if (host.current && host.current.parentNode === element) {
        element.removeChild(host.current)
      }
      shadowRoot.current = null
      host.current = null
    }
  }, [styleContent, stylesheet])

  if (!isReady || !shadowRoot.current) {
    return null
  }

  console.log('rendering')

  return createPortal(children, shadowRoot.current)
}
