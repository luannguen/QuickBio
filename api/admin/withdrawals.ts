import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'];

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Xác minh danh tính người gọi API từ token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || !ADMIN_EMAILS.includes(user.email || '')) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    // Lấy toàn bộ danh sách commissions có trạng thái requested hoặc paid
    const { data: commissions, error: dbError } = await supabaseAdmin
      .from('commissions')
      .select('*, profiles:affiliate_id(full_name, email, payment_info), orders(payment_code, amount, products(name))')
      .order('created_at', { ascending: false });

    if (dbError) {
      throw dbError;
    }

    return res.status(200).json({ commissions });
  } catch (err: any) {
    console.error('Error fetching withdrawals:', err);
    return res.status(500).json({ message: err.message });
  }
}
