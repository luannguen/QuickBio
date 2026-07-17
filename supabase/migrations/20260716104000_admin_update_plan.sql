-- Hàm đổi gói cước (Upgrade/Downgrade Plan) dành riêng cho Admin
CREATE OR REPLACE FUNCTION public.admin_update_user_plan(
    p_user_id UUID,
    p_new_plan TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Zero-Trust: Kiểm tra cứng quyền admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access Denied: Requires Admin Role';
    END IF;

    -- Kiểm tra gói hợp lệ (chỉ cho phép free, pro, premium)
    IF p_new_plan NOT IN ('free', 'pro', 'premium') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Gói không hợp lệ');
    END IF;

    -- Thực hiện cập nhật
    UPDATE public.profiles 
    SET plan = p_new_plan 
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Cập nhật gói thành công'
    );
END;
$$;
