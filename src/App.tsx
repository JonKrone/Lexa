import { FC } from 'react'
import { Route, Switch } from 'wouter'
import './App.css'
import { Layout } from './components/Layout'
import { Login } from './pages/auth/login'
import { Signup } from './pages/auth/signup'
import Home from './pages/Home'
import Learn from './pages/Learn'
import { NotFound } from './pages/NotFound'
import Settings from './pages/Settings'

export const App: FC = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/settings" component={Settings} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  )
}
