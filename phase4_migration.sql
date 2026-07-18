-- Migration: Themes, Affiliate Config & Landing Logo

-- 1. Bổ sung logo cho Landing Pages
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Bổ sung cấu hình % hoa hồng cho Products (0-100)
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_commission_rate NUMERIC DEFAULT 0;

-- 3. Bổ sung cấu hình giao diện Theme cho Bio
ALTER TABLE bio_links ADD COLUMN IF NOT EXISTS theme_id TEXT;
