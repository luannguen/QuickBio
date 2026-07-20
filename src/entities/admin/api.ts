import { isSupabaseConfigured } from "@/shared/api/supabase";
import { adminService as realService } from "./api.real";
import { adminService as mockService } from "./api.mock";

export * from './api.types';

export const adminService = isSupabaseConfigured ? realService : mockService;
