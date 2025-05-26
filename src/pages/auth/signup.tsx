import { FC } from 'react'
import { Link, Redirect } from 'wouter'
import { LoginForm } from '../../components/LoginForm'
import { Body2 } from '../../components/Typography'
import { useIsAuthenticated } from '../../queries/auth'

export const Signup: FC = () => {
  if (useIsAuthenticated()) return <Redirect to="/home" />

  return (
    <>
      <LoginForm />
      <Body2 mt={2} sx={{ textAlign: 'center' }}>
        Already have an account? <Link href="/auth/login">Sign In</Link>
      </Body2>
    </>
  )
}
