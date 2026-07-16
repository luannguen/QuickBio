-- Cấu hình cơ sở dữ liệu Supabase cho QuickBio & DigiStore

-- 1. Bảng Profiles (Thông tin người dùng/Creator)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép xem thông tin profile công khai" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Cho phép chính chủ cập nhật profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. Bảng Bio Links (Cấu hình trang Bio-Link cá nhân)
CREATE TABLE public.bio_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    bio_text TEXT,
    theme JSONB DEFAULT '{"background": "linear-gradient(135deg, #0f172a, #1e293b)", "textColor": "#ffffff", "glassmorphism": true}'::jsonb NOT NULL,
    social_links JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Bio Links
ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép xem Bio Link đã xuất bản công khai" 
    ON public.bio_links FOR SELECT 
    USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Cho phép chính chủ chỉnh sửa Bio Link" 
    ON public.bio_links FOR ALL 
    USING (auth.uid() = user_id);

-- 3. Bảng Products (Sản phẩm số để bán)
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC CHECK (price >= 0) NOT NULL,
    cover_image_url TEXT,
    file_url TEXT NOT NULL, -- Link tải file sản phẩm số
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép xem sản phẩm đang hoạt động công khai" 
    ON public.products FOR SELECT 
    USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Cho phép chính chủ quản lý sản phẩm" 
    ON public.products FOR ALL 
    USING (auth.uid() = user_id);

-- 4. Bảng Orders (Đơn hàng mua sản phẩm số)
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    amount NUMERIC NOT NULL,
    payment_code TEXT UNIQUE NOT NULL, -- Cú pháp chuyển khoản (ví dụ: QB89271)
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    paid_at TIMESTAMPTZ
);

-- Kích hoạt RLS cho Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Chủ sản phẩm được quyền xem đơn hàng
CREATE POLICY "Cho phép chủ sản phẩm xem đơn hàng của mình" 
    ON public.orders FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.products p 
            WHERE p.id = orders.product_id AND p.user_id = auth.uid()
        )
    );

-- Khách hàng mua có thể xem đơn hàng của họ qua email + id đơn hàng (sẽ verify ở frontend/hook)
CREATE POLICY "Cho phép khách mua xem đơn hàng của chính họ"
    ON public.orders FOR SELECT
    USING (true); -- Ta cho phép select công khai nhưng hook sẽ validate ID đơn hàng để hiển thị

-- 5. Bảng SePay Configs (Cấu hình cổng thanh toán SePay cho Creator)
CREATE TABLE public.sepay_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    api_key TEXT, -- Để xác minh API key gửi kèm webhook
    bank_account TEXT NOT NULL, -- Số tài khoản nhận tiền
    bank_code TEXT NOT NULL, -- Tên viết tắt ngân hàng (VCB, MB, TCB...)
    account_name TEXT NOT NULL, -- Tên chủ tài khoản viết hoa không dấu
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho SePay Configs
ALTER TABLE public.sepay_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chỉ cho phép chính chủ quản lý cấu hình SePay" 
    ON public.sepay_configs FOR ALL 
    USING (auth.uid() = user_id);

-- 6. Bảng Transactions (Lịch sử giao dịch nhận được qua Webhook)
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    gateway TEXT DEFAULT 'sepay' NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL, -- Mã giao dịch ngân hàng
    amount NUMERIC NOT NULL,
    content TEXT, -- Nội dung chuyển khoản
    transfer_type TEXT DEFAULT 'in' NOT NULL,
    account_number TEXT, -- Số tài khoản nhận
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép chủ cửa hàng xem giao dịch" 
    ON public.transactions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.products p ON o.product_id = p.id
            WHERE o.id = transactions.order_id AND p.user_id = auth.uid()
        )
    );

-- 7. Trigger tự động tạo Profile khi có User đăng ký mới từ auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Bảng Marketing Settings (Cấu hình tự động tiếp thị Facebook & Gemini AI)
CREATE TABLE public.marketing_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    fb_page_id TEXT,
    fb_page_token TEXT,
    is_active BOOLEAN DEFAULT false NOT NULL,
    style TEXT DEFAULT 'Thuyết phục' NOT NULL,
    target_product_id TEXT,
    gemini_api_key TEXT,
    last_posted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Kích hoạt RLS cho Marketing Settings
ALTER TABLE public.marketing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép chính chủ quản lý cấu hình marketing" 
    ON public.marketing_settings FOR ALL 
    USING (auth.uid() = user_id);

-- Thêm các cột còn thiếu cho Profiles (để hỗ trợ logic nâng cấp và hoa hồng)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by_creator UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 9. Bảng Commissions (Hoa hồng giới thiệu)
CREATE TABLE public.commissions (
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
