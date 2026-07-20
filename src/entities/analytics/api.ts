import { isSupabaseConfigured } from "@/shared/api/supabase";
import { analyticsService as realService } from "./api.real";
import { analyticsService as mockService } from "./api.mock";

export * from './api.types';

export const analyticsService = isSupabaseConfigured ? realService : mockService;
