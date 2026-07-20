export type BioBlockType = 'LINK' | 'PRODUCT' | 'TEXT' | 'YOUTUBE' | 'COUNTDOWN' | 'LEAD_FORM';

export interface BioBlock {
  id: string;
  type: BioBlockType;
  title?: string;
  url?: string;
  product_id?: string;
  content?: string;
  is_visible: boolean;
  expires_at?: string; 
  discount_text?: string;
  button_text?: string;
  webhook_url?: string;
}

export interface BioLink {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio_text: string;
  avatar_url: string; 
  subscription_tier?: string; 
  theme: {
    background: string;
    textColor: string;
    glassmorphism: boolean;
    accentColor: string;
  };
  social_links: {
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  hide_watermark?: boolean;
  theme_id?: string;
  blocks?: BioBlock[]; 
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}
