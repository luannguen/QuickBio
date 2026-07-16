import { supabase, isSupabaseConfigured } from '@/shared/api/supabase';

export interface Article {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  moderation_status: 'approved' | 'warned' | 'suspended';
  warning_message: string | null;
  created_at: string;
  updated_at: string;
}

export const articleService = {
  // === TENANT METHODS ===
  async getArticlesByUserId(userId: string): Promise<Article[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    return data || [];
  },

  async getArticleById(id: string): Promise<Article | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching article:', error);
      throw error;
    }
    return data;
  },

  async createArticle(userId: string, payload: Partial<Article>): Promise<Article | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    
    // Generate a simple slug if not provided or empty
    const generateSlug = (title: string) => {
      const baseSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
    };

    const slug = payload.slug || generateSlug(payload.title || 'untitled');

    const { data, error } = await supabase
      .from('articles')
      .insert({
        user_id: userId,
        title: payload.title,
        slug: slug,
        excerpt: payload.excerpt || '',
        content: payload.content || '',
        cover_image_url: payload.cover_image_url || null,
        status: payload.status || 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      throw error;
    }
    return data;
  },

  async updateArticle(id: string, payload: Partial<Article>): Promise<Article | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        cover_image_url: payload.cover_image_url,
        status: payload.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      throw error;
    }
    return data;
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
    return true;
  },

  // === PUBLIC METHODS ===
  async getPublicArticles(userId?: string | null): Promise<(Article & { profiles?: { full_name: string } })[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    
    let query = supabase
      .from('articles')
      .select('*, profiles(full_name)')
      .eq('status', 'published')
      .neq('moderation_status', 'suspended')
      .order('created_at', { ascending: false });
      
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching public articles:', error);
      return [];
    }
    return data || [];
  },

  async getPublicArticleBySlug(slug: string): Promise<(Article & { profiles?: { full_name: string } }) | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .neq('moderation_status', 'suspended')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching public article:', error);
      return null;
    }
    return data;
  },

  // === ADMIN METHODS ===
  async adminGetAllArticles(): Promise<(Article & { profiles?: { full_name: string, email: string } })[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all articles for admin:', error);
      return [];
    }
    return data || [];
  },

  async adminModerateArticle(id: string, action: 'approved' | 'warned' | 'suspended', warningMessage?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    
    const { error } = await supabase
      .from('articles')
      .update({
        moderation_status: action,
        warning_message: warningMessage || null
      })
      .eq('id', id);

    if (error) {
      console.error('Error moderating article:', error);
      throw error;
    }
    return true;
  }
};
