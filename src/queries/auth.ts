import { User } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { supabase } from '../config/supabase'

const authQueries = {
  user: () =>
    queryOptions({
      queryKey: ['auth', 'user'],
      queryFn: () => fetchUser(),
    }),
  session: () =>
    queryOptions({
      queryKey: ['auth', 'session'],
      queryFn: () => fetchSession(),
    }),
}

const fetchUser = () => supabase.auth.getUser()

const fetchSession = () => supabase.auth.getSession()

export const useUser = () => {
  // technically, user can be null here but we're handling that high up in the app and
  // guarantee it in authenticated pages.
  return useSuspenseQuery(authQueries.user()).data.data.user as User
}

export const useSession = () =>
  useSuspenseQuery(authQueries.session()).data?.data.session ?? undefined

export const useIsAuthenticated = () => useSession() !== undefined

export const useSignInWithOtp = () =>
  useMutation({
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
  })
