import { User } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Tables } from '../config/database.types'
import { supabase } from '../config/supabase'
import { logger } from '../lib/logger'
import { OneFieldUpdate } from '../lib/types'
import { useUser } from './auth'

export const settingsQueries = {
  base: ['settings'],
  detail: (user?: User) =>
    queryOptions({
      queryKey: ['settings'],
      queryFn: async () => {
        if (!user) return null

        const { data, error } = await supabase
          .from('settings')
          .select()
          .maybeSingle()

        if (error) throw error
        return data
      },
      enabled: !!user,
    }),
}

export const useSettings = () => {
  // Try to get user, but handle auth errors gracefully
  let user: User | null = null
  try {
    user = useUser()
  } catch (error) {
    logger.log('useSettings: User not authenticated:', error)
    // Return a query that will not execute due to enabled: false
    return useQuery({
      queryKey: ['settings'],
      queryFn: () => null,
      enabled: false,
    })
  }

  return useQuery(settingsQueries.detail(user))
}

// Keep the suspense version for components that need it
export const useSettingsSuspense = () => {
  const user = useUser()

  return useSuspenseQuery(settingsQueries.detail(user))
}

export type UpdatableSettings = OneFieldUpdate<
  Omit<Tables<'settings'>, 'user_id' | 'updated_at' | 'id'>
>

export const useUpdateSetting = () => {
  const { data: settings } = useSettingsSuspense()

  const updateSetting = async (changes: UpdatableSettings) => {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ ...settings, ...changes } as Tables<'settings'>)
      .select()

    if (error) throw error
    return data
  }

  return useMutation({
    mutationFn: updateSetting,
    meta: {
      invalidates: [settingsQueries.base],
    },
  })
}
