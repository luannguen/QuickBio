export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  cover_image_url: string;
  file_url?: string | null;
  product_type: 'digital' | 'physical';
  inventory_count: number;
  is_unlimited: boolean;
  weight_grams: number;
  affiliate_commission_rate?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}
