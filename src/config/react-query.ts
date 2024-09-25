import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import {
  matchQuery,
  MutationCache,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

/**
 * Module augmentation to extend the MutationMeta interface with debounceMs.
 * This allows us to add custom metadata to mutation options.
 */
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /**
       * Time in milliseconds to debounce the mutation function.
       */
      debounceMs?: number
      /**
       * Array of query keys that the mutation should invalidate.
       */
      invalidates?: Array<QueryKey> | '*'
      /**
       * awaits
       */
      awaits?: Array<QueryKey> | '*'
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 1, // 1 hour
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    /**
     * Supports a `meta.invalidates` and `meta.awaits` to control what queries are invalidated after a mutation.
     *
     * `meta.invalidates` are query keys that the mutation should invalidate.
     * `meta.awaits` are query keys that the mutation should invalidate and await.
     *
     * A value of `*` causes all queries to be affected.
     */
    onSuccess: async (_data, _variables, _context, { meta }) => {
      const hasInvalidates = (meta?.invalidates || []).length > 0
      if (hasInvalidates) {
        queryClient.invalidateQueries({
          predicate(query) {
            const invalidates = meta?.invalidates ?? []
            if (invalidates === '*') return true

            return invalidates.some((queryKey) =>
              matchQuery({ queryKey }, query),
            )
          },
        })
      }

      const hasAwaits = (meta?.awaits || []).length > 0
      if (hasAwaits) {
        await queryClient.invalidateQueries({
          predicate(query) {
            const awaits = meta?.awaits ?? []
            if (awaits === '*') return true

            return awaits.some((queryKey) => matchQuery({ queryKey }, query))
          },
        })
      }
    },
  }),
})

const [_unsubscribe, _initializationPromise] = persistQueryClient({
  queryClient,
  persister: createAsyncStoragePersister({
    storage: {
      getItem: (key) => {
        console.log('getItem', key)
        return new Promise((resolve) => {
          chrome.storage.local.get(key, (result) => {
            resolve(result[key])
          })
        })
      },
      setItem: (key, value) => {
        console.log('setItem', key, value)
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, () => {
            resolve(undefined)
          })
        })
      },
      removeItem: (key) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove(key, () => {
            resolve()
          })
        })
      },
    },
  }),
})
