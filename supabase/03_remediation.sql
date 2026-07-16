-- Thêm các cột còn thiếu cho Profiles (để hỗ trợ logic nâng cấp và hoa hồng)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by_creator UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 9. Bảng Commissions (Hoa hồng giới thiệu)
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'requested', 'paid')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Commissions
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Xóa policy cũ nếu có rồi tạo lại để tránh lỗi
DROP POLICY IF EXISTS "Cho phép affiliate xem hoa hồng của mình" ON public.commissions;
CREATE POLICY "Cho phép affiliate xem hoa hồng của mình" 
    ON public.commissions FOR SELECT 
    USING (auth.uid() = affiliate_id);

-- 10. RPC Xử lý Thanh Toán SePay (ACID Transaction)
CREATE OR REPLACE FUNCTION public.process_sepay_payment(
    p_payment_code TEXT,
    p_amount NUMERIC,
    p_transaction_id TEXT,
    p_content TEXT,
    p_gateway TEXT,
    p_transfer_type TEXT,
    p_account_number TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_profile RECORD;
    v_commission_amount NUMERIC;
BEGIN
    -- 1. Tìm và Lock đơn hàng (Tránh Race Condition)
    SELECT * INTO v_order 
    FROM public.orders 
    WHERE payment_code = p_payment_code AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or already paid');
    END IF;

    -- Kiểm tra số tiền
    IF p_amount < v_order.amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient amount');
    END IF;

    -- 2. Insert Transaction (Nếu p_transaction_id trùng sẽ quăng lỗi duplicate key -> dừng transaction)
    INSERT INTO public.transactions (
        order_id, gateway, transaction_id, amount, content, transfer_type, account_number
    ) VALUES (
        v_order.id, p_gateway, p_transaction_id, p_amount, p_content, p_transfer_type, p_account_number
    );

    -- 3. Cập nhật trạng thái đơn hàng
    UPDATE public.orders 
    SET status = 'paid', paid_at = NOW() 
    WHERE id = v_order.id;

    -- 4. Logic nâng cấp Pro (Dựa vào product_id cố định)
    IF v_order.product_id = '00000000-0000-0000-0000-000000000001'::UUID THEN
        UPDATE public.profiles 
        SET plan = 'pro' 
        WHERE email = v_order.customer_email;

        -- Tìm xem khách hàng này có ai giới thiệu không
        SELECT * INTO v_profile FROM public.profiles WHERE email = v_order.customer_email;
        IF v_profile.referred_by_creator IS NOT NULL THEN
            v_commission_amount := ROUND(v_order.amount * 0.5);
            INSERT INTO public.commissions (affiliate_id, order_id, amount, status)
            VALUES (v_profile.referred_by_creator, v_order.id, v_commission_amount, 'pending');
        END IF;
    END IF;

    -- 5. Logic hoa hồng trực tiếp từ mã đơn hàng (CTV giới thiệu qua link)
    IF v_order.referred_by IS NOT NULL THEN
        v_commission_amount := ROUND(v_order.amount * 0.5);
        INSERT INTO public.commissions (affiliate_id, order_id, amount, status)
        VALUES (v_order.referred_by::UUID, v_order.id, v_commission_amount, 'pending');
    END IF;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Payment processed successfully',
        'order_id', v_order.id,
        'customer_email', v_order.customer_email,
        'product_id', v_order.product_id
    );

EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'message', 'Duplicate transaction ID');
WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
