import { isSupabaseConfigured } from '@/shared/api/supabase';
import { articleService as realService } from './api.real';
import { articleService as mockService } from './api.mock';

export * from './api.types';

export const articleService = isSupabaseConfigured ? realService : mockService;
