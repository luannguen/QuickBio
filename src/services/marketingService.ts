import { supabase, isSupabaseConfigured } from './supabase';

export interface MarketingSettings {
  fb_page_id: string;
  fb_page_token: string;
  is_active: boolean;
  style: string;
  target_product_id: string;
  gemini_api_key?: string;
  last_posted_at?: string;
}

const LOCAL_STORAGE_KEY = 'quickbio_marketing_settings';

const getLocalSettings = (): MarketingSettings => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local marketing settings:', e);
  }
  return {
    fb_page_id: '',
    fb_page_token: '',
    is_active: false,
    style: 'Thuyết phục',
    target_product_id: ''
  };
};

const saveLocalSettings = (settings: MarketingSettings): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
};

export const marketingService = {
  // Lấy cấu hình marketing
  getSettings: async (userId: string): Promise<MarketingSettings | null> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('marketing_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error || !data) {
          // Nếu bảng chưa được tạo hoặc chưa có dữ liệu trên Supabase, fallback về LocalStorage
          return getLocalSettings();
        }
        return data as MarketingSettings;
      } catch (err) {
        console.error('Error fetching marketing settings:', err);
        return getLocalSettings();
      }
    }
    return getLocalSettings();
  },

  // Lưu cấu hình marketing
  saveSettings: async (userId: string, settings: MarketingSettings): Promise<boolean> => {
    // Luôn lưu local trước
    saveLocalSettings(settings);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('marketing_settings')
          .upsert({
            user_id: userId,
            ...settings,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving marketing settings to Supabase:', error);
          // Vẫn trả về true vì đã lưu local thành công
          return true;
        }
        return true;
      } catch (err) {
        console.error('Error saving marketing settings:', err);
        return true;
      }
    }
    return true;
  },

  getLocalSettings,
  saveLocalSettings
};
