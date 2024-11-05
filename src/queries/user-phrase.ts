import { User } from '@supabase/supabase-js'
import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { supabase } from '../config/supabase'
import { useUser } from './auth'

export type MasteryLevel =
  | 'New' // Just added to learning list
  | 'Familiar' // Seen multiple times, still in active learning
  | 'Confident' // High success rate but not yet fully mastered
  | 'Mastered' // Consistently correct with reliable recall

export interface UserPhrase {
  user_id: string
  phrase_text: string
  starred: boolean
  times_seen: number
  times_correct: number
  times_incorrect: number
  last_seen?: string
  mastery_level: MasteryLevel
  created_at: string
}

export const MasteryLevelBreakpoints: Record<MasteryLevel, number> = {
  New: 2, // 0-2 correct = New
  Familiar: 7, // 3-7 correct = Familiar
  Confident: 14, // 8-14 correct = Confident
  Mastered: 15, // 15+ correct = Mastered
}

export const userPhraseQueries = {
  base: ['user_phrases'],
  detail: (user?: User) =>
    queryOptions({
      queryKey: ['user_phrases', user?.id],
      queryFn: async () => {
        if (!user) return null

        const { data, error } = await supabase
          .from('user_phrases')
          .select('*')
          .eq('user_id', user.id)

        if (error) throw error
        return data as UserPhrase[]
      },
      enabled: !!user,
    }),
}

export const useUserPhrases = () => {
  const user = useUser()

  return useSuspenseQuery(userPhraseQueries.detail(user))
}

export const useUserPhrase = (phraseText: string) => {
  const { data: phrases = [] } = useUserPhrases()
  return phrases?.find((p) => p.phrase_text === phraseText)
}

export type UpdatableUserPhrase = Partial<
  Omit<UserPhrase, 'user_id' | 'phrase_text' | 'created_at'>
>

export const useCreateOrUpdateUserPhrase = () => {
  const user = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      phrase: { phrase_text: string } & Partial<UpdatableUserPhrase>,
    ) => {
      if (!user) throw new Error('User not authenticated')

      const { phrase_text, ...changes } = phrase

      const { data, error } = await supabase
        .from('user_phrases')
        .upsert({
          user_id: user.id,
          phrase_text,
          ...changes,
        })
        .select()
        .maybeSingle()

      if (error) throw error
      return data as UserPhrase | null
    },
    onMutate: async (phraseUpdates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(userPhraseQueries.detail(user))

      // Snapshot the previous value
      const previousPhrases =
        queryClient.getQueryData<UserPhrase[]>(
          userPhraseQueries.detail(user).queryKey,
        ) || []

      // Create optimistic phrase
      const optimisticPhrase: UserPhrase = {
        ...(previousPhrases.find(
          (p) => p.phrase_text === phraseUpdates.phrase_text,
        ) || {
          user_id: user!.id,
          phrase_text: phraseUpdates.phrase_text,
          starred: false,
          times_seen: 1,
          times_correct: 0,
          times_incorrect: 0,
          mastery_level: 'New',
          created_at: new Date().toISOString(),
        }),
        ...phraseUpdates,
      }

      // Optimistically update
      queryClient.setQueryData(
        userPhraseQueries.detail(user).queryKey,
        (old = []) => {
          const filtered =
            old?.filter((p) => p.phrase_text !== phraseUpdates.phrase_text) ??
            []
          return [...filtered, optimisticPhrase]
        },
      )

      // Store the previous phrases in the mutation context so we can rollback on error
      return { previousPhrases }
    },
    onError: (_err, _newPhrase, context) => {
      // Rollback to previous value on error
      if (context?.previousPhrases) {
        queryClient.setQueryData(
          userPhraseQueries.detail(user).queryKey,
          context.previousPhrases,
        )
      }
    },
    onSuccess(data) {
      updateCachedUserPhrase(queryClient, user, data)
    },
  })
}

export const useRecordPhraseSeen = () => {
  const user = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (phraseText: string) => {
      if (!user) throw new Error('User not authenticated')

      const { error: updateError } = await supabase.rpc('record_phrase_seen', {
        p_user_id: user.id,
        p_phrase_text: phraseText,
      })
      if (updateError) throw updateError

      // RPCs are a bit fragile to make return the row they updated, so we'll just fetch the row.
      const { data: updatedPhrase, error: selectError } = await supabase
        .from('user_phrases')
        .select()
        .eq('user_id', user.id)
        .eq('phrase_text', phraseText)
        .maybeSingle()
      if (selectError) throw selectError

      return updatedPhrase as UserPhrase | null
    },
    onSuccess(data) {
      updateCachedUserPhrase(queryClient, user, data)
    },
  })
}

export const masteryLevelForTimesCorrect = (
  timesCorrect: number,
): MasteryLevel => {
  if (timesCorrect <= MasteryLevelBreakpoints.New) return 'New'
  if (timesCorrect <= MasteryLevelBreakpoints.Familiar) return 'Familiar'
  if (timesCorrect <= MasteryLevelBreakpoints.Confident) return 'Confident'
  return 'Mastered'
}

/** Updates the cached list of userPhrases with a new or updated item */
function updateCachedUserPhrase(
  queryClient: QueryClient,
  user: User,
  newData: UserPhrase | null,
) {
  if (!newData) return

  const existingPhrases =
    queryClient.getQueryData(userPhraseQueries.detail(user).queryKey) || []
  const existingPhrase = existingPhrases.find(
    (p) => p.phrase_text === newData.phrase_text,
  )
  if (existingPhrase) {
    queryClient.setQueryData(
      userPhraseQueries.detail(user).queryKey,
      existingPhrases.map((p) =>
        p.phrase_text === newData.phrase_text ? newData : p,
      ),
    )
    return
  }

  queryClient.setQueryData(userPhraseQueries.detail(user).queryKey, [
    ...existingPhrases,
    newData,
  ])
}
