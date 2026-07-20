import { supabase } from "@/shared/api/supabase";
import type { Product } from "@/entities/product/api";
import type { Order, BankConfig } from "./api.types";

export const orderService = {
  getBankConfig: async (creatorId: string): Promise<BankConfig | null> => {
    if (!supabase) return null;
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
  },

  saveBankConfig: async (creatorId: string, config: BankConfig): Promise<boolean> => {
    if (!supabase) return false;
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

    if (!supabase) return null;
    const { data, error } = await supabase
      .from('orders')
      .insert({
        product_id: orderData.product_id,
        customer_email: orderData.customer_email.trim().toLowerCase(),
        customer_name: orderData.customer_name.trim(),
        amount: orderData.amount,
        payment_code: paymentCode,
        status: 'pending',
        referred_by: orderData.referred_by || null,
        shipping_name: orderData.shipping_name || null,
        shipping_phone: orderData.shipping_phone || null,
        shipping_address: orderData.shipping_address || null
      })
      .select()
      .single();

    if (error) throw error;
    
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', orderData.product_id)
      .single();

    return { ...(data as Order), product: product as Product };
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    if (!supabase) return null;
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
  },

  generateVietQrUrl: (bankConfig: BankConfig, amount: number, paymentCode: string): string => {
    const bankCode = encodeURIComponent(bankConfig.bank_code);
    const bankAccount = encodeURIComponent(bankConfig.bank_account);
    const accountName = encodeURIComponent(bankConfig.account_name.toUpperCase());
    const addInfo = encodeURIComponent(paymentCode);
    
    return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  },

  getOrdersByCreatorId: async (creatorId: string): Promise<Order[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    const orders = data as Order[];
    return orders.filter(o => o.product && o.product.user_id === creatorId);
  },

  simulatePaymentWebhook: async (paymentCode: string, transferAmount: number): Promise<boolean> => {
    let targetOrder: Order | null = null;
    
    if (!supabase) return false;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_code', paymentCode.toUpperCase().trim())
      .eq('status', 'pending')
      .maybeSingle();
    
    targetOrder = data as Order | null;

    if (!targetOrder) {
      console.warn('Không tìm thấy đơn hàng pending khớp với mã thanh toán:', paymentCode);
      return false;
    }

    const paidAt = new Date().toISOString();
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid', paid_at: paidAt })
      .eq('id', targetOrder.id);
    
    if (updateError) throw updateError;
    
    await supabase.from('transactions').insert({
      order_id: targetOrder.id,
      transaction_id: `MOCK_TX_${Date.now()}`,
      amount: transferAmount,
      content: paymentCode,
      transfer_type: 'in'
    });

    try {
      let creatorId = '';
      const { data: prodData } = await supabase.from('products').select('user_id, name').eq('id', targetOrder.product_id).single();
      if (prodData) {
        creatorId = prodData.user_id;
        const { data: profile } = await supabase.from('profiles').select('telegram_chat_id').eq('id', creatorId).single();
        if (profile && profile.telegram_chat_id) {
          console.log(`[TELEGRAM MOCK] Send message to chat ${profile.telegram_chat_id}: \n` +
            `✅ TING TING! Có đơn hàng mới!\nSản phẩm: ${prodData.name}\nDoanh thu: ${transferAmount}đ\nMã: ${paymentCode}`);
        }
      }
    } catch (err) {
      console.warn("Telegram notification mock error:", err);
    }

    return true;
  }
};
