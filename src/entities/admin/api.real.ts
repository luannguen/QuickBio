import { supabase } from "@/shared/api/supabase";
import type { AdminCommission, AdminStats, AdminUser, AdminOrder } from "./api.types";

export const adminService = {
  getWithdrawals: async (): Promise<AdminCommission[]> => {
    if (!supabase) return [];
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

  approveWithdrawal: async (userId: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error: commError } = await supabase
        .from('commissions')
        .update({ status: 'paid' })
        .eq('affiliate_id', userId)
        .eq('status', 'requested');

      if (commError) throw commError;

      const { data: userStats, error: fetchError } = await supabase
        .from('affiliate_stats')
        .select('available_balance')
        .eq('user_id', userId)
        .single();
        
      if (fetchError || !userStats) throw new Error('Không tìm thấy thông tin thống kê affiliate');
      
      return true;
    } catch (err: any) {
      console.error('Error in approveWithdrawal service:', err);
      throw err;
    }
  },

  getSystemStats: async (): Promise<AdminStats> => {
    if (!supabase) return { total_users: 0, total_orders: 0, total_revenue: 0, total_commissions_paid: 0 };
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data as AdminStats;
  },

  getAllUsers: async (): Promise<AdminUser[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.rpc('get_admin_users');
    if (error) throw error;
    return data as AdminUser[];
  },

  getAllOrders: async (limit = 100): Promise<AdminOrder[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.rpc('get_admin_orders', { p_limit: limit });
    if (error) throw error;
    return data as AdminOrder[];
  },

  updateUserPlan: async (userId: string, newPlan: string, durationMonths?: number): Promise<{success: boolean, message?: string}> => {
    if (!supabase) return { success: false, message: 'Lỗi cấu hình CSDL' };
    try {
      const { data, error } = await supabase.rpc('admin_update_user_plan', {
        p_user_id: userId,
        p_new_plan: newPlan,
        p_duration_months: durationMonths || 12 
      });
      
      if (error) return { success: false, message: error.message };
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
