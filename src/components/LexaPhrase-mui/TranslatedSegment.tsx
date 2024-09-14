import { Box } from '@mui/material'
import React from 'react'
import { ComplexHoverCardContent } from './ComplexHoverCardContent'
import { HoverCard } from './HoverCard'

export interface TranslatedSegmentProps {
  translatedText: string
  originalText: string
  context: string
}

export const TranslatedSegment: React.FC<TranslatedSegmentProps> = ({
  translatedText,
  originalText,
}) => (
  <HoverCard content={<ComplexHoverCardContent originalText={originalText} />}>
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
        boxShadow:
          'rgba(202, 228, 237, 0.5) 2px 0px 0px 0px, rgba(202, 228, 237, 0.5) -2px 0px 0px 0px',
        backgroundColor: 'rgba(202, 228, 237, 0.5)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(202, 228, 237, 0.7)',
        },
      }}
    >
      {translatedText}
    </Box>
  </HoverCard>
)
