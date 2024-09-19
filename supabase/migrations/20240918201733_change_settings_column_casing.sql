-- Rename columns to camelCase
ALTER TABLE public.settings
  RENAME COLUMN user_id TO userId;

ALTER TABLE public.settings
  RENAME COLUMN settings_json TO settingsJson;

ALTER TABLE public.settings
  RENAME COLUMN updated_at TO updatedAt;

-- Update RLS policies to use new column names
DROP POLICY IF EXISTS "Allow insert for owner" ON public.settings;
CREATE POLICY "Allow insert for owner"
  ON public.settings
  FOR INSERT
  WITH CHECK (auth.uid() = userId);

DROP POLICY IF EXISTS "Allow select for owner" ON public.settings;
CREATE POLICY "Allow select for owner"
  ON public.settings
  FOR SELECT
  USING (auth.uid() = userId);

DROP POLICY IF EXISTS "Allow update for owner" ON public.settings;
CREATE POLICY "Allow update for owner"
  ON public.settings
  FOR UPDATE
  USING (auth.uid() = userId);
