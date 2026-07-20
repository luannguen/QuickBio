import type { Product } from "@/entities/product/api";

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
  shipping_name?: string | null;
  shipping_phone?: string | null;
  shipping_address?: string | null;
  product?: Product; // Thông tin sản phẩm kèm theo
}

export interface BankConfig {
  bank_code: string;
  bank_account: string;
  account_name: string;
  api_key?: string;
}
