import React from 'react'
import ReactDOM from 'react-dom/client'
import { LexaRoot } from './LexaRoot'

export function mountLexaRoot(element: HTMLElement, phrase: string) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <LexaRoot element={element} originalPhrase={phrase} />
    </React.StrictMode>,
  )
}
