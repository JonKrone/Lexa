import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { supabase } from '../config/supabase'
import { sendExtensionMessage } from '../lib/extension'
import { logger } from '../lib/logger'

const authQueries = {
  user: () =>
    queryOptions({
      queryKey: ['auth', 'user'],
      queryFn: async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        return data
      },
    }),
  session: () =>
    queryOptions({
      queryKey: ['auth', 'session'],
      queryFn: async () => {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data
      },
    }),
}

/** Should only be used where we've guaranteed the user is authenticated, i.e. by a guarded route */
export const useUser = () => {
  const { data } = useSuspenseQuery(authQueries.user())
  if (!data.user) throw new Error('User not authenticated')
  return data.user
}

export const useSession = () =>
  useSuspenseQuery(authQueries.session()).data.session ?? undefined

export const useIsAuthenticated = () => useSession() !== undefined

export const useSignInWithEmailOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
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

export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
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
        user: data.user,
        error: null,
      })
      queryClient.setQueryData(['auth', 'session'], {
        session: data.session,
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
        logger.error('Error sending SIGN_OUT message', error)
      }

      queryClient.clear()
      await queryClient.invalidateQueries()
      logger.log('signing out')
    },
    meta: {
      invalidates: '*',
    },
  })
}
