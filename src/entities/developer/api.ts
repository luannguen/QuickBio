import { mockDeveloperService } from './api.mock';
import { realDeveloperService } from './api.real';
import type { DeveloperService } from './api.types';

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && url !== 'your_supabase_url_here' && 
         key && key !== 'your_supabase_anon_key_here';
};

// Export the appropriate service instance
export const developerService: DeveloperService = isSupabaseConfigured() 
  ? realDeveloperService 
  : mockDeveloperService;

export * from './api.types';
