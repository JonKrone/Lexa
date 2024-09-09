import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from '../index.css?inline'
// console.log('styles', styles)
console.log('italic?', styles.includes('italic'))
console.log('uppercase?', styles.includes('uppercase'))
console.log('not-italic?', styles.includes('not-italic'))

// const ShadowDomStyles = `/* @vite-plugin-inject-css */`

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
        // TODO: This doesn't work in dev mode.
        // const { default: manifest } = await import(
        //   '/dist/.vite/manifest.json' as string
        // )
        // const cssFileName = manifest['index.html'].css[0]
        // const response = await fetch(chrome.runtime.getURL(`${cssFileName}`))
        // const css = await response.text()
        setCssContent('css')
      } catch (error) {
        console.error('Failed to load CSS:', error)
      }
    }

    loadCSS()
  }, [])

  return cssContent
}

const useStylesheet = () => {
  // const css = useDynamicCSSImport()
  const stylesheet = useRef<CSSStyleSheet>(new CSSStyleSheet())

  useEffect(() => {
    stylesheet.current.replaceSync(`${styles} span{font-size: 24px;}`)
    // if (css) {
    //   console.log('css', css.length, css.includes('decoration-solid'))
    //   console.log('stylesheet', stylesheet.current)
    // }
  }, [styles])

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

  return createPortal(children, shadowRoot.current)
}
