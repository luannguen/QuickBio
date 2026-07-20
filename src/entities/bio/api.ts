import { isSupabaseConfigured } from "@/shared/api/supabase";
import { bioService as realService } from "./api.real";
import { bioService as mockService } from "./api.mock";

export * from './api.types';

export const bioService = isSupabaseConfigured ? realService : mockService;
