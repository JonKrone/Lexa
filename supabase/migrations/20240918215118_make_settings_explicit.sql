-- Replace settings_json with explicit columns

-- Drop the existing settings table
DROP TABLE IF EXISTS public.settings;

-- Recreate the settings table with explicit columns
CREATE TABLE IF NOT EXISTS public.settings (
  id char(8) PRIMARY KEY DEFAULT nanoid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language text NOT NULL CHECK (
    target_language IN (
      'en', -- English
      'es', -- Spanish
      'fr', -- French
      'de', -- German
      'zh', -- Chinese (Simplified)
      'ja', -- Japanese
      'pt', -- Portuguese
      'it'  -- Italian
    )
  ),
  learning_level text NOT NULL CHECK (
    learning_level IN (
      'beginner',
      'intermediate',
      'advanced'
    )
  ),
  learning_goals text,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
