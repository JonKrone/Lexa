import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import {
  addIgnoredSite,
  getIgnoredSites,
  IgnoredSite,
  removeIgnoredSite,
} from '../utils/storage'

interface Props {}

export const IgnoredSitesManager: FC<Props> = () => {
  const queryClient = useQueryClient()

  const { data: ignoredSites = [] } = useQuery<IgnoredSite[]>({
    queryKey: ['ignoredSites'],
    queryFn: getIgnoredSites,
  })

  const addSiteMutation = useMutation({
    mutationFn: addIgnoredSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ignoredSites'] })
    },
  })

  const removeSiteMutation = useMutation({
    mutationFn: removeIgnoredSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ignoredSites'] })
    },
  })

  const handleAddSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const newSite = form.elements.namedItem('newSite') as HTMLInputElement
    if (newSite && newSite.value) {
      addSiteMutation.mutate(newSite.value)
      form.reset()
    }
  }

  const handleRemoveSite = (domain: string) => {
    removeSiteMutation.mutate(domain)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Ignored Sites</h2>
      <form onSubmit={handleAddSite} className="mb-4">
        {/**
         * TODO: Make this very user friendly. Show examples, provide useful error messages.
         */}
        <input
          type="text"
          name="newSite"
          placeholder="i.e. lexa.com"
          className="border p-2 mr-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {ignoredSites.map((site) => (
          <li
            key={site.domain}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{site.domain}</span>
            <button
              onClick={() => handleRemoveSite(site.domain)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
