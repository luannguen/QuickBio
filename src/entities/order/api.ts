import { isSupabaseConfigured } from "@/shared/api/supabase";
import { orderService as realService } from "./api.real";
import { orderService as mockService } from "./api.mock";

export * from './api.types';

export const orderService = isSupabaseConfigured ? realService : mockService;
