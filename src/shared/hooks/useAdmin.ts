import { useState, useCallback } from 'react';
import { adminService } from "@/entities/admin/api";
import type { AdminCommission, AdminStats, AdminUser, AdminOrder } from "@/entities/admin/api";

export function useAdmin() {
  const [commissions, setCommissions] = useState<AdminCommission[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getWithdrawals();
      setCommissions(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu rút tiền');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải thống kê');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async (limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllOrders(limit);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách đơn hàng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveWithdrawal = useCallback(async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await adminService.approveWithdrawal(userId);
      if (success) {
        // Refresh data
        const data = await adminService.getWithdrawals();
        setCommissions(data);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phê duyệt yêu cầu rút tiền');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    commissions,
    stats,
    users,
    orders,
    loading,
    error,
    loadAdminData,
    loadDashboardStats,
    loadUsers,
    loadOrders,
    approveWithdrawal
  };
}
