import { supabase, isSupabaseConfigured, mockDb } from "@/shared/api/supabase";

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
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const productService = {
  // Lấy tất cả sản phẩm đang active của một Creator (dành cho trang xem Bio công khai)
  getActiveProductsByUserId: async (userId: string): Promise<Product[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active products:', error);
        return [];
      }
      return data as Product[];
    } else {
      const products = mockDb.get('products');
      return products.filter((p: any) => p.user_id === userId && p.status === 'active');
    }
  },

  // Lấy tất cả sản phẩm của Creator (bao gồm cả sản phẩm ẩn - dành cho Dashboard Admin)
  getProductsByUserId: async (userId: string): Promise<Product[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all products:', error);
        return [];
      }
      return data as Product[];
    } else {
      const products = mockDb.get('products');
      return products.filter((p: any) => p.user_id === userId);
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (userId: string, product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } else {
      const inserted = mockDb.insert('products', {
        ...product,
        user_id: userId
      });
      return inserted as Product;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } else {
      const updated = mockDb.update('products', productId, updates);
      return updated as Product;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (productId: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } else {
      return mockDb.delete('products', productId);
    }
  },

  // Upload file lên Supabase Storage (hoặc trả về link giả lập)
  uploadFile: async (file: File, bucket: 'covers' | 'products'): Promise<string> => {
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } else {
      // Giả lập upload: Chuyển thành Blob URL để xem trước ngay tại máy
      return URL.createObjectURL(file);
    }
  }
};
