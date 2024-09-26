import { AuthError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabase'
import { sendExtensionMessage } from '../../lib/extension'

import { Alert, AlertTitle, Box, Paper } from '@mui/material'
import { FC } from 'react'
import { Body2, H6 } from '../../components/Typography'

export const Confirm: FC = () => {
  const authParams = useAuthParams()
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    if (!authParams.token_hash) return

    const verifyOtp = async () => {
      const result = await supabase.auth.verifyOtp({
        token_hash: authParams.token_hash,
        type: 'magiclink',
      })

      if (result.error) {
        setError(result.error)
        return
      }

      if (!result.data.user) {
        throw new Error(
          'No user found on successful OTP verification. Needs investigation.',
        )
      }

      sendExtensionMessage({
        type: 'SIGN_IN_WITH_OTP',
        payload: result.data.user,
      })
    }

    verifyOtp()
  }, [authParams.token_hash])

  if ('error' in authParams && authParams.error) {
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
    // TODO: Not a fan of this error display. Should standardize on something.
    // dev-images/poor-auth-error.jpg)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          <AlertTitle>Authentication Error</AlertTitle>
          <Body2>Message: {error.message}</Body2>
          {error.code && <Body2>Error Code: {error.code}</Body2>}
          {error.status && <Body2>Status: {error.status}</Body2>}
        </Alert>
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

const useAuthParams = () => {
  const [authParams] = useState<AuthParams>(() => {
    const params = new URL(window.location.href).searchParams
    return Object.fromEntries(params) as AuthParams
  })

  return authParams
}
