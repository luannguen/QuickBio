import { mockDb } from "@/shared/api/supabase";
import type { Order, BankConfig } from "./api.types";

export const orderService = {
  getBankConfig: async (creatorId: string): Promise<BankConfig | null> => {
    const configs = mockDb.get('sepay_configs');
    const config = configs.find((c: any) => c.user_id === creatorId);
    return config || null;
  },

  saveBankConfig: async (creatorId: string, config: BankConfig): Promise<boolean> => {
    const configs = mockDb.get('sepay_configs');
    const index = configs.findIndex((c: any) => c.user_id === creatorId);
    if (index !== -1) {
      configs[index] = { ...configs[index], ...config };
    } else {
      configs.push({ id: crypto.randomUUID(), user_id: creatorId, ...config, created_at: new Date().toISOString() });
    }
    mockDb.save('sepay_configs', configs);
    return true;
  },

  createOrder: async (orderData: {
    product_id: string;
    customer_email: string;
    customer_name: string;
    amount: number;
    referred_by?: string;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
  }): Promise<Order | null> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const paymentCode = `QB${randomNum}`;

    const products = mockDb.get('products');
    const product = products.find((p: any) => p.id === orderData.product_id);
    
    const order = mockDb.insert('orders', {
      product_id: orderData.product_id,
      customer_email: orderData.customer_email.trim().toLowerCase(),
      customer_name: orderData.customer_name.trim(),
      amount: orderData.amount,
      payment_code: paymentCode,
      status: 'pending',
      referred_by: orderData.referred_by || null
    });

    return { ...(order as Order), product };
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = mockDb.get('orders');
    const order = orders.find((o: any) => o.id === orderId);
    if (!order) return null;
    
    const products = mockDb.get('products');
    const product = products.find((p: any) => p.id === order.product_id);
    
    return { ...order, product };
  },

  generateVietQrUrl: (bankConfig: BankConfig, amount: number, paymentCode: string): string => {
    const bankCode = encodeURIComponent(bankConfig.bank_code);
    const bankAccount = encodeURIComponent(bankConfig.bank_account);
    const accountName = encodeURIComponent(bankConfig.account_name.toUpperCase());
    const addInfo = encodeURIComponent(paymentCode);
    
    return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  },

  getOrdersByCreatorId: async (creatorId: string): Promise<Order[]> => {
    const orders = mockDb.get('orders');
    const products = mockDb.get('products');
    
    const result: Order[] = [];
    orders.forEach((o: any) => {
      const prod = products.find((p: any) => p.id === o.product_id && p.user_id === creatorId);
      if (prod) {
        result.push({ ...o, product: prod });
      }
    });
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  simulatePaymentWebhook: async (paymentCode: string, transferAmount: number): Promise<boolean> => {
    let targetOrder: Order | null = null;
    
    const orders = mockDb.get('orders');
    const order = orders.find((o: any) => o.payment_code === paymentCode.toUpperCase().trim() && o.status === 'pending');
    targetOrder = order || null;

    if (!targetOrder) {
      console.warn('Không tìm thấy đơn hàng pending khớp với mã thanh toán:', paymentCode);
      return false;
    }

    const paidAt = new Date().toISOString();
    
    mockDb.update('orders', targetOrder.id, { status: 'paid', paid_at: paidAt });
    mockDb.insert('transactions', {
      order_id: targetOrder.id,
      transaction_id: `MOCK_TX_${Date.now()}`,
      amount: transferAmount,
      content: paymentCode,
      transfer_type: 'in'
    });

    try {
      let creatorId = '';
      const products = mockDb.get('products');
      const prod = products.find((p: any) => p.id === targetOrder?.product_id);
      if (prod) {
        creatorId = prod.user_id;
        const profiles = mockDb.get('profiles');
        const prof = profiles.find((p: any) => p.id === creatorId);
        if (prof && prof.telegram_chat_id) {
          console.log(`[TELEGRAM MOCK] Send message to chat ${prof.telegram_chat_id}: \n` +
            `✅ TING TING! Có đơn hàng mới!\nSản phẩm: ${prod.name}\nDoanh thu: ${transferAmount}đ\nMã: ${paymentCode}`);
        }
      }
    } catch (err) {
      console.warn("Telegram notification mock error:", err);
    }

    return true;
  }
};
