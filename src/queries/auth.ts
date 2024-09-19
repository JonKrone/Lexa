import { User } from '@supabase/supabase-js'
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
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

function fetchUser() {
  return supabase.auth.getUser()
}

function fetchSession() {
  return supabase.auth.getSession()
}

export function useUser() {
  // technically, user can be null here but we're handling that high up in the app and
  // guarantee it in authenticated pages.
  return useSuspenseQuery(authQueries.user()).data.data.user as User
}

export function useSession() {
  return useQuery(authQueries.session())?.data?.data.session ?? undefined
}
