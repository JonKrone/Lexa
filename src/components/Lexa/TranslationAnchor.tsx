import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { usePrefetchTranslationDetails } from '../../queries/translation-details'
import { useRecordPhraseSeen } from '../../queries/user-phrase'
import { HoverCard } from '../HoverCard'
import { LexaCardContent } from './LexaCardContent'

export interface TranslationAnchorProps {
  translation: string
  original: string
  context: string
}

export const TranslationAnchor: React.FC<TranslationAnchorProps> = ({
  translation,
  original,
  context,
}) => {
  const recordPhraseSeen = useRecordPhraseSeen()
  const prefetchTanslationDetails = usePrefetchTranslationDetails(
    original,
    translation,
    context,
  )

  // Mark that we've seen this phrase again
  useEffect(() => {
    if (recordPhraseSeen.status !== 'idle') return

    recordPhraseSeen.mutate(original)
  }, [recordPhraseSeen.status])

  return (
    <HoverCard
      onHover={prefetchTanslationDetails}
      content={
        <LexaCardContent
          translation={translation}
          original={original}
          context={context}
        />
      }
    >
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          borderRadius: '4px',
          lineHeight: 'normal',
          position: 'relative',
          width: 'max-content',
          height: 'max-content',
          transition: 'all 250ms linear 0ms',
          boxShadow:
            'rgba(144, 202, 249, 0.3) 2px 0px 0px 0px, rgba(144, 202, 249, 0.3) -2px 0px 0px 0px',
          backgroundColor: 'rgba(144, 202, 249, 0.3)',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.7)',
          },
        }}
      >
        {translation}
      </Box>
    </HoverCard>
  )
}
