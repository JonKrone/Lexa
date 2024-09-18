import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = 'https://dyixdtizbgzfiybcwoto.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseKey) {
  throw new Error('Supabase key is not set')
}

const storageAdapter = {
  getItem: async (name: string) => (await chrome.storage.sync.get(name))[name],
  setItem: (name: string, value: string) =>
    chrome.storage.sync.set({ [name]: value }),
  removeItem: (name: string) => chrome.storage.sync.remove(name),
  isServer: false,
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    // TODO: Change to 'lexa-auth' when we log in again. We're currently rate-limited.
    storageKey: 'lexa-auth-token',
    storage: storageAdapter,
  },
})

if (__DEBUG__) {
  ;(window as any).supabase = supabase
}
