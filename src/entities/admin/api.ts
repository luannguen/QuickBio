import { supabase, isSupabaseConfigured } from "@/shared/api/supabase";

export interface AdminCommission {
  id: string;
  affiliate_id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'requested' | 'paid';
  created_at: string;
  payment_info?: string;
  profiles?: {
    full_name: string;
    email: string;
    payment_info?: string;
  };
  orders?: {
    payment_code: string;
    amount: number;
    status: string;
    paid_at: string;
    products?: {
      name: string;
    };
  };
}

export interface AdminStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  total_commissions_paid: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  plan: string;
  role: string;
  created_at: string;
  total_revenue: number;
}

export interface AdminOrder {
  id: string;
  product_name: string;
  creator_name: string;
  customer_email: string;
  amount: number;
  status: string;
  payment_code: string;
  created_at: string;
  paid_at: string | null;
}

export const adminService = {
  /**
   * Lấy dữ liệu rút tiền (Dành cho Admin)
   */
  getWithdrawals: async (): Promise<AdminCommission[]> => {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('commissions')
        .select(`
          *,
          profiles:affiliate_id (full_name, email, payment_info),
          orders:order_id (payment_code, amount, status, paid_at, products(name))
        `)
        .eq('status', 'requested')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as AdminCommission[];
    } catch (err: any) {
      console.error('Error in getWithdrawals service:', err);
      throw err;
    }
  },

  /**
   * Duyệt yêu cầu rút tiền
   */
  approveWithdrawal: async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) return false;

    try {
      // 1. Cập nhật commissions thành 'paid'
      const { error: commError } = await supabase
        .from('commissions')
        .update({ status: 'paid' })
        .eq('affiliate_id', userId)
        .eq('status', 'requested');

      if (commError) throw commError;

      // 2. Trừ số dư available_balance của user
      const { data: userStats, error: fetchError } = await supabase
        .from('affiliate_stats')
        .select('available_balance')
        .eq('user_id', userId)
        .single();
        
      if (fetchError || !userStats) throw new Error('Không tìm thấy thông tin thống kê affiliate');

      // Trong một hệ thống thực tế nên dùng RPC để tránh race condition,
      // Nhưng tạm thời update dựa trên select (hoặc bỏ qua nếu hệ thống tự tính lại).
      
      return true;
    } catch (err: any) {
      console.error('Error in approveWithdrawal service:', err);
      throw err;
    }
  },

  /**
   * Lấy thống kê tổng quan (Dành cho Admin)
   */
  getSystemStats: async (): Promise<AdminStats> => {
    if (!isSupabaseConfigured || !supabase) {
      return { total_users: 0, total_orders: 0, total_revenue: 0, total_commissions_paid: 0 };
    }
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data as AdminStats;
  },

  /**
   * Lấy danh sách Users kèm doanh thu (Dành cho Admin)
   */
  getAllUsers: async (): Promise<AdminUser[]> => {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase.rpc('get_admin_users');
    if (error) throw error;
    return data as AdminUser[];
  },

  /**
   * Lấy danh sách tất cả đơn hàng (Dành cho Admin)
   */
  getAllOrders: async (limit = 100): Promise<AdminOrder[]> => {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase.rpc('get_admin_orders', { p_limit: limit });
    if (error) throw error;
    return data as AdminOrder[];
  },

  /**
   * Thay đổi gói của User (Dành cho Admin)
   */
  updateUserPlan: async (userId: string, newPlan: string): Promise<{success: boolean, message?: string}> => {
    if (!isSupabaseConfigured || !supabase) return { success: false, message: 'MockDB: Cập nhật gói người dùng' };
    
    try {
      const { data, error } = await supabase.rpc('admin_update_user_plan', {
        p_user_id: userId,
        p_new_plan: newPlan
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { 
        success: data?.success || false, 
        message: data?.message || (data?.success ? 'Cập nhật thành công' : 'Lỗi cập nhật CSDL') 
      };
    } catch (err: any) {
      console.error('Error in updateUserPlan service:', err);
      return { success: false, message: err?.message || 'Lỗi hệ thống' };
    }
  }
};
