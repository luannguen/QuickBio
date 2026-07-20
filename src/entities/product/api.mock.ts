import { mockDb } from "@/shared/api/supabase";
import type { Product } from "./api.types";

export const productService = {
  getActiveProductsByUserId: async (userId: string): Promise<Product[]> => {
    const products = mockDb.get('products');
    return products.filter((p: any) => p.user_id === userId && p.status === 'active');
  },

  getProductsByUserId: async (userId: string): Promise<Product[]> => {
    const products = mockDb.get('products');
    return products.filter((p: any) => p.user_id === userId);
  },

  createProduct: async (userId: string, product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    const inserted = mockDb.insert('products', {
      ...product,
      user_id: userId
    });
    return inserted as Product;
  },

  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
    const updated = mockDb.update('products', productId, updates);
    return updated as Product;
  },

  deleteProduct: async (productId: string): Promise<boolean> => {
    return mockDb.delete('products', productId);
  },

  uploadFile: async (file: File, _bucket: 'covers' | 'products'): Promise<string> => {
    return URL.createObjectURL(file);
  },

  // --- ADMIN ENDPOINTS ---

  adminGetAllProducts: async (): Promise<Product[]> => {
    return mockDb.get('products');
  },

  adminModerateProduct: async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    mockDb.update('products', productId, updates);
    return true;
  }
};
