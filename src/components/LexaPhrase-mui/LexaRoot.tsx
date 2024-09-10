import { FC } from 'react'
import { ShadowRootComponent } from '../_ShadowRootComponent'
import { LexaBody } from './LexaBody'

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
        <span className="lexa-body ">
          <LexaBody originalPhrase={originalPhrase} translation={translation} />
        </span>
      </span>
    </ShadowRootComponent>
  )
}
