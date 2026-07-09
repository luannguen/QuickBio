import { supabase, isSupabaseConfigured, mockDb } from './supabase';

export interface BioLink {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio_text: string;
  avatar_url: string; // Thêm avatar_url
  theme: {
    background: string;
    textColor: string;
    glassmorphism: boolean;
    accentColor: string;
  };
  social_links: {
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export const bioService = {
  // Lấy Bio-Link bằng slug (dành cho trang xem công khai)
  getBioBySlug: async (slug: string): Promise<BioLink | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bio_links')
        .select('*, profiles(avatar_url)')
        .eq('slug', slug.toLowerCase())
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching bio link by slug:', error);
        return null;
      }
      if (!data) return null;

      const profileData = data.profiles as any;
      return {
        ...data,
        avatar_url: profileData?.avatar_url || ''
      } as BioLink;
    } else {
      const bioLinks = mockDb.get('bio_links');
      const bio = bioLinks.find((b: any) => b.slug === slug.toLowerCase() && b.status === 'published');
      return bio || null;
    }
  },

  // Lấy Bio-Link của user hiện tại
  getBioByUserId: async (userId: string): Promise<BioLink | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('bio_links')
        .select('*, profiles(avatar_url)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching bio link by userId:', error);
        return null;
      }
      if (!data) return null;

      const profileData = data.profiles as any;
      return {
        ...data,
        avatar_url: profileData?.avatar_url || ''
      } as BioLink;
    } else {
      const bioLinks = mockDb.get('bio_links');
      const bio = bioLinks.find((b: any) => b.user_id === userId);
      return bio || null;
    }
  },

  // Cập nhật hoặc tạo mới Bio-Link
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
      status: 'draft'
    };

    const { avatar_url, profiles, ...restBioData } = bioData as any;

    if (isSupabaseConfigured && supabase) {
      // 1. Cập nhật avatar_url vào bảng profiles trước
      if (avatar_url !== undefined) {
        await supabase
          .from('profiles')
          .update({ avatar_url })
          .eq('id', userId);
      }

      // 2. Lấy thông tin bio_link hiện tại
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
    } else {
      // Mock mode
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
    }
  },

  // Kiểm tra xem slug đã bị ai dùng chưa
  checkSlugAvailable: async (slug: string, currentBioId?: string): Promise<boolean> => {
    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) return false;

    if (isSupabaseConfigured && supabase) {
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
    } else {
      const bioLinks = mockDb.get('bio_links');
      const conflict = bioLinks.find((b: any) => b.slug === cleanSlug && b.id !== currentBioId);
      return !conflict;
    }
  }
};
