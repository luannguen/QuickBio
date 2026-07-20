import { mockDb } from "@/shared/api/supabase";
import type { LandingPage } from "./api.types";

export const landingService = {
  getLandingPagesByUserId: async (userId: string): Promise<LandingPage[]> => {
    const pages = mockDb.get('landing_pages') || [];
    return pages.filter((p: any) => p.user_id === userId);
  },

  getLandingPageBySlug: async (userId: string, slug: string): Promise<LandingPage | null> => {
    const pages = mockDb.get('landing_pages') || [];
    return pages.find((p: any) => p.user_id === userId && p.slug === slug) || null;
  },

  createLandingPage: async (data: Partial<LandingPage>): Promise<LandingPage | null> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.insert('landing_pages', payload);
    return payload as LandingPage;
  },

  updateLandingPage: async (id: string, data: Partial<LandingPage>): Promise<boolean> => {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };
    mockDb.update('landing_pages', id, payload);
    return true;
  },

  deleteLandingPage: async (id: string): Promise<boolean> => {
    mockDb.delete('landing_pages', id);
    return true;
  }
};
