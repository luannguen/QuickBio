import { supabase } from "@/shared/api/supabase";
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
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('bio_links')
      .select('*, profiles(avatar_url, plan_tier)')
      .eq('slug', slug.toLowerCase())
      .eq('status', 'published')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching bio link by slug:', error);
      return null;
    }
    if (!data) return null;

    return migrateLegacyBlocks(data);
  },

  getBioByUserId: async (userId: string): Promise<BioLink | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('bio_links')
      .select('*, profiles(avatar_url, plan_tier)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching bio link by userId:', error);
      return null;
    }
    if (!data) return null;

    return migrateLegacyBlocks(data);
  },

  upsertBio: async (userId: string, bioData: Partial<BioLink>): Promise<BioLink | null> => {
    if (!supabase) return null;
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

    const { avatar_url, profiles, ...restBioData } = bioData as any;

    if (avatar_url !== undefined) {
      await supabase
        .from('profiles')
        .update({ avatar_url })
        .eq('id', userId);
    }

    const existing = await bioService.getBioByUserId(userId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('bio_links')
        .update({
          ...restBioData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        avatar_url: avatar_url !== undefined ? avatar_url : existing.avatar_url
      } as BioLink;
    } else {
      const { avatar_url: defaultAvatar, ...restDefaultBio } = defaultBio;
      const { data, error } = await supabase
        .from('bio_links')
        .insert({
          ...restDefaultBio,
          ...restBioData,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        avatar_url: avatar_url || defaultAvatar || ''
      } as BioLink;
    }
  },

  checkSlugAvailable: async (slug: string, currentBioId?: string): Promise<boolean> => {
    if (!supabase) return false;
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) return false;

    let query = supabase
      .from('bio_links')
      .select('id')
      .eq('slug', cleanSlug);
    
    if (currentBioId) {
      query = query.neq('id', currentBioId);
    }

    const { data, error } = await query;
    if (error) return false;
    return data.length === 0;
  }
};
