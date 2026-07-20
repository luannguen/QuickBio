import { supabase } from "@/shared/api/supabase";
import type { LandingPage } from "./api.types";

export const landingService = {
  getLandingPagesByUserId: async (userId: string): Promise<LandingPage[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getLandingPageBySlug: async (userId: string, slug: string): Promise<LandingPage | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', userId)
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return data;
  },

  createLandingPage: async (data: Partial<LandingPage>): Promise<LandingPage | null> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!supabase) return null;
    const { data: result, error } = await supabase
      .from('landing_pages')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  updateLandingPage: async (id: string, data: Partial<LandingPage>): Promise<boolean> => {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };

    if (!supabase) return false;
    const { error } = await supabase
      .from('landing_pages')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  deleteLandingPage: async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('landing_pages')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
