import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { TranslationAnchor } from './TranslationAnchor'

export interface TranslationData {
  original: string
  translation: string
  context: string
}

export const LexaOverlayManager: React.FC = () => {
  const [anchors, setAnchors] = useState<Map<Element, TranslationData>>(
    new Map(),
  )

  useEffect(() => {
    // Expose global registration function
    window.__lexaRegisterAnchor = (element: Element, data: TranslationData) => {
      setAnchors((prev) => {
        // Ignore duplicates
        if (prev.has(element)) return prev

        const newMap = new Map(prev)
        newMap.set(element, data)
        return newMap
      })
    }

    // Cleanup function
    return () => {
      delete window.__lexaRegisterAnchor
    }
  }, [])

  // Render portals for each registered anchor
  return (
    <>
      {Array.from(anchors.entries()).map(([element, data]) =>
        createPortal(
          <TranslationAnchor
            key={`${data.original}-${data.translation}`}
            original={data.original}
            translation={data.translation}
            context={data.context}
          />,
          element,
        ),
      )}
    </>
  )
}

// Global type declaration
declare global {
  interface Window {
    __lexaRegisterAnchor?: (element: Element, data: TranslationData) => void
  }
}
