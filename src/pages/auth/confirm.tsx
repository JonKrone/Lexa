import { useEffect, useMemo } from 'react'

import { Alert, AlertTitle, Box, Button, Paper } from '@mui/material'
import { AuthError } from '@supabase/supabase-js'
import { FC } from 'react'
import { Link, Redirect } from 'wouter'
import { Body2, H6 } from '../../components/Typography'
import { useIsAuthenticated, useVerifyOtp } from '../../queries/auth'

type AuthParams = {
  // PKCE magic link
  token_hash: string

  // magic link implicit flow (we're not using this, but this is the shape)
  access_token: string
  expires_at: string
  expires_in: string
  refresh_token: string
  token_type: string
  type: string

  // error case
  error: string | null
  error_code: string | null
  error_description: string | null
}

export const Confirm: FC = () => {
  const authParams = useMemo<AuthParams>(() => {
    const params = new URL(window.location.href).searchParams
    return Object.fromEntries(params) as AuthParams
  }, [])

  const isAuthenticated = useIsAuthenticated()
  const { mutateAsync: verifyOtp, isPending, error } = useVerifyOtp()

  useEffect(() => {
    if (!authParams.token_hash) return
    if (isPending) return
    if (error) return

    verifyOtp(authParams.token_hash)
  }, [authParams.token_hash, isPending, error])

  if (isAuthenticated) {
    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get('next')
    const nextPath = nextParam ? decodeURIComponent(nextParam) : '/home'
    return <Redirect to={nextPath} />
  }

  if (authParams.error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          <AlertTitle>Authentication Error</AlertTitle>
          <Body2>Error: {authParams.error}</Body2>
          <Body2>Error Code: {authParams.error_code}</Body2>
          <Body2>Description: {authParams.error_description}</Body2>
        </Alert>
      </Box>
    )
  }

  if (error) {
    const err = error as unknown as AuthError

    // TODO: Not a fan of this error display. Should standardize on something.
    // dev-images/poor-auth-error.jpg)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          <AlertTitle>Authentication Error</AlertTitle>
          <Body2>{err.message}</Body2>
          {err.code && <Body2>Error Code: {err.code}</Body2>}
          {err.status && <Body2>Status: {err.status}</Body2>}
        </Alert>
        <Button
          LinkComponent={Link}
          href="/auth/login"
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
        >
          Login again
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <H6 gutterBottom>Confirming Authentication</H6>
        <Body2>Please wait while we verify your magic link...</Body2>
      </Paper>
    </Box>
  )
}
