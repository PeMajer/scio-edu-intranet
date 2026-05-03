-- Add birth_date and birth_place to profiles for certificate generation.
-- These fields are not provided by Google OAuth and must be entered by the user
-- on first course enrollment, then prefilled for subsequent enrollments.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS birth_place text;
