import type { MarketingSettings } from "./api.types";

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
  getSettings: async (_userId: string): Promise<MarketingSettings | null> => {
    return getLocalSettings();
  },

  saveSettings: async (_userId: string, settings: MarketingSettings): Promise<boolean> => {
    saveLocalSettings(settings);
    return true;
  },

  getLocalSettings,
  saveLocalSettings
};
