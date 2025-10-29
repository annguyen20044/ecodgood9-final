-- Create the ecogood-files storage bucket if it doesn't exist
-- Run this in Supabase SQL Editor

-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecogood-files', 'ecogood-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'ecogood-files');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ecogood-files');

CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'ecogood-files');
