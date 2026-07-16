-- Nâng cấp Module E-commerce: Bổ sung Sản phẩm Vật lý & Giao hàng

-- 1. Thêm cột mới vào bảng products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'digital' CHECK (product_type IN ('digital', 'physical')) NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_count INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_unlimited BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_grams INT DEFAULT 0;

-- 2. Đổi file_url thành không bắt buộc (vì sản phẩm vật lý không có file tải về)
ALTER TABLE public.products ALTER COLUMN file_url DROP NOT NULL;

-- 3. Cập nhật bảng orders thêm thông tin giao hàng cho sản phẩm vật lý
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
