-- Add default values to the settings table
ALTER TABLE public.settings
  ALTER COLUMN target_language SET DEFAULT 'en',
  ALTER COLUMN learning_level SET DEFAULT 'beginner',
  ALTER COLUMN learning_goals SET DEFAULT '';

-- Ensure existing rows have these defaults
UPDATE public.settings
SET target_language = COALESCE(target_language, 'en'),
    learning_level = COALESCE(learning_level, 'beginner'),
    learning_goals = COALESCE(learning_goals, '');
