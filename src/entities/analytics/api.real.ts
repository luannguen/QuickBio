import { supabase } from "@/shared/api/supabase";
import type { AnalyticsEvent } from "./api.types";

export const analyticsService = {
  async logEvent(event: AnalyticsEvent) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([event]);
        
      if (error) {
        console.warn('Analytics logging failed (table might not exist):', error);
      }
    } catch (err) {
      console.warn('Analytics logging failed', err);
    }
  },

  async getDashboardStats(userId: string) {
    if (!supabase) return { views: 0, clicks: 0 };
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_type')
        .eq('user_id', userId);
      
      if (!error && data) {
        const views = data.filter(d => d.event_type === 'VIEW').length;
        const clicks = data.filter(d => d.event_type === 'CLICK').length;
        return { views, clicks };
      }
    } catch (err) {
      console.warn('getDashboardStats failed', err);
    }
    return { views: 0, clicks: 0 };
  },

  async getChartData(_userId: string) {
    // Để biểu đồ chart thực sự hoạt động trong Supabase:
    // Cần gọi API RPC nhóm theo ngày. Tạm thời trả về Mock data vì chưa có RPC
    const data: Array<{ name: string; views: number; clicks: number }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      data.push({
        name: `${d.getDate()}/${d.getMonth() + 1}`,
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 10) + 2,
      });
    }
    return data;
  }
};
