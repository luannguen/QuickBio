-- SQL nâng cấp cơ sở dữ liệu Supabase của QuickBio
-- Lệnh này thêm cột theo dõi CTV và cột thời gian đặt lịch hẹn trực tiếp vào bảng orders.
-- Vui lòng chạy lệnh này trong mục SQL Editor trên trang quản trị Supabase.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS referred_by TEXT DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS booking_time TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT DEFAULT NULL;
