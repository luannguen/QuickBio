import { useState, useCallback } from 'react';
import { orderService } from "@/entities/order/api";
import type { Order, BankConfig } from "@/entities/order/api";

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tạo đơn hàng mới
  const createNewOrder = useCallback(async (orderData: {
    product_id: string;
    customer_email: string;
    customer_name: string;
    amount: number;
    referred_by?: string;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
  }): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.createOrder(orderData);
      return order;
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err.message || 'Lỗi khi tạo đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy chi tiết đơn hàng
  const getOrderDetails = useCallback(async (orderId: string): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrderById(orderId);
      return order;
    } catch (err: any) {
      console.error('Failed to get order details:', err);
      setError(err.message || 'Lỗi khi lấy thông tin đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách đơn hàng của một Creator
  const getCreatorOrders = useCallback(async (creatorId: string): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const orders = await orderService.getOrdersByCreatorId(creatorId);
      return orders;
    } catch (err: any) {
      console.error('Failed to fetch creator orders:', err);
      setError(err.message || 'Lỗi khi lấy lịch sử đơn hàng');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy cấu hình ngân hàng
  const getBankSettings = useCallback(async (creatorId: string): Promise<BankConfig | null> => {
    try {
      return await orderService.getBankConfig(creatorId);
    } catch (err) {
      console.error('Failed to get bank config:', err);
      return null;
    }
  }, []);

  // Lưu cấu hình ngân hàng
  const saveBankSettings = useCallback(async (creatorId: string, config: BankConfig): Promise<boolean> => {
    setLoading(true);
    try {
      return await orderService.saveBankConfig(creatorId, config);
    } catch (err: any) {
      console.error('Failed to save bank config:', err);
      setError(err.message || 'Lỗi khi lưu cấu hình ngân hàng');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sinh QR Code Url
  const getQrUrl = useCallback((bankConfig: BankConfig, amount: number, paymentCode: string): string => {
    return orderService.generateVietQrUrl(bankConfig, amount, paymentCode);
  }, []);

  // Mô phỏng Webhook chuyển khoản ngân hàng (dành cho test)
  const simulatePayment = useCallback(async (paymentCode: string, amount: number): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await orderService.simulatePaymentWebhook(paymentCode, amount);
      return success;
    } catch (err: any) {
      console.error('Failed to simulate payment:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createNewOrder,
    getOrderDetails,
    getCreatorOrders,
    getBankSettings,
    saveBankSettings,
    getQrUrl,
    simulatePayment
  };
};
export default useOrders;
