export interface AnalyticsEvent {
  id?: string;
  user_id: string; // ID của chủ Bio (người được xem)
  event_type: 'VIEW' | 'CLICK' | 'LEAD';
  block_id?: string; // ID của khối (nếu là click)
  metadata?: any;
  created_at?: string;
}
