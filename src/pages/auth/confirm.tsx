import { useEffect, useState } from 'react'
import { supabase } from '../../db/supabase'

export const Confirm = () => {
  const authParams = useAuthParams()
  console.log('authParams', authParams)

  if ('error' in authParams && authParams.error) {
    return (
      <div>
        <div>Error: {authParams.error}</div>
        <div>Error Code: {authParams.error_code}</div>
        <div>Error Description: {authParams.error_description}</div>
      </div>
    )
  }

  useEffect(() => {
    if (!authParams.token_hash) return

    const verifyOtp = async () => {
      const result = await supabase.auth.verifyOtp({
        token_hash: authParams.token_hash,
        type: 'magiclink',
      })
      console.log('verifyOtp result:', result)
    }

    verifyOtp()
  }, [authParams.access_token])

  return (
    <div>
      Confirming
      <div>access_token: {authParams?.access_token}</div>
      <div>expires_at: {authParams?.expires_at}</div>
      <div>expires_in: {authParams?.expires_in}</div>
      <div>refresh_token: {authParams?.refresh_token}</div>
      <div>token_type: {authParams?.token_type}</div>
      <div>type: {authParams?.type}</div>
    </div>
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
