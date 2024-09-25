import { Box, useTheme } from '@mui/material'
import React from 'react'
import { usePrefetchTranslationDetails } from '../../queries/translation-details'
import { HoverCard } from '../HoverCard'
import { LexaCardContent } from './LexaCardContent'

export interface LexaRootProps {
  translation: string
  original: string
  context: string
}

export const LexaRoot: React.FC<LexaRootProps> = ({
  translation,
  original,
  context,
}) => {
  const theme = useTheme()
  const prefetchTanslationDetails = usePrefetchTranslationDetails(
    original,
    translation,
    context,
  )

  return (
    <HoverCard
      onHover={prefetchTanslationDetails}
      content={<LexaCardContent {...{ translation, original, context }} />}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          borderRadius: '2px',
          lineHeight: 'normal',
          position: 'relative',
          width: 'max-content',
          height: 'max-content',
          transition: 'all 250ms linear 0ms',
          // boxShadow:
          //   'rgba(202, 228, 237, 0.5) 2px 0px 0px 0px, rgba(202, 228, 237, 0.5) -2px 0px 0px 0px',
          // backgroundColor: 'rgba(202, 228, 237, 0.5)',
          boxShadow: `${theme.palette.primary.main} 2px 0px 0px 0px, ${theme.palette.primary.main} -2px 0px 0px 0px`,
          backgroundColor: `${theme.palette.primary.main}`,
          cursor: 'pointer',
          '&:hover': {
            // backgroundColor: 'rgba(202, 228, 237, 0.7)',
            backgroundColor: 'rgba(128, 0, 128, 0.7)',
          },
        }}
      >
        {translation}
      </Box>
    </HoverCard>
  )
}
