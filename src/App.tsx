import { Button, TextField } from '@mui/material'
import React from 'react'
import { Link, Route, Switch, useLocation } from 'wouter'
import { supabase } from './config/supabase'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Settings from './pages/Settings'
import { Confirm } from './pages/auth/confirm'

export const App: React.FC = () => {
  const [location, setLocation] = useLocation()
  console.log('location', location)

  // Redirect to home if the current location is the root
  React.useEffect(() => {
    if (location === '/index.html') {
      setLocation('/home')
    }
  }, [location, setLocation])

  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Lexa</h1>
        <p className="text-sm">Your personal language learning assistant</p>
        <SupabaseAuth />
      </header>

      <nav className="bg-white shadow-md">
        <ul className="flex justify-around p-2">
          <li>
            <Link href="/home">
              <a className="text-blue-600 hover:text-blue-800 font-medium">
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/learn">
              <a className="text-blue-600 hover:text-blue-800 font-medium">
                Learn
              </a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a className="text-blue-600 hover:text-blue-800 font-medium">
                Settings
              </a>
            </Link>
          </li>
        </ul>
      </nav>

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
    </div>
  )
}

const SupabaseAuth: React.FC = () => {
  const signInWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get('email') as string

    const extensionUrl = chrome.runtime.getURL('')
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${extensionUrl}auth/confirm`,
      },
    })

    console.log('data', data)
    console.log('error', error)
  }

  return (
    <form noValidate autoComplete="off" onSubmit={signInWithEmail}>
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        type="email"
        fullWidth
        margin="normal"
        placeholder="Enter your email"
      />
      <Button variant="contained" color="primary" fullWidth type="submit">
        Sign In
      </Button>
    </form>
  )
}
