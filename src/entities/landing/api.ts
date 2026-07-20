import { isSupabaseConfigured } from "@/shared/api/supabase";
import { landingService as realService } from "./api.real";
import { landingService as mockService } from "./api.mock";

export * from './api.types';

export const landingService = isSupabaseConfigured ? realService : mockService;
