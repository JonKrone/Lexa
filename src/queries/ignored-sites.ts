import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  IgnoredSite,
  addIgnoredSite,
  getIgnoredSites,
  removeIgnoredSite,
} from '../lib/storage'

export const useIgnoredSites = () =>
  useQuery<IgnoredSite[]>({
    queryKey: ['ignoredSites'],
    queryFn: getIgnoredSites,
  })

export const useAddIgnoredSite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addIgnoredSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ignoredSites'] })
    },
  })
}

export const useRemoveIgnoredSite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeIgnoredSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ignoredSites'] })
    },
  })
}
