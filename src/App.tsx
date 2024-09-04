import React from 'react'
import { Link, Route, Switch } from 'wouter'
import Home from './components/Home'
import Learn from './components/Learn'
import Settings from './components/Settings'

const App: React.FC = () => {
  return (
    <div className="p-4">
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <a className="text-blue-500 hover:underline">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/learn">
              <a className="text-blue-500 hover:underline">Learn</a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a className="text-blue-500 hover:underline">Settings</a>
            </Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </div>
  )
}

export default App
