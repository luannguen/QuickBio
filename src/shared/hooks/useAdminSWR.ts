import useSWR from 'swr';
import { adminService } from '@/entities/admin/api';
import { articleService } from '@/entities/article/api';
import { productService } from '@/entities/product/api';

export function useAdminStats(shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? 'admin_stats' : null, adminService.getSystemStats);
}

export function useAdminUsers(shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? 'admin_users' : null, adminService.getAllUsers);
}

export function useAdminOrders(limit: number = 100, shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? `admin_orders_${limit}` : null, () => adminService.getAllOrders(limit));
}

export function useAdminWithdrawals(shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? 'admin_withdrawals' : null, adminService.getWithdrawals);
}

export function useAdminArticles(shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? 'admin_articles' : null, articleService.adminGetAllArticles);
}

export function useAdminProducts(shouldFetch: boolean = true) {
  return useSWR(shouldFetch ? 'admin_products' : null, productService.adminGetAllProducts);
}
