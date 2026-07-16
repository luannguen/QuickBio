-- Nâng cấp lược đồ Ecommerce cho mô hình SaaS Multi-tenant & Sản phẩm Vật lý
-- Bảng Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'digital' CHECK (product_type IN ('digital', 'physical'));
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_count INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_unlimited BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_grams INT DEFAULT 0;
ALTER TABLE public.products ALTER COLUMN file_url DROP NOT NULL;

-- Bảng Orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Thêm quyền Super Admin cho bảng products (Xoá policy cũ nếu có rồi tạo lại)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
    DROP POLICY IF EXISTS "Admins can update any product" ON public.products;
    DROP POLICY IF EXISTS "Admins can delete any product" ON public.products;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

CREATE POLICY "Admins can view all products" 
    ON public.products FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (role = 'admin' OR email IN ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
      )
    );

CREATE POLICY "Admins can update any product" 
    ON public.products FOR UPDATE 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (role = 'admin' OR email IN ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
      )
    );

CREATE POLICY "Admins can delete any product" 
    ON public.products FOR DELETE 
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (role = 'admin' OR email IN ('luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'))
      )
    );
