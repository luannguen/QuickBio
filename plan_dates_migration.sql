-- Update Admin RPCs to handle plan dates

-- 1. Update get_admin_users to include plan dates
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT,
    plan_purchased_at TIMESTAMPTZ,
    plan_expires_at TIMESTAMPTZ,
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
        p.id, p.email, p.full_name, p.avatar_url, p.plan_tier as plan, p.plan_purchased_at, p.plan_expires_at, p.role, p.created_at,
        COALESCE(SUM(o.amount) FILTER (WHERE o.status = 'paid'), 0) as total_revenue
    FROM public.profiles p
    LEFT JOIN public.products pr ON p.id = pr.user_id
    LEFT JOIN public.orders o ON pr.id = o.product_id
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END;
$$;

-- 2. Create or Update admin_update_user_plan
CREATE OR REPLACE FUNCTION public.admin_update_user_plan(
  p_user_id UUID,
  p_new_plan TEXT,
  p_duration_months INT DEFAULT 12
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Verify admin role
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Access Denied');
  END IF;

  -- Calculate expiration date
  IF p_new_plan = 'free' THEN
    v_expires_at := NULL;
  ELSIF p_new_plan = 'premium' THEN
    -- Premium is practically lifetime (100 years)
    v_expires_at := now() + interval '100 years';
  ELSE
    -- Pro is limited by duration (default 12 months)
    v_expires_at := now() + (p_duration_months || ' months')::interval;
  END IF;

  -- Update user profile
  UPDATE public.profiles
  SET 
    plan_tier = p_new_plan,
    plan_purchased_at = CASE WHEN p_new_plan = 'free' THEN NULL ELSE now() END,
    plan_expires_at = v_expires_at,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Cập nhật gói thành công');
END;
$$;
