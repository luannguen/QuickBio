export interface Article {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  moderation_status: 'approved' | 'warned' | 'suspended';
  warning_message: string | null;
  created_at: string;
  updated_at: string;
}
