import { Box, Popper } from '@mui/material'
import { useState } from 'react'
import { Subtitle2 } from './Typography'

interface ShadowSafeTooltipProps {
  title: React.ReactNode
  children: React.ReactNode
}

export const ShadowSafeTooltip: React.FC<ShadowSafeTooltipProps> = ({
  title,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleMouseLeave = () => {
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
