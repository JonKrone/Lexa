import { FC } from 'react'
import { ShadowRootComponent } from '../ShadowRootComponent'
import { LexaBody } from './LexaBody'

// import styles from './../../../dist/src/index.css.js'
// console.log('styles', styles)

interface Props {
  element: HTMLElement
  originalPhrase: string
  translation?: string
}

export const LexaRoot: FC<Props> = ({
  element,
  originalPhrase,
  translation = 'guion',
}) => {
  return (
    <ShadowRootComponent
      element={element}
      styleContent={`
        .lexa-root-node {
          all: unset;
          will-change: opacity;
          transition-property: opacity;
          transition-duration: 200ms;
          transition-timing-function: ease-in-out;
          opacity: 1;
        }
      `}
    >
      <span className="lexa-root-node">
        <span className="lexa-body text-red-500">
          <LexaBody originalPhrase={originalPhrase} translation={translation} />
        </span>
      </span>
    </ShadowRootComponent>
  )
}
