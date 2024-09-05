import { FC } from 'react'
import { ShadowRootComponent } from '../ShadowRootComponent'

interface Props {
  phrase: string
}

export const LexaPhrase: FC<Props> = ({ phrase }) => {
  return (
    <ShadowRootComponent
      stylesheet={`
    .lexa-phrase {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
  `}
    >
      {phrase}
    </ShadowRootComponent>
  )
}
