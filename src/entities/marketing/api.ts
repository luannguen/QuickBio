import { isSupabaseConfigured } from "@/shared/api/supabase";
import { marketingService as realService } from "./api.real";
import { marketingService as mockService } from "./api.mock";

export * from './api.types';

export const marketingService = isSupabaseConfigured ? realService : mockService;
