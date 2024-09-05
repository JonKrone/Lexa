import { FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
  stylesheet: string
}

export const ShadowRootComponent: FC<Props> = ({ children, stylesheet }) => {
  const host = useRef<HTMLDivElement>(null!)
  const shadowRoot = useRef<ShadowRoot | null>(null)

  useEffect(() => {
    if (!host.current) {
      host.current = document.createElement('div')
      host.current.setAttribute('class', 'shadow-root')
      document.body.appendChild(host.current)
    }

    if (!shadowRoot.current) {
      shadowRoot.current = host.current.attachShadow({ mode: 'open' })

      const styles = document.createElement('style')
      styles.textContent = stylesheet
      shadowRoot.current.appendChild(styles)
    }

    return () => {
      if (host.current) {
        document.body.removeChild(host.current)
      }
    }
  }, [stylesheet])

  if (!shadowRoot.current) {
    return null
  }

  return createPortal(children, shadowRoot.current)
}
