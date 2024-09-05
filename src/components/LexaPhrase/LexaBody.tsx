import * as HoverCard from '@radix-ui/react-hover-card'
import { Button, Card, Theme } from '@radix-ui/themes'
import { Check, Star, X } from 'lucide-react'
import { FC } from 'react'

interface Props {
  originalPhrase: string
  translation?: string
}

export const LexaBody: FC<Props> = ({
  originalPhrase,
  translation = 'guion',
}) => {
  // console.log('element', element)
  // prevElement = element.cloneNode(true) as HTMLElement
  // console.log('prevElement', prevElement)

  // To replace the original phrase with the translation, we need to find the substring that matches the original phrase and replace it with the the below component.
  // const text = element.textContent!
  // console.log('text', text)
  // const index = text.indexOf(originalPhrase)
  // console.log('index', index)
  // const substring = text.substring(index, index + originalPhrase.length)
  // console.log('substring', substring)

  // console.log('html:', prevElement.innerHTML)
  // replaceTextInElement(prevElement, originalPhrase, translation)
  // console.log('html:', prevElement.innerHTML)
  // return null

  return (
    <span
      className="lexa-body"
      style={{
        display: 'inline-block',
        borderRadius: '2px',
        lineHeight: 'normal',
        position: 'relative',
        width: 'max-content',
        height: 'max-content',
        transition: 'all 250ms linear 0ms',
        boxShadow:
          'rgba(202, 228, 237, 0.5) 2px 0px 0px 0px, rgba(202, 228, 237, 0.5) -2px 0px 0px 0px',
        backgroundColor: 'rgba(202, 228, 237, 0.5)',
      }}
    >
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span>{translation}</span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <Theme>
            <LexaHoverCard
              originalText={originalPhrase}
              translatedText={translation}
              onStar={() => console.log('Starred')}
              onIgnore={() => console.log('Ignored')}
              onMarkKnown={() => console.log('Marked as known')}
            />
          </Theme>
        </HoverCard.Portal>
      </HoverCard.Root>
    </span>
  )
}

interface LanguageLearningHoverCardProps {
  originalText: string
  translatedText: string
  onStar: () => void
  onIgnore: () => void
  onMarkKnown: () => void
}

export const LexaHoverCard = (
  {
    originalText,
    translatedText,
    onStar,
    onIgnore,
    onMarkKnown,
  }: LanguageLearningHoverCardProps = {
    originalText: 'Example',
    translatedText: 'Ejemplo',
    onStar: () => console.log('Starred'),
    onIgnore: () => console.log('Ignored'),
    onMarkKnown: () => console.log('Marked as known'),
  },
) => {
  return (
    <HoverCard.Content
      className="w-72 p-0 bg-background border border-border rounded-md shadow-md"
      sideOffset={5}
    >
      <Card>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{translatedText}</p>
              <p className="text-sm text-muted-foreground">{originalText}</p>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="1"
                onClick={onStar}
                aria-label="Star word"
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="1"
                onClick={onIgnore}
                aria-label="Ignore word"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="1"
                onClick={onMarkKnown}
                aria-label="Mark as known"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <HoverCard.Arrow className="fill-border" />
    </HoverCard.Content>
  )
}
