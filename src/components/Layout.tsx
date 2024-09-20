import { Box } from '@mui/material'
import { FC, Suspense } from 'react'
import { Redirect, useLocation } from 'wouter'
import { isFullPageView } from '../lib/utils'
import { useIsAuthenticated } from '../queries/auth'
import { Body2, H2 } from './Typography'

export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFullTabView = isFullPageView()

  return (
    <Box sx={{ display: 'flex', placeContent: 'center' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={!isFullTabView ? { width: 350, height: 500, p: 2 } : {}}>
          <AuthGuard>
            <header>
              <H2>Lexa</H2>
              <Body2>Your personal language learning assistant</Body2>
            </header>
            {children}
          </AuthGuard>
        </Box>
      </Suspense>
    </Box>
  )
}

const AuthGuard: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation()
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Redirect to={`/auth/login?next=${encodeURIComponent(location)}`} />
  }

  return children
}
