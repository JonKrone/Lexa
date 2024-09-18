import { useEffect, useState } from 'react'
import { supabase } from '../../db/supabase'

export const Confirm = () => {
  const authParams = useAuthParams()
  console.log('location:', window.location.href)

  console.log('authParams:', authParams)

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
    const doThing = async () => {
      const session = await supabase.auth.getSession()
      const user = await supabase.auth.getUser()

      console.log('session:', session)
      console.log('user:', user)
    }

    doThing()
  }, [])

  useEffect(() => {
    ;(window as any).supabase = supabase
    if (!authParams.access_token) return

    supabase.auth.verifyOtp({
      token_hash: authParams.token_hash,
      type: 'magiclink',
    })
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

  // magic link implicit flow (we're not using this because we don't have the user's email on this page)
  access_token: string
  expires_at: string
  expires_in: string
  refresh_token: string
  token_type: string
  type: string

  // error cases
  error: string | null
  error_code: string | null
  error_description: string | null
}

const useAuthParams = () => {
  const [authParams] = useState<AuthParams>(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1)), // Remove the leading '#'
    ) as AuthParams
    return params

    // Params are sent in the hash rather than search params for security reasons. Hashes are not
    // sent to the server while search params are.
    // const hash = new URL(window.location.href).hash.substring(1) // Remove the leading '#'
    // const params = new URLSearchParams(hash)
    // console.log('url:', hash)
    // const getKeys = (keys: string[]) =>
    //   Object.fromEntries(
    //     keys.map((key) => [key, params.get(key)]),
    //   ) as AuthParams

    // return getKeys([
    //   // success params
    //   'access_token',
    //   'expires_at',
    //   'expires_in',
    //   'refresh_token',
    //   'token_type',
    //   'type',
    //   // error params
    //   'error',
    //   'error_code',
    //   'error_description',
    // ])
  })

  return authParams
}
// chrome-extension://bmfjgljapphpbkkaokbkmegbhojeaapo/auth/confirm#
// access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Im5JUWp6S3J1U2JjT1YzWDYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2R5aXhkdGl6Ymd6Zml5YmN3b3RvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxMDJhZGVlZC0xMDBlLTQyYjgtOWY5ZC1kZmE0YzdlZjE4OGQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzI2NTUxOTQ2LCJpYXQiOjE3MjY1NDgzNDYsImVtYWlsIjoiam9uYXRoYW5rcm9uZUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiam9uYXRoYW5rcm9uZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMTAyYWRlZWQtMTAwZS00MmI4LTlmOWQtZGZhNGM3ZWYxODhkIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzI2NTQ4MzQ2fV0sInNlc3Npb25faWQiOiI0YTFjYjQ3Mi1mODdhLTQyYzktODhkNC00NWRmMGU4YmI3MDYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.kaj3f6n34UAuoHzgHBd-FZJKFW7VvXeXAZma8qPdMLc
// &expires_at=1726551946
// &expires_in=3600
// &refresh_token=R1HgBVbsxabh9rU4_-JDtw
// &token_type=bearer
// &type=magiclink
