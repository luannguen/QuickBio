import { supabase, isSupabaseConfigured, mockDb } from "@/shared/api/supabase";

export interface LandingPage {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  template_id: string;
  config: any;
  product_id?: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

export const landingService = {
  getLandingPagesByUserId: async (userId: string): Promise<LandingPage[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } else {
      const pages = mockDb.get('landing_pages') || [];
      return pages.filter((p: any) => p.user_id === userId);
    }
  },

  getLandingPageBySlug: async (userId: string, slug: string): Promise<LandingPage | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .eq('slug', slug)
        .single();
      
      if (error) return null;
      return data;
    } else {
      const pages = mockDb.get('landing_pages') || [];
      return pages.find((p: any) => p.user_id === userId && p.slug === slug) || null;
    }
  },

  createLandingPage: async (data: Partial<LandingPage>): Promise<LandingPage | null> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data: result, error } = await supabase
        .from('landing_pages')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return result;
    } else {
      mockDb.insert('landing_pages', payload);
      return payload as LandingPage;
    }
  },

  updateLandingPage: async (id: string, data: Partial<LandingPage>): Promise<boolean> => {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('landing_pages')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      mockDb.update('landing_pages', id, payload);
      return true;
    }
  },

  deleteLandingPage: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } else {
      mockDb.delete('landing_pages', id);
      return true;
    }
  }
};
