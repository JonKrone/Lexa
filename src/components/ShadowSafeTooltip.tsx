import { Box, Popper } from '@mui/material'
import { useRef, useState } from 'react'
import { Subtitle2 } from './Typography'

interface ShadowSafeTooltipProps {
  title: React.ReactNode
  children: React.ReactNode
  enterDelay?: number
}

export const ShadowSafeTooltip: React.FC<ShadowSafeTooltipProps> = ({
  title,
  children,
  enterDelay = 0,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const enterTimeoutRef = useRef<number | null>(null)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    enterTimeoutRef.current = window.setTimeout(() => {
      setOpen(true)
    }, enterDelay)
  }

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current)
      enterTimeoutRef.current = null
    }
    setOpen(false)
  }

  const content =
    typeof title === 'string' ? (
      <Box sx={{ bgcolor: 'background.paper', p: 1, px: 2, borderRadius: 1 }}>
        <Subtitle2>{title}</Subtitle2>
      </Box>
    ) : (
      title
    )

  return (
    <>
      <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </span>
      <Popper
        open={open}
        anchorEl={anchorEl}
        disablePortal
        sx={{ zIndex: 10000 }}
      >
        {content}
      </Popper>
    </>
  )
}
