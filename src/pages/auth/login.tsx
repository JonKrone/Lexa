import { FC } from 'react'
import { Redirect } from 'wouter'
import { LoginForm } from '../../components/LoginForm'
import { useIsAuthenticated } from '../../queries/auth'

export const Login: FC = () => {
  const isAuthd = useIsAuthenticated()
  console.log('isAuthd', isAuthd)

  if (isAuthd) {
    return <Redirect to="/home" />
  }

  return <LoginForm />
}
