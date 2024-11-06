import { CardContent, CardHeader } from '@mui/material'
import { FC } from 'react'
import { useUser } from '../../queries/auth'
import { LoginForm } from '../LoginForm'
import { H6 } from '../Typography'

interface LexaCardAuthGuardProps {
  children: React.ReactNode
}

export const LexaCardAuthGuard: FC<LexaCardAuthGuardProps> = ({ children }) => {
  const user = useUser()

  if (!user) {
    return (
      <>
        <CardHeader title={<H6>Sign in to continue</H6>} />
        <CardContent>
          <LoginForm />
        </CardContent>
      </>
    )
  }

  return <>{children}</>
}
