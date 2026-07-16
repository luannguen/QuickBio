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

export const adminService = {
  /**
   * Get all requested commissions for admin review
   */
  getWithdrawals: async (): Promise<AdminCommission[]> => {
    if (!isSupabaseConfigured || !supabase) {
      // Return mock withdrawals for local development
      console.log('Using mock admin withdrawals');
      return [
        {
          id: 'comm-1',
          affiliate_id: 'user-2',
          order_id: 'ord-1',
          amount: 75000,
          status: 'requested',
          created_at: new Date().toISOString(),
          profiles: {
            full_name: 'Khánh Vy',
            email: 'khanhvy@test.com',
            payment_info: 'Vietcombank - 0123456789 - KHANH VY'
          },
          orders: {
            payment_code: 'QB10001',
            amount: 150000,
            status: 'paid',
            paid_at: new Date().toISOString(),
            products: {
              name: 'Canva Templates'
            }
          }
        },
        {
          id: 'comm-2',
          affiliate_id: 'user-3',
          order_id: 'ord-2',
          amount: 50000,
          status: 'requested',
          created_at: new Date().toISOString(),
          profiles: {
            full_name: 'Hoàng Minh',
            email: 'hoangminh@test.com',
            payment_info: 'Techcombank - 9876543210 - HOANG MINH'
          },
          orders: {
            payment_code: 'QB10002',
            amount: 100000,
            status: 'paid',
            paid_at: new Date().toISOString(),
            products: {
              name: 'Lightroom Presets'
            }
          }
        }
      ] as AdminCommission[];
    }

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (!token) {
        throw new Error('Chưa đăng nhập hoặc phiên làm việc đã hết hạn');
      }

      const res = await fetch('/api/admin/withdrawals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Lỗi khi tải dữ liệu từ máy chủ quản trị');
      }

      const data = await res.json();
      return (data.commissions || []) as AdminCommission[];
    } catch (err: any) {
      console.error('Error in getWithdrawals service:', err);
      throw err;
    }
  },

  /**
   * Approve withdrawal request and pay commission to affiliate
   */
  approveWithdrawal: async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Approve withdrawal simulated for user:', userId);
      return true;
    }

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (!token) {
        throw new Error('Chưa đăng nhập hoặc phiên làm việc đã hết hạn');
      }

      const res = await fetch('/api/admin/approve-withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Lỗi khi phê duyệt yêu cầu rút tiền');
      }

      return true;
    } catch (err: any) {
      console.error('Error in approveWithdrawal service:', err);
      throw err;
    }
  }
};
