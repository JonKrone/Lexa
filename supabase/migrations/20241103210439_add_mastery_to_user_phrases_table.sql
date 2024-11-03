-- Add mastery_level column to user_phrases table
ALTER TABLE public.user_phrases
ADD COLUMN mastery_level TEXT NOT NULL DEFAULT 'Learning';

