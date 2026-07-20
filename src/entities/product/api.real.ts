import { supabase } from "@/shared/api/supabase";
import type { Product } from "./api.types";

export const productService = {
  getActiveProductsByUserId: async (userId: string): Promise<Product[]> => {
    if (!supabase) return [];
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
  },

  getProductsByUserId: async (userId: string): Promise<Product[]> => {
    if (!supabase) return [];
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
  },

  createProduct: async (userId: string, product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    if (!supabase) return null;
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
  },

  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
    if (!supabase) return null;
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
  },

  deleteProduct: async (productId: string): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  },

  uploadFile: async (file: File, bucket: 'covers' | 'products'): Promise<string> => {
    if (!supabase) return URL.createObjectURL(file);
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
  },

  // --- ADMIN ENDPOINTS ---

  adminGetAllProducts: async (): Promise<Product[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all products as admin:', error);
      return [];
    }
    return data as Product[];
  },

  adminModerateProduct: async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) {
      console.error('Error moderating product:', error);
      return false;
    }
    return true;
  }
};
