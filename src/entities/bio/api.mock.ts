import { mockDb } from "@/shared/api/supabase";
import type { BioLink } from "./api.types";

const migrateLegacyBlocks = (data: any): BioLink => {
  let finalBlocks = data.blocks || [];
  
  if (finalBlocks.length === 0 && data.links && data.links.length > 0) {
    finalBlocks = data.links.map((l: any) => ({
      id: crypto.randomUUID(),
      type: 'LINK',
      title: l.title,
      url: l.url,
      is_visible: l.is_visible !== false
    }));
  }

  const profileData = data.profiles as any;
  return {
    ...data,
    blocks: finalBlocks,
    avatar_url: profileData?.avatar_url || '',
    subscription_tier: profileData?.plan_tier || 'free'
  } as BioLink;
};

export const bioService = {
  getBioBySlug: async (slug: string): Promise<BioLink | null> => {
    const bioLinks = mockDb.get('bio_links');
    const bio = bioLinks.find((b: any) => b.slug === slug.toLowerCase() && b.status === 'published');
    return bio ? migrateLegacyBlocks(bio) : null;
  },

  getBioByUserId: async (userId: string): Promise<BioLink | null> => {
    const bioLinks = mockDb.get('bio_links');
    const bio = bioLinks.find((b: any) => b.user_id === userId);
    return bio ? migrateLegacyBlocks(bio) : null;
  },

  upsertBio: async (userId: string, bioData: Partial<BioLink>): Promise<BioLink | null> => {
    const defaultBio: Partial<BioLink> = {
      slug: `user_${userId.slice(0, 5)}`,
      title: 'Tên của tôi',
      bio_text: 'Mô tả ngắn về tôi',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      theme: {
        background: 'linear-gradient(135deg, #0b0f19 0%, #161f30 100%)',
        textColor: '#ffffff',
        glassmorphism: true,
        accentColor: '#FF6B35'
      },
      social_links: {},
      blocks: [],
      status: 'draft'
    };

    const existing = await bioService.getBioByUserId(userId);
    if (existing) {
      const updated = mockDb.update('bio_links', existing.id, bioData);
      return updated as BioLink;
    } else {
      const inserted = mockDb.insert('bio_links', {
        ...defaultBio,
        ...bioData,
        user_id: userId
      });
      return inserted as BioLink;
    }
  },

  checkSlugAvailable: async (slug: string, currentBioId?: string): Promise<boolean> => {
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) return false;
    const bioLinks = mockDb.get('bio_links');
    const conflict = bioLinks.find((b: any) => b.slug === cleanSlug && b.id !== currentBioId);
    return !conflict;
  }
};
