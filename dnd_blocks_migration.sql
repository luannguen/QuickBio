-- Add blocks column to bio_links table
ALTER TABLE public.bio_links ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;
