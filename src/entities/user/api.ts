import { supabase, isSupabaseConfigured, mockDb } from "@/shared/api/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  role?: string;
}

export const authService = {
  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<UserProfile | null> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return profile as UserProfile;
      } catch (err) {
        console.error('Error fetching Supabase user:', err);
        return null;
      }
    } else {
      // Mock mode
      const profiles = mockDb.get('profiles');
      const activeUserId = localStorage.getItem('quickbio_active_user_id') || 'user-demo-123';
      const profile = profiles.find((p: any) => p.id === activeUserId);
      return profile || null;
    }
  },

  // Giả lập login nhanh (cho cả demo và thật)
  signInDemoUser: () => {
    localStorage.setItem('quickbio_active_user_id', 'user-demo-123');
    window.location.reload();
  },

  // Supabase Social/Email Sign In
  signInWithGoogle: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Chuyển sang demo user
      authService.signInDemoUser();
    }
  },

  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('quickbio_active_user_id');
      window.location.reload();
    }
  }
};
