import React from 'react'
import ReactDOM from 'react-dom/client'
import { LexaRoot } from './LexaRoot'

export function mountLexaRoot(element: HTMLElement, phrase: string) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <div className="text-red-500">
        <LexaRoot element={element} originalPhrase={phrase} />
      </div>
    </React.StrictMode>,
  )
}
