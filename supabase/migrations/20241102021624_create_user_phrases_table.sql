-- Create the 'user_phrases' table
CREATE TABLE IF NOT EXISTS public.user_phrases (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase_text TEXT NOT NULL,
  times_seen INTEGER NOT NULL DEFAULT 0,
  starred BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_incorrect INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, phrase_text)
);

-- Enable Row Level Security
ALTER TABLE public.user_phrases ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own phrases
CREATE POLICY "Allow insert for owner"
  ON public.user_phrases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own phrases
CREATE POLICY "Allow select for owner"
  ON public.user_phrases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own phrases
CREATE POLICY "Allow update for owner"
  ON public.user_phrases
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own phrases
CREATE POLICY "Allow delete for owner"
  ON public.user_phrases
  FOR DELETE
  USING (auth.uid() = user_id);
