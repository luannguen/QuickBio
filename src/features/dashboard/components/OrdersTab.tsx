import React from 'react';
import type { Order } from "@/entities/order/api";
import { ShoppingBag, RefreshCw } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-brand-orange" />
        Đơn hàng mua bán
      </h3>

      {orders.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">Chưa có đơn hàng nào</h4>
            <p className="text-xs text-white/40">Khi có người click mua sản phẩm và quét mã QR chuyển khoản, đơn hàng sẽ hiển thị tại đây.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order list table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-brand-card/10">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-white/60 font-semibold">
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Mã CK</th>
                  <th className="p-4">Số tiền</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{o.customer_name}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{o.customer_email}</div>
                    </td>
                    <td className="p-4 truncate max-w-[150px] font-medium text-white">{o.product?.name || 'Sản phẩm đã bị xóa'}</td>
                    <td className="p-4"><span className="font-mono text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded font-bold">{o.payment_code}</span></td>
                    <td className="p-4 font-bold text-white">{o.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 text-white/50">{new Date(o.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.status === 'paid' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {o.status === 'paid' ? 'Đã nhận tiền' : 'Đang chờ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Webhook simulator in tab */}
          {pendingOrders.length > 0 && (
            <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/10 space-y-3 max-w-md">
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
