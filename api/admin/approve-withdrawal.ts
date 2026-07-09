import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['luan.nguyenthien@gmail.com', 'luannguyenthien@gmail.com', 'luannguyen@quickbio.vn'];

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
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

    // Cập nhật trạng thái tất cả commission 'requested' của user này sang 'paid'
    const { error: dbError } = await supabaseAdmin
      .from('commissions')
      .update({ status: 'paid' })
      .eq('affiliate_id', userId)
      .eq('status', 'requested');

    if (dbError) {
      throw dbError;
    }

    return res.status(200).json({ message: 'Withdrawal approved successfully' });
  } catch (err: any) {
    console.error('Error approving withdrawal:', err);
    return res.status(500).json({ message: err.message });
  }
}
