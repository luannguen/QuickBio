import React, { useState, useMemo } from 'react';
import type { Order } from "@/entities/order/api";
import { ShoppingBag, RefreshCw, Search, Filter } from 'lucide-react';
import { Card } from "@/shared/ui/Card";

interface OrdersTabProps {
  orders: Order[];
  pendingOrders: Order[];
  simulatingOrderId: string;
  onSimulatingOrderIdChange: (id: string) => void;
  onSimulateWebhook: () => void;
  isSimulating: boolean;
  simulatorStatus: string;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  pendingOrders,
  simulatingOrderId,
  onSimulatingOrderIdChange,
  onSimulateWebhook,
  isSimulating,
  simulatorStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        o.customer_email?.toLowerCase().includes(term) ||
        o.payment_code?.toLowerCase().includes(term) ||
        o.customer_name?.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPaidOrders = orders.filter(o => o.status === 'paid').length;
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-orange" />
          Đơn hàng mua bán
        </h3>
        
        {/* Mini stats */}
        <div className="flex gap-4 text-xs">
          <div className="bg-brand-card/50 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-white/50">Thành công:</span> <strong className="text-semantic-success ml-1">{totalPaidOrders}</strong>
          </div>
          <div className="bg-brand-card/50 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-white/50">Doanh thu:</span> <strong className="text-brand-orange ml-1">{totalRevenue.toLocaleString('vi-VN')}đ</strong>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Chưa có đơn hàng nào</h4>
            <p className="text-xs text-white/40">Khi có người click mua sản phẩm và quét mã QR chuyển khoản, đơn hàng sẽ hiển thị tại đây.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Tìm email, mã đơn, tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#080B11] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 outline-none focus:border-brand-orange/50 transition-colors"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-9 pr-4 py-2 bg-[#080B11] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-brand-orange/50 appearance-none transition-colors"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Đang chờ</option>
              </select>
            </div>
          </div>

          {/* Order list table */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-white/60 font-semibold uppercase tracking-wider">
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4">Mã CK</th>
                    <th className="p-4 text-right">Số tiền</th>
                    <th className="p-4">Thời gian</th>
                    <th className="p-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/40">
                        Không tìm thấy đơn hàng phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{o.customer_name}</div>
                          <div className="text-[10px] text-white/40 mt-0.5">{o.customer_email}</div>
                        </td>
                        <td className="p-4 truncate max-w-[150px] font-medium text-white">{o.product?.name || 'Sản phẩm đã bị xóa'}</td>
                        <td className="p-4">
                          <span className="font-mono text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded font-bold">
                            {o.payment_code}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white text-right">{o.amount.toLocaleString('vi-VN')}đ</td>
                        <td className="p-4 text-white/50 text-[10px]">
                          {new Date(o.created_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            o.status === 'paid' 
                              ? 'bg-semantic-success/10 text-semantic-success border border-semantic-success/20' 
                              : 'bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20'
                          }`}>
                            {o.status === 'paid' ? 'Đã thanh toán' : 'Đang chờ'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Webhook simulator in tab */}
          {pendingOrders.length > 0 && (
            <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/10 space-y-3 max-w-md mt-6">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
                Mô phỏng ngân hàng báo có
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed">
                Có {pendingOrders.length} đơn hàng đang chờ thanh toán. Bạn có muốn kích hoạt webhook giả lập biến động số dư MBBank báo có?
              </p>
              <div className="space-y-2">
                <select
                  value={simulatingOrderId}
                  onChange={(e) => onSimulatingOrderIdChange(e.target.value)}
                  className="w-full px-2 py-2 text-[10px] rounded-lg bg-[#080B11] border border-white/10 text-white outline-none"
                >
                  <option value="">-- Chọn đơn hàng test --</option>
                  {pendingOrders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.payment_code} - {(o.product?.name || '').slice(0, 15)}...
                    </option>
                  ))}
                </select>
                <button
                  onClick={onSimulateWebhook}
                  disabled={isSimulating || !simulatingOrderId}
                  className="w-full py-2 bg-brand-orange hover:bg-brand-coral disabled:bg-white/5 text-white disabled:text-white/30 text-[10px] font-bold rounded-lg transition-all touch-target min-h-[36px]"
                >
                  {isSimulating ? 'Đang gửi...' : 'Nhấn giả lập MBBank báo có'}
                </button>
              </div>
              {simulatorStatus && (
                <p className="text-[9px] text-green-400 font-medium leading-normal animate-pulse bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                  {simulatorStatus}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
