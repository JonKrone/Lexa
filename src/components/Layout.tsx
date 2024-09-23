import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material'
import { HomeIcon, School, SettingsIcon } from 'lucide-react'
import { FC, Suspense } from 'react'
import { Redirect, useLocation, useRoute } from 'wouter'
import { isFullPageView } from '../lib/utils'
import { useIsAuthenticated } from '../queries/auth'
import SnowflakeBackground from './SnowflakeBackground'
import { Body2, H2 } from './Typography'

export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useLocation()

  const isFullTabView = isFullPageView()
  const hasBottomNav = !useRoute(/^\/auth/)[0]
  const value = location.split('/')[1]

  return (
    <Box sx={{ display: 'flex', placeContent: 'center' }}>
      <SnowflakeBackground opacity={0.1} speed={0.1} density={0.5} />
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={!isFullTabView ? { width: 350, height: 500, p: 2 } : {}}>
          <AuthGuard>
            <header>
              <H2>Lexa</H2>
              <Body2>Your personal language learning assistant</Body2>
            </header>
            <main style={{ paddingBottom: '72px' }}>{children}</main>
            <footer>
              {hasBottomNav && (
                <BottomNavigation
                  value={value}
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
                  <BottomNavigationAction
                    label="Home"
                    icon={<HomeIcon />}
                    value="home"
                  />
                  <BottomNavigationAction
                    label="Learn"
                    icon={<School />}
                    value="learn"
                  />
                  <BottomNavigationAction
                    label="Settings"
                    icon={<SettingsIcon />}
                    value="settings"
                  />
                </BottomNavigation>
              )}
            </footer>
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
