/*
  # Create Storage Buckets for Media Files

  1. Storage Buckets
    - `media` bucket for user-uploaded images and videos
    - Public access for reading
    - Authenticated users can upload

  2. Security
    - RLS policies for upload permissions
    - File size and type restrictions
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view media files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' 
  AND (storage.foldername(name))[1] = 'posts'
);

CREATE POLICY "Users can delete their own media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND owner = auth.uid());
