import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/entities/analytics/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Eye, MousePointerClick, TrendingUp } from 'lucide-react';

interface AnalyticsTabProps {
  userId: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ userId }) => {
  const [stats, setStats] = useState({ views: 0, clicks: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [s, data] = await Promise.all([
        analyticsService.getDashboardStats(userId),
        analyticsService.getChartData(userId)
      ]);
      setStats(s);
      setChartData(data);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Đang tải dữ liệu...
      </div>
    );
  }

  const ctr = stats.views > 0 ? ((stats.clicks / stats.views) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-orange" />
            Thống kê Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi lượt xem và tương tác trên trang Bio của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground font-semibold text-sm">
            <Eye className="w-4 h-4 mr-2 text-blue-500" /> Tổng lượt xem
          </div>
          <div className="text-3xl font-extrabold">{stats.views.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl border bg-card flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground font-semibold text-sm">
            <MousePointerClick className="w-4 h-4 mr-2 text-green-500" /> Tổng lượt click
          </div>
          <div className="text-3xl font-extrabold">{stats.clicks.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-xl border bg-card flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground font-semibold text-sm">
            <TrendingUp className="w-4 h-4 mr-2 text-brand-orange" /> Tỉ lệ chuyển đổi (CTR)
          </div>
          <div className="text-3xl font-extrabold text-brand-orange">{ctr}%</div>
        </div>
      </div>

      <div className="p-4 md:p-6 rounded-xl border bg-card">
        <h3 className="font-bold mb-6">Xu hướng 7 ngày qua</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="views" name="Lượt xem" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="clicks" name="Lượt click" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
