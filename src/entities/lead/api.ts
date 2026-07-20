import { isSupabaseConfigured } from '@/shared/api/supabase';
import { leadService as realService } from './api.real';
import { leadService as mockService } from './api.mock';

export * from './api.types';

export const leadService = isSupabaseConfigured ? realService : mockService;
