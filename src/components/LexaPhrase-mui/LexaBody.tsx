// import * as HoverCard from '@radix-ui/react-hover-card'
// import { Button, Card, Theme } from '@radix-ui/themes'
import { Card, CardContent, Tooltip, Typography } from '@mui/material'
// import { Tooltip } from '@radix-ui/themes'
import { FC, useState } from 'react'

interface Props {
  originalPhrase: string
  translation?: string
}

export const LexaBody: FC<Props> = ({
  originalPhrase,
  translation = 'guion',
}) => {
  const [shadowRootRef, setShadowRootRef] = useState<HTMLDivElement | null>(
    null,
  )
  // console.log('shadowRootRef', shadowRootRef)
  console.log('shadowRootRef', shadowRootRef)

  return (
    <span
      className="lexa-body text-start"
      style={{
        display: 'inline-block',
        borderRadius: '2px',
        lineHeight: 'normal',
        position: 'relative',
        width: 'max-content',
        height: 'max-content',
        transition: 'all 250ms linear 0ms',
        // boxShadow:
        // 'rgba(202, 228, 237, 0.5) 2px 0px 0px 0px, rgba(202, 228, 237, 0.5) -2px 0px 0px 0px',
        // backgroundColor: 'rgba(202, 228, 237, 0.5)',
      }}
    >
      <Tooltip
        title={
          <Card>
            <CardContent>
              <div>
                <Typography variant="h6">{translation}</Typography>
                <Typography variant="body2">{originalPhrase}</Typography>
              </div>
            </CardContent>
          </Card>
        }
      >
        <span>{translation}</span>
      </Tooltip>
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

// export const LexaHoverCard = (
//   {
//     originalText,
//     translatedText,
//     onStar,
//     onIgnore,
//     onMarkKnown,
//   }: LanguageLearningHoverCardProps = {
//     originalText: 'Example',
//     translatedText: 'Ejemplo',
//     onStar: () => console.log('Starred'),
//     onIgnore: () => console.log('Ignored'),
//     onMarkKnown: () => console.log('Marked as known'),
//   },
// ) => {
//   const hoverCardPortalRef = useRef<HTMLDivElement>(null)
//   // <ShadowRootComponent
//   //     element={hoverCardPortalRef.current}
//   //     styleContent={`
//   //       .lexa-root-node {
//   //         all: unset;
//   //         will-change: opacity;
//   //         transition-property: opacity;
//   //         transition-duration: 200ms;
//   //         transition-timing-function: ease-in-out;
//   //         opacity: 1;
//   //         `}
//   //   >

//   return (
//     <HoverCard.Content
//       className="w-72 p-0 bg-background border border-border rounded-md shadow-md "
//       sideOffset={5}
//     >
//       <Card>
//         <div className="flex flex-col space-y-2">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="font-semibold text-red-500 !text-red-500">
//                 {translatedText}
//               </p>
//               <p className="text-sm text-muted-foreground">{originalText}</p>
//             </div>
//             <div className="flex space-x-1">
//               {/**
//                * TODO: Add a button to expand the translation boundary, i.e. translate the whole sentence or next word.
//                */}
//               <Button
//                 variant="outline"
//                 size="1"
//                 onClick={onStar}
//                 aria-label="Star word"
//               >
//                 <Star className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="1"
//                 onClick={onIgnore}
//                 aria-label="Ignore word"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="1"
//                 onClick={onMarkKnown}
//                 aria-label="Mark as known"
//               >
//                 <Check className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Card>
//       <HoverCard.Arrow className="fill-border" />
//     </HoverCard.Content>
//   )
// }
