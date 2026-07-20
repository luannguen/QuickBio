import { isSupabaseConfigured } from "@/shared/api/supabase";
import { productService as realService } from "./api.real";
import { productService as mockService } from "./api.mock";

export * from './api.types';

export const productService = isSupabaseConfigured ? realService : mockService;
