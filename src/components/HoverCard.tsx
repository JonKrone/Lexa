import { Box, ClickAwayListener, Popper } from '@mui/material'
import React, { ReactElement, useEffect, useId, useRef } from 'react'
import { useActiveHoverCardId } from '../lib/store/hover-card'
import { ShadowWrapper } from './ShadowWrapper'

const HOVER_DELAY = 350

interface HoverCardProps {
  onHover: () => void
  content: ReactElement
  children: React.ReactNode
}

export const HoverCard: React.FC<HoverCardProps> = ({
  onHover,
  content,
  children,
}) => {
  const id = useId()
  const { activeId, setActiveId } = useActiveHoverCardId()
  const isOpen = activeId === id

  const anchorRef = useRef<HTMLDivElement | null>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    onHover()

    hoverTimerRef.current = setTimeout(() => {
      setActiveId(id)
    }, HOVER_DELAY)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const handleClick = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setActiveId(isOpen ? null : id)
  }

  const handleClickAway = () => {
    isOpen && setActiveId(null)
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setActiveId(null)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <span className="lexa-click-away-listener">
        <Box
          component="span"
          className="lexa-hover-card-anchor"
          ref={anchorRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{ display: 'inline' }}
        >
          {children}
        </Box>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ]}
        >
          <ShadowWrapper>{content}</ShadowWrapper>
        </Popper>
      </span>
    </ClickAwayListener>
  )
}
