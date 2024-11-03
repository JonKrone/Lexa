import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  styled,
} from '@mui/material'
import { HomeIcon, School, SettingsIcon } from 'lucide-react'
import { FC, Suspense } from 'react'
import { Redirect, useLocation, useRoute } from 'wouter'
import { isFullPageView } from '../lib/utils'
import { useIsAuthenticated } from '../queries/auth'
import SnowflakeBackground from './SnowflakeBackground'
import { Body2, H2 } from './Typography'

export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useLocation()
  const isFullView = isFullPageView()

  const hasBottomNav = !useRoute(/^\/auth/)[0]
  const activeTab = location.split('/')[1]

  return (
    <Box sx={{ display: 'flex', placeContent: 'center' }}>
      <SnowflakeBackground opacity={0.1} speed={0.1} density={0.5} />
      <Box sx={{ width: 350, height: isFullView ? '100%' : 500 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthGuard>
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                height: '100vh',
              }}
            >
              <Box component="header" sx={{}}>
                <H2>Lexa</H2>
                <Body2>Your personal language learning assistant</Body2>
              </Box>
              <main
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingBottom: hasBottomNav ? 72 : 0,
                }}
              >
                {children}
              </main>
              <footer>
                {hasBottomNav && (
                  <BottomNavigation
                    value={activeTab}
                    onChange={(_, value) => setLocation(value)}
                    showLabels
                    sx={{
                      width: '100%',
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      borderTop: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <NavAction icon={<HomeIcon size={32} />} value="home" />
                    <NavAction icon={<School size={32} />} value="learn" />
                    <NavAction
                      icon={<SettingsIcon size={32} />}
                      value="settings"
                    />
                  </BottomNavigation>
                )}
              </footer>
            </Box>
          </AuthGuard>
        </Suspense>
      </Box>
    </Box>
  )
}

const NavAction = styled(BottomNavigationAction)`
  .MuiBottomNavigationAction-label {
    font-size: 0.875rem;
  }
  .MuiBottomNavigationAction-label.Mui-selected {
    font-size: 1rem;
  }
`

const AuthGuard: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation()
  const [isAuthPage] = useRoute(/^\/auth/)
  const isAuthenticated = useIsAuthenticated()

  // If not authenticated and not on an auth page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    let redirectUrl = '/auth/login'
    if (location !== '/' && location !== '/index.html') {
      const nextParam = encodeURIComponent(location)
      redirectUrl = `/auth/login?next=${nextParam}`
    }

    return <Redirect to={redirectUrl} />
  }

  // If authenticated and on an auth page, redirect to home or where the user was headed
  // This is the normal flow after login
  if (isAuthenticated && isAuthPage) {
    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get('next')
    const nextPath = nextParam ? decodeURIComponent(nextParam) : '/home'
    return <Redirect to={nextPath} />
  }

  return children
}
