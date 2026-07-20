import { mockDb } from "@/shared/api/supabase";
import type { AdminCommission, AdminStats, AdminUser, AdminOrder } from "./api.types";

export const adminService = {
  getWithdrawals: async (): Promise<AdminCommission[]> => {
    return [];
  },

  approveWithdrawal: async (_userId: string): Promise<boolean> => {
    return true;
  },

  getSystemStats: async (): Promise<AdminStats> => {
    return {
      total_users: 156,
      total_orders: 3250,
      total_revenue: 45000000,
      total_commissions_paid: 12000000
    };
  },

  getAllUsers: async (): Promise<AdminUser[]> => {
    return mockDb.get('profiles') as AdminUser[];
  },

  getAllOrders: async (_limit = 100): Promise<AdminOrder[]> => {
    return mockDb.get('orders') as AdminOrder[];
  },

  updateUserPlan: async (_userId: string, _newPlan: string, _durationMonths?: number): Promise<{success: boolean, message?: string}> => {
    return { success: true, message: 'Mock update success' };
  }
};
