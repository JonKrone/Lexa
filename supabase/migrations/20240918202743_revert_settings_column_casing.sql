-- Revert column names back to snake_case
ALTER TABLE public.settings
  RENAME COLUMN userid TO user_id;

ALTER TABLE public.settings
  RENAME COLUMN settingsjson TO settings_json;

ALTER TABLE public.settings
  RENAME COLUMN updatedat TO updated_at;

-- Update RLS policies to use original column names
DROP POLICY IF EXISTS "Allow insert for owner" ON public.settings;
CREATE POLICY "Allow insert for owner"
  ON public.settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow select for owner" ON public.settings;
CREATE POLICY "Allow select for owner"
  ON public.settings
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow update for owner" ON public.settings;
CREATE POLICY "Allow update for owner"
  ON public.settings
  FOR UPDATE
  USING (auth.uid() = user_id);
