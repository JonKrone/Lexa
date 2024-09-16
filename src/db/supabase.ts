import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dyixdtizbgzfiybcwoto.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
