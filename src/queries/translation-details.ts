import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTranslationDetails } from '../ai/generateTranslationDetails'
import { getPageTitle } from '../lib/documentUtils'
import { QueryKeys } from './query-keys'

const translationDetailsQueries = {
  translationDetails: (
    original: string,
    translation: string,
    context: string,
  ) => {
    return queryOptions({
      queryKey: QueryKeys.translationDetails(context),
      queryFn: async () => {
        const inputs = {
          word: original,
          translation,
          pageTitle: getPageTitle() ?? '',
          surroundingContext: context,
          url: window.location.href,
          targetLanguage: 'English',
        }

        return generateTranslationDetails(inputs)
      },
    })
  },
}

export const useTranslationDetails = (
  original: string,
  translation: string,
  context: string,
) => {
  return useQuery(
    translationDetailsQueries.translationDetails(
      original,
      translation,
      context,
    ),
  )
}

export const usePrefetchTranslationDetails = (
  original: string,
  translation: string,
  context: string,
) => {
  const queryClient = useQueryClient()

  return () =>
    queryClient.prefetchQuery(
      translationDetailsQueries.translationDetails(
        original,
        translation,
        context,
      ),
    )
}
