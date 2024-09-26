import { FC } from 'react'
import { Redirect, useLocation } from 'wouter'
import { LoginForm } from '../../components/LoginForm'
import { useIsAuthenticated } from '../../queries/auth'

export const Login: FC = () => {
  const [, setLocation] = useLocation()

  // console.log('login', useIsAuthenticated(), useUser(), useSession())
  if (useIsAuthenticated()) {
    return <Redirect to="/home" />
  }

  return (
    <LoginForm
      onLogin={() => {
        const params = new URLSearchParams(window.location.search)
        const nextParam = params.get('next')
        const nextPath = nextParam ? decodeURIComponent(nextParam) : '/home'
        setLocation(nextPath)
      }}
    />
  )
}
