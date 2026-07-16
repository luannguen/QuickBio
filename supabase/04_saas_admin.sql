-- Tích hợp SAAS Admin: Thêm Role và các hàm thống kê (Security Definer)

-- 1. Thêm cột role vào bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;

-- Set quyền admin cho các email mặc định của chủ hệ thống
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn');

-- 2. Hàm lấy thống kê tổng quan (Chỉ dành cho Admin)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_users INT;
    v_total_orders INT;
    v_total_revenue NUMERIC;
    v_total_commissions_paid NUMERIC;
BEGIN
    -- Zero-Trust: Kiểm tra cứng quyền admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access Denied: Requires Admin Role';
    END IF;

    SELECT COUNT(*) INTO v_total_users FROM public.profiles;
    SELECT COUNT(*) INTO v_total_orders FROM public.orders;
    SELECT COALESCE(SUM(amount), 0) INTO v_total_revenue FROM public.orders WHERE status = 'paid';
    SELECT COALESCE(SUM(amount), 0) INTO v_total_commissions_paid FROM public.commissions WHERE status = 'paid';

    RETURN jsonb_build_object(
        'total_users', v_total_users,
        'total_orders', v_total_orders,
        'total_revenue', v_total_revenue,
        'total_commissions_paid', v_total_commissions_paid
    );
END;
$$;

-- 3. Hàm lấy danh sách Users kèm doanh thu (Chỉ Admin)
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT,
    role TEXT,
    created_at TIMESTAMPTZ,
    total_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin') THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    RETURN QUERY
    SELECT 
        p.id, p.email, p.full_name, p.avatar_url, p.plan, p.role, p.created_at,
        COALESCE(SUM(o.amount) FILTER (WHERE o.status = 'paid'), 0) as total_revenue
    FROM public.profiles p
    LEFT JOIN public.products pr ON p.id = pr.user_id
    LEFT JOIN public.orders o ON pr.id = o.product_id
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END;
$$;

-- 4. Hàm lấy danh sách Đơn hàng toàn hệ thống (Chỉ Admin)
CREATE OR REPLACE FUNCTION public.get_admin_orders(p_limit INT DEFAULT 100)
RETURNS TABLE (
    id UUID,
    product_name TEXT,
    creator_name TEXT,
    customer_email TEXT,
    amount NUMERIC,
    status TEXT,
    payment_code TEXT,
    created_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin') THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    RETURN QUERY
    SELECT 
        o.id, pr.name as product_name, p.full_name as creator_name,
        o.customer_email, o.amount, o.status, o.payment_code, o.created_at, o.paid_at
    FROM public.orders o
    JOIN public.products pr ON o.product_id = pr.id
    JOIN public.profiles p ON pr.user_id = p.id
    ORDER BY o.created_at DESC
    LIMIT p_limit;
END;
$$;
