import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from '@clerk/chrome-extension'
import React from 'react'
import { Link, Route, Switch, useLocation } from 'wouter'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Settings from './pages/Settings'

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
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <div className="w-[350px] h-[500px] flex flex-col bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Lexa</h1>
          <p className="text-sm">Your personal language learning assistant</p>
          <SignedOut>
            {/* <SignUpButton />
            <span> or </span> */}
            {/* <SignInButton /> */}
            <SignUp />
            <SignIn />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
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
          </Switch>
        </main>

        <footer className="bg-gray-100 p-2 text-center text-sm text-gray-600">
          Lexa © 2024 - Expand your vocabulary while browsing
        </footer>
      </div>
    </ClerkProvider>
  )
}
