import { supabase, isSupabaseConfigured, mockDb } from './supabase';
import type { Product } from './productService';

export interface Order {
  id: string;
  product_id: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  payment_code: string;
  status: 'pending' | 'paid' | 'expired';
  created_at: string;
  paid_at?: string;
  referred_by?: string; // ID của affiliate giới thiệu
  product?: Product; // Thông tin sản phẩm kèm theo
}

export interface BankConfig {
  bank_code: string;
  bank_account: string;
  account_name: string;
  api_key?: string;
}

export const orderService = {
  // Lấy cấu hình ngân hàng/SePay của Creator
  getBankConfig: async (creatorId: string): Promise<BankConfig | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('sepay_configs')
        .select('*')
        .eq('user_id', creatorId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching bank config:', error);
        return null;
      }
      return data as BankConfig | null;
    } else {
      const configs = mockDb.get('sepay_configs');
      const config = configs.find((c: any) => c.user_id === creatorId);
      return config || null;
    }
  },

  // Lưu cấu hình ngân hàng/SePay
  saveBankConfig: async (creatorId: string, config: BankConfig): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const existing = await orderService.getBankConfig(creatorId);
      if (existing) {
        const { error } = await supabase
          .from('sepay_configs')
          .update(config)
          .eq('user_id', creatorId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sepay_configs')
          .insert({
            ...config,
            user_id: creatorId
          });
        if (error) throw error;
      }
      return true;
    } else {
      const configs = mockDb.get('sepay_configs');
      const index = configs.findIndex((c: any) => c.user_id === creatorId);
      if (index !== -1) {
        configs[index] = { ...configs[index], ...config };
      } else {
        configs.push({ id: crypto.randomUUID(), user_id: creatorId, ...config, created_at: new Date().toISOString() });
      }
      mockDb.save('sepay_configs', configs);
      return true;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData: {
    product_id: string;
    customer_email: string;
    customer_name: string;
    amount: number;
    referred_by?: string;
  }): Promise<Order | null> => {
    // Sinh mã thanh toán duy nhất dạng: QB + 5 chữ số ngẫu nhiên
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const paymentCode = `QB${randomNum}`;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          product_id: orderData.product_id,
          customer_email: orderData.customer_email.trim().toLowerCase(),
          customer_name: orderData.customer_name.trim(),
          amount: orderData.amount,
          payment_code: paymentCode,
          status: 'pending',
          referred_by: orderData.referred_by || null
        })
        .select()
        .single();

      if (error) throw error;
      
      // Lấy thêm thông tin sản phẩm
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', orderData.product_id)
        .single();

      return { ...(data as Order), product: product as Product };
    } else {
      // Mock mode
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
    }
  },

  // Lấy thông tin chi tiết của một đơn hàng (để trang QR code check trạng thái)
  getOrderById: async (orderId: string): Promise<Order | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .eq('id', orderId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching order by id:', error);
        return null;
      }
      return data as Order | null;
    } else {
      const orders = mockDb.get('orders');
      const order = orders.find((o: any) => o.id === orderId);
      if (!order) return null;
      
      const products = mockDb.get('products');
      const product = products.find((p: any) => p.id === order.product_id);
      
      return { ...order, product };
    }
  },

  // Sinh đường dẫn ảnh VietQR động từ thông tin ngân hàng và hóa đơn
  generateVietQrUrl: (bankConfig: BankConfig, amount: number, paymentCode: string): string => {
    const bankCode = encodeURIComponent(bankConfig.bank_code);
    const bankAccount = encodeURIComponent(bankConfig.bank_account);
    const accountName = encodeURIComponent(bankConfig.account_name.toUpperCase());
    const addInfo = encodeURIComponent(paymentCode);
    
    // Sử dụng API VietQR
    return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  },

  // Lấy toàn bộ danh sách đơn hàng của một Creator (dành cho Dashboard)
  getOrdersByCreatorId: async (creatorId: string): Promise<Order[]> => {
    if (isSupabaseConfigured && supabase) {
      // Vì RLS đã check quyền, ta chỉ cần truy vấn tất cả orders có join products
      // lọc theo products.user_id = creatorId
      const { data, error } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      // Filter local nếu cần hoặc do chính RLS lo
      const orders = data as Order[];
      return orders.filter(o => o.product && o.product.user_id === creatorId);
    } else {
      // Mock mode
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
    }
  },

  // Xử lý mô phỏng thanh toán (Webhook Simulator dành cho User test)
  simulatePaymentWebhook: async (paymentCode: string, transferAmount: number): Promise<boolean> => {
    // 1. Tìm đơn hàng có mã payment_code này và trạng thái pending
    let targetOrder: Order | null = null;
    
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_code', paymentCode.toUpperCase().trim())
        .eq('status', 'pending')
        .maybeSingle();
      
      targetOrder = data as Order | null;
    } else {
      const orders = mockDb.get('orders');
      const order = orders.find((o: any) => o.payment_code === paymentCode.toUpperCase().trim() && o.status === 'pending');
      targetOrder = order || null;
    }

    if (!targetOrder) {
      console.warn('Không tìm thấy đơn hàng pending khớp với mã thanh toán:', paymentCode);
      return false;
    }

    // 2. Cập nhật đơn hàng thành đã thanh toán (paid)
    const paidAt = new Date().toISOString();
    
    if (isSupabaseConfigured && supabase) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: paidAt })
        .eq('id', targetOrder.id);
      
      if (updateError) throw updateError;
      
      // Tạo giao dịch
      await supabase.from('transactions').insert({
        order_id: targetOrder.id,
        transaction_id: `MOCK_TX_${Date.now()}`,
        amount: transferAmount,
        content: paymentCode,
        transfer_type: 'in'
      });
    } else {
      // Mock mode
      mockDb.update('orders', targetOrder.id, { status: 'paid', paid_at: paidAt });
      mockDb.insert('transactions', {
        order_id: targetOrder.id,
        transaction_id: `MOCK_TX_${Date.now()}`,
        amount: transferAmount,
        content: paymentCode,
        transfer_type: 'in'
      });
    }

    return true;
  }
};
