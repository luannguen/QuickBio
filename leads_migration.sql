-- Bảng lưu trữ danh sách Khách hàng tiềm năng (Leads) thu thập từ Bio
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  block_id UUID, -- Lưu ID của block LEAD_FORM
  email TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Bất kỳ ai cũng có thể gửi Lead (Public insert)
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Chỉ Tenant mới xem được Leads của chính họ
CREATE POLICY "Tenants can view own leads" ON leads FOR SELECT USING (auth.uid() = tenant_id);
