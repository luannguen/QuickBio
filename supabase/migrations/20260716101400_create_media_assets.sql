-- Migration: Create Media Assets table
-- Tạo bảng quản lý Media (Image, Video, Document) tập trung cho dự án.

CREATE TABLE IF NOT EXISTS public.media_assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bucket_id text NOT NULL DEFAULT 'media',
    file_path text NOT NULL, -- e.g. "media/user_id/filename.webp"
    public_url text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    size_bytes bigint NOT NULL,
    alt_text text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ xem được ảnh của chính mình
CREATE POLICY "Users can view their own media assets"
    ON public.media_assets FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: User có thể insert ảnh của chính mình
CREATE POLICY "Users can insert their own media assets"
    ON public.media_assets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: User có thể update ảnh của chính mình (vd sửa alt_text)
CREATE POLICY "Users can update their own media assets"
    ON public.media_assets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: User có thể delete ảnh của chính mình
CREATE POLICY "Users can delete their own media assets"
    ON public.media_assets FOR DELETE
    USING (auth.uid() = user_id);

-- Index để tối ưu tìm kiếm theo user_id
CREATE INDEX IF NOT EXISTS idx_media_assets_user_id ON public.media_assets(user_id);
