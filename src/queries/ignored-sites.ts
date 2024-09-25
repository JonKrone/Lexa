import { useMutation, useQuery } from '@tanstack/react-query'
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
  return useMutation({
    mutationFn: addIgnoredSite,
    meta: {
      invalidates: [['ignoredSites']],
    },
  })
}

export const useRemoveIgnoredSite = () => {
  return useMutation({
    mutationFn: removeIgnoredSite,
    meta: {
      invalidates: [['ignoredSites']],
    },
  })
}
