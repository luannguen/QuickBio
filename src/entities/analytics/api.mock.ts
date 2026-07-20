import type { AnalyticsEvent } from "./api.types";

const localBuffer: AnalyticsEvent[] = [];

export const analyticsService = {
  async logEvent(event: AnalyticsEvent) {
    localBuffer.push({...event, created_at: new Date().toISOString()});
    console.log('[Analytics Logged Locally]', event);
  },

  async getDashboardStats(userId: string) {
    const userEvents = localBuffer.filter(e => e.user_id === userId);
    const views = userEvents.filter(e => e.event_type === 'VIEW').length;
    const clicks = userEvents.filter(e => e.event_type === 'CLICK').length;

    return {
      views: 1250 + views,
      clicks: 340 + clicks,
    };
  },

  async getChartData(_userId: string) {
    const data: Array<{ name: string; views: number; clicks: number }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      data.push({
        name: `${d.getDate()}/${d.getMonth() + 1}`,
        views: Math.floor(Math.random() * 500) + 100,
        clicks: Math.floor(Math.random() * 100) + 20,
      });
    }
    return data;
  }
};
