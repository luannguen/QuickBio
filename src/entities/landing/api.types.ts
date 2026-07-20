export interface LandingPage {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  logo_url?: string;
  description: string;
  template_id: string;
  config: any;
  product_id?: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}
