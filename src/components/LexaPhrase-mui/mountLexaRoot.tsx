import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import {
  Button,
  Card,
  CardContent,
  ClickAwayListener,
  Popper,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

const theme = createTheme()

const ComplexHoverCardContent: React.FC<{ originalText: string }> = ({
  originalText,
}) => {
  const [page, setPage] = useState(1)

  return (
    <Card>
      <CardContent>
        {page === 1 && (
          <>
            <Typography variant="h6">Original Text</Typography>
            <Typography>{originalText}</Typography>
            <Button onClick={() => setPage(2)}>More Info</Button>
          </>
        )}
        {page === 2 && (
          <>
            <Typography variant="h6">Additional Information</Typography>
            <Typography>
              Here you can add more details, etymology, usage examples, etc.
            </Typography>
            <Button onClick={() => setPage(1)}>Back</Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

const TranslatedSegment: React.FC<{
  translatedText: string
  originalText: string
}> = ({ translatedText, originalText }) => (
  <HoverCard content={<ComplexHoverCardContent originalText={originalText} />}>
    <span>{translatedText}</span>
  </HoverCard>
)

const HOVER_DELAY = 500 // milliseconds

const HoverCard: React.FC<{
  content: ReactElement
  children: React.ReactNode
}> = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsOpen(true)
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
    setIsOpen((prev) => !prev)
  }

  const handleClickAway = () => {
    setIsOpen(false)
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
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
      <div>
        <div
          className="lexa-hover-card-anchor"
          ref={anchorRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
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
          <ShadowDOM as="span">{content}</ShadowDOM>
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

const cacheCache = new Map()

// Function to mount the Lexa node
export function mountLexaRoot(node: Element, translatedText: string): void {
  const originalText = node.textContent || ''

  // Create a wrapper element
  const wrapper = document.createElement('span')
  wrapper.style.display = 'inline-block'
  wrapper.style.all = 'unset'
  wrapper.style.willChange = 'opacity'
  wrapper.style.transitionProperty = 'opacity'
  wrapper.style.transitionDuration = '200ms'
  wrapper.style.transitionTimingFunction = 'ease-in-out'
  wrapper.style.opacity = '1'

  // Replace the original node with our wrapper
  node.parentNode?.replaceChild(wrapper, node)

  // Render our React app inside the shadow DOM
  ReactDOM.createRoot(wrapper).render(
    <ShadowDOM as="span">
      <TranslatedSegment
        translatedText={translatedText}
        originalText={originalText}
      />
    </ShadowDOM>,
  )
}

const ShadowDOM: React.FC<{
  children: React.ReactNode
  as: 'div' | 'span'
}> = ({ children, as }) => {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    const shadowRoot =
      hostRef.current.shadowRoot ??
      hostRef.current.attachShadow({ mode: 'open' })

    if (!cacheCache.has(shadowRoot)) {
      const cache = createCache({
        key: 'shadow-styles',
        prepend: true,
        container: shadowRoot,
      })
      cacheCache.set(shadowRoot, cache)
    }

    const reactDOMRoot = ReactDOM.createRoot(shadowRoot)
    reactDOMRoot.render(
      <CacheProvider value={cacheCache.get(shadowRoot)}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>,
    )

    return () => {
      hostRef.current = null
      setTimeout(() => {
        reactDOMRoot.unmount()
      })
    }
  }, [children])

  return React.createElement(as, {
    className: 'lexa-shadow-root',
    ref: hostRef,
  })
}
