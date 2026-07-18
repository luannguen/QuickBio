import { useState, useCallback } from 'react';
import { adminService } from "@/entities/admin/api";
import type { AdminCommission, AdminStats, AdminUser, AdminOrder } from "@/entities/admin/api";
import { articleService } from "@/entities/article/api";
import type { Article } from "@/entities/article/api";
import { productService } from "@/entities/product/api";
import type { Product } from "@/entities/product/api";

export function useAdmin() {
  const [commissions, setCommissions] = useState<AdminCommission[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [articles, setArticles] = useState<(Article & { profiles?: { full_name: string, email: string } })[]>([]);
  const [products, setProducts] = useState<(Product & { profiles?: { full_name: string, email: string } })[]>([]);
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

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articleService.adminGetAllArticles();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách bài viết');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.adminGetAllProducts();
      setProducts(data as any);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách sản phẩm');
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

  const moderateArticle = useCallback(async (articleId: string, action: 'approve' | 'warn' | 'suspend' | 'delete', reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (action === 'delete') {
        await articleService.deleteArticle(articleId);
      } else {
        let mappedAction: 'approved' | 'warned' | 'suspended' = 'approved';
        if (action === 'suspend') mappedAction = 'suspended';
        if (action === 'warn') mappedAction = 'warned';
        
        await articleService.adminModerateArticle(articleId, mappedAction, reason);
      }
      
      const data = await articleService.adminGetAllArticles();
      setArticles(data);
      return true;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kiểm duyệt bài viết');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateProduct = useCallback(async (productId: string, action: 'suspend' | 'delete'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (action === 'delete') {
        await productService.deleteProduct(productId);
      } else if (action === 'suspend') {
        await productService.adminModerateProduct(productId, { status: 'inactive' });
      }
      
      const data = await productService.adminGetAllProducts();
      setProducts(data as any);
      return true;
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kiểm duyệt sản phẩm');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeUserPlan = useCallback(async (userId: string, newPlan: string, durationMonths?: number): Promise<{success: boolean, message?: string}> => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.updateUserPlan(userId, newPlan, durationMonths);
      if (res.success) {
        // Refresh users list
        const data = await adminService.getAllUsers();
        setUsers(data);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Không thể cập nhật gói người dùng' };
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật gói người dùng');
      console.error(err);
      return { success: false, message: err.message || 'Lỗi khi cập nhật gói người dùng' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    commissions,
    stats,
    users,
    orders,
    articles,
    products,
    loading,
    error,
    loadAdminData,
    loadDashboardStats,
    loadUsers,
    loadOrders,
    loadArticles,
    loadProducts,
    approveWithdrawal,
    moderateArticle,
    moderateProduct,
    changeUserPlan
  };
}
