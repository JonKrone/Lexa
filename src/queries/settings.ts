import { User } from '@supabase/supabase-js'
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Tables } from '../config/database.types'
import { supabase } from '../config/supabase'
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
  const user = useUser()

  return useSuspenseQuery(settingsQueries.detail(user))
}

export type UpdatableSettings = OneFieldUpdate<
  Omit<Tables<'settings'>, 'user_id' | 'updated_at' | 'id'>
>

export const useUpdateSetting = () => {
  const { data: settings } = useSettings()

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
