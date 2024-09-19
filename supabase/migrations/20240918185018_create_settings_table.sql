-- supabase/migrations/xxxx_create_settings_table.sql

-- Create the settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id char(8) PRIMARY KEY DEFAULT nanoid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own settings
CREATE POLICY "Allow insert for owner"
  ON public.settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own settings
CREATE POLICY "Allow select for owner"
  ON public.settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own settings
CREATE POLICY "Allow update for owner"
  ON public.settings
  FOR UPDATE
  USING (auth.uid() = user_id);
