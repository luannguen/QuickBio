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

export interface AdminStats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  total_commissions_paid: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  plan: string;
  plan_purchased_at?: string;
  plan_expires_at?: string;
  role: string;
  created_at: string;
  total_revenue: number;
}

export interface AdminOrder {
  id: string;
  product_name: string;
  creator_name: string;
  customer_email: string;
  amount: number;
  status: string;
  payment_code: string;
  created_at: string;
  paid_at: string | null;
}
