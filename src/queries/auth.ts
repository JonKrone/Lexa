import { User } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { supabase } from '../config/supabase'
import { sendExtensionMessage } from '../lib/extension'

const authQueries = {
  user: () =>
    queryOptions({
      queryKey: ['auth', 'user'],
      queryFn: async () => {
        const { data, error } = await fetchUser()
        if (error) throw error
        return data
      },
    }),
  session: () =>
    queryOptions({
      queryKey: ['auth', 'session'],
      queryFn: async () => {
        const { data, error } = await fetchSession()
        if (error) throw error
        return data
      },
    }),
}

const fetchUser = () => supabase.auth.getUser()

const fetchSession = () => supabase.auth.getSession()

export const useUser = () => {
  // technically, user can be null here but we're handling that high up in the app and
  // guarantee it in authenticated pages.
  return useSuspenseQuery(authQueries.user()).data.user as User
}

export const useSession = () =>
  useSuspenseQuery(authQueries.session()).data.session ?? undefined

export const useIsAuthenticated = () => useSession() !== undefined

export const useSignInWithOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const extensionUrl = chrome.runtime.getURL('')
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${extensionUrl}auth/confirm`,
        },
      })

      if (error) throw error
      return data
    },
    meta: {
      invalidates: '*',
    },
  })
}

export const useVerifyOtp = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (tokenHash: string) => {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'magiclink',
      })

      if (error) throw error

      if (!data.user) {
        throw new Error(
          'No user found on successful OTP verification. Needs investigation.',
        )
      }

      sendExtensionMessage({
        type: 'OTP_VERIFIED',
        payload: data,
      })

      // preload user and session data
      queryClient.setQueryData(['auth', 'user'], {
        data: data.user,
        error: null,
      })
      queryClient.setQueryData(['auth', 'session'], {
        data: data.session,
        error: null,
      })

      return data
    },
    meta: {
      invalidates: '*',
    },
  })
}

export const useSignOut = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      try {
        sendExtensionMessage({
          type: 'SIGN_OUT',
          payload: undefined,
        })
      } catch (error) {
        console.error('Error sending SIGN_OUT message', error)
      }

      queryClient.clear()
      await queryClient.invalidateQueries()
      console.log('signing out')
    },
    meta: {
      invalidates: '*',
    },
  })
}
