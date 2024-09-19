import { User } from '@supabase/supabase-js'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { Tables } from '../config/database.types'
import { supabase } from '../config/supabase'
import { OneFieldUpdate } from '../lib/types'
import { useUser } from './auth'

export const settingsQueries = {
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

  return useQuery(settingsQueries.detail(user))
}

export type UpdatableSettings = OneFieldUpdate<
  Omit<Tables<'settings'>, 'user_id' | 'updated_at' | 'id'>
>

export const useUpdateSetting = () => {
  const user = useUser()
  const { data: settings } = useSettings()

  return useMutation({
    // mutationFn: async (changes: UpdatableSettings) =>
    //   (
    //     await supabase
    //       .from('settings')
    //       .upsert({ ...settings, ...changes } as Tables<'settings'>)
    //       .eq('user_id', user.id)
    //       .select()
    //   ).data,
    mutationFn: async (changes: UpdatableSettings) => {
      console.log('updating settings: ', changes)

      const { data, error } = await supabase
        .from('settings')
        .upsert({ ...settings, ...changes } as Tables<'settings'>)
        .select()

      if (error) throw error
      return data
    },
  })
}
