import React from 'react'
import { ComplexHoverCardContent } from './ComplexHoverCardContent'
import { HoverCard } from './HoverCard'

export const TranslatedSegment: React.FC<{
  translatedText: string
  originalText: string
}> = ({ translatedText, originalText }) => (
  <HoverCard content={<ComplexHoverCardContent originalText={originalText} />}>
    <span>{translatedText}</span>
  </HoverCard>
)
