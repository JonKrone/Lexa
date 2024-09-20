import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { FC } from 'react'
import { Link, Route, Switch } from 'wouter'
import { Layout } from './components/Layout'
import { Confirm } from './pages/auth/confirm'
import { Login } from './pages/auth/login'
import Home from './pages/Home'
import Learn from './pages/Learn'
import { NotFound } from './pages/NotFound'
import Settings from './pages/Settings'

export const App: FC = () => {
  return (
    <Layout>
      <Box component="nav" sx={{ bgcolor: 'background.paper' }}>
        <List sx={{ display: 'flex', justifyContent: 'space-around', p: 2 }}>
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
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/confirm" component={Confirm} />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>

      <footer className="bg-gray-100 p-2 text-center text-sm text-gray-600">
        Lexa © 2024 - Expand your vocabulary while browsing
      </footer>
    </Layout>
  )
}
