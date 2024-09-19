import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material'
import React, { FC, Suspense, useEffect } from 'react'
import { Link, Route, Switch, useLocation } from 'wouter'
import { Body2, H2 } from './components/Typography'
import { isFullPageView } from './lib/utils'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Settings from './pages/Settings'
import { Confirm } from './pages/auth/confirm'
import { useSignInWithOtp } from './queries/auth'

export const App: FC = () => {
  const isFullTabView = isFullPageView()
  const [location, setLocation] = useLocation()

  // Redirect to home if the current location is the root
  useEffect(() => {
    if (location === '/index.html') {
      setLocation('/home')
    }
  }, [location, setLocation])

  return (
    <Box sx={{ display: 'flex', placeContent: 'center' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={!isFullTabView ? { width: 350, height: 500 } : {}}>
          <header>
            <H2>Lexa</H2>
            <Body2>Your personal language learning assistant</Body2>
            <SupabaseAuth />
          </header>

          <Box component="nav" sx={{ bgcolor: 'background.paper' }}>
            <List
              sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/home"
                  sx={{
                    color: 'primary.main',
                    '&:hover': { color: 'primary.dark' },
                    fontWeight: 'medium',
                  }}
                >
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/learn"
                  sx={{
                    color: 'primary.main',
                    '&:hover': { color: 'primary.dark' },
                    fontWeight: 'medium',
                  }}
                >
                  <ListItemText primary="Learn" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/settings"
                  sx={{
                    color: 'primary.main',
                    '&:hover': { color: 'primary.dark' },
                    fontWeight: 'medium',
                  }}
                >
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <main className="flex-grow overflow-y-auto p-4">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/learn" component={Learn} />
              <Route path="/settings" component={Settings} />
              <Route path="/auth/confirm" component={Confirm} />
            </Switch>
          </main>

          <footer className="bg-gray-100 p-2 text-center text-sm text-gray-600">
            Lexa © 2024 - Expand your vocabulary while browsing
          </footer>
        </Box>
      </Suspense>
    </Box>
  )
}

const SupabaseAuth: React.FC = () => {
  const { mutate: signInWithOtp, isPending } = useSignInWithOtp()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get('email') as string

    signInWithOtp(email)
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        type="email"
        fullWidth
        margin="normal"
        placeholder="Enter your email"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Sign In'}
      </Button>
    </form>
  )
}
