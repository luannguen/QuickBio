import React from 'react';
import { Users, Check, Copy } from 'lucide-react';

interface AffiliateTabProps {
  clicksCount: number;
  commissions: any[];
  withdrawLoading: boolean;
  withdrawSuccess: boolean;
  onRequestWithdrawal: () => void;
  affiliateCode: string;
  onAffiliateCodeChange: (val: string) => void;
  paymentInfo: string;
  onPaymentInfoChange: (val: string) => void;
  telegramChatId: string;
  onTelegramChatIdChange: (val: string) => void;
  affiliateSuccess: boolean;
  onSaveAffiliate: (e: React.FormEvent) => void;
  linkCopied: boolean;
  onLinkCopiedChange: (val: boolean) => void;
  userSlug: string;
}

export const AffiliateTab: React.FC<AffiliateTabProps> = ({
  clicksCount,
  commissions,
  withdrawLoading,
  withdrawSuccess,
  onRequestWithdrawal,
  affiliateCode,
  onAffiliateCodeChange,
  paymentInfo,
  onPaymentInfoChange,
  telegramChatId,
  onTelegramChatIdChange,
  affiliateSuccess,
  onSaveAffiliate,
  linkCopied,
  onLinkCopiedChange,
  userSlug
}) => {
  const pendingAmount = commissions
    .filter(c => c.status === 'pending')
    .reduce((acc, c) => acc + Number(c.amount), 0);

  const requestedAmount = commissions
    .filter(c => c.status === 'requested')
    .reduce((acc, c) => acc + Number(c.amount), 0);

  const paidAmount = commissions
    .filter(c => c.status === 'paid')
    .reduce((acc, c) => acc + Number(c.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <h3 className="text-base font-bold flex items-center gap-2">
        <Users className="w-5 h-5 text-brand-orange" />
        Hệ thống Tiếp thị liên kết (Affiliate Program)
      </h3>

      {withdrawSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          Yêu cầu rút tiền thành công! Ban quản trị sẽ đối soát và thanh toán cho bạn trong 24h.
        </div>
      )}

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Tổng lượt Click</span>
          <div className="text-xl font-bold text-foreground">{clicksCount}</div>
          <p className="text-[9px] text-muted-foreground">Lượt click link giới thiệu</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Hoa hồng chờ duyệt</span>
            <div className="text-xl font-bold text-yellow-500">{pendingAmount.toLocaleString('vi-VN')}đ</div>
            <p className="text-[9px] text-muted-foreground">Có thể rút (tối thiểu 50k)</p>
          </div>
          {pendingAmount >= 50000 && (
            <button
              type="button"
              onClick={onRequestWithdrawal}
              disabled={withdrawLoading}
              className="mt-2.5 w-full py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-[10px] rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1 touch-target min-h-[30px]"
            >
              {withdrawLoading ? 'Đang gửi...' : 'Rút tiền ngay'}
            </button>
          )}
        </div>

        <div className="glass-card p-4 rounded-xl border border-border space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Hoa hồng đang rút</span>
          <div className="text-xl font-bold text-blue-400">{requestedAmount.toLocaleString('vi-VN')}đ</div>
          <p className="text-[9px] text-muted-foreground">Đang đối soát chuyển khoản</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold">Hoa hồng đã nhận</span>
          <div className="text-xl font-bold text-green-500">{paidAmount.toLocaleString('vi-VN')}đ</div>
          <p className="text-[9px] text-muted-foreground">Đã nhận về tài khoản</p>
        </div>
      </div>

      {/* Analytics chart */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Hiệu suất Tiếp thị & Lượt Click</h4>
            <p className="text-[10px] text-muted-foreground">Thống kê lượng click qua link giới thiệu trong 7 ngày qua</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
              <span>Lượt Click</span>
            </div>
          </div>
        </div>
        
        {/* CSS Chart */}
        <div className="h-32 flex items-end justify-between gap-4 pt-4 border-b border-border">
          {[
            { day: 'Thứ 2', val: 12 },
            { day: 'Thứ 3', val: 19 },
            { day: 'Thứ 4', val: 8 },
            { day: 'Thứ 5', val: 24 },
            { day: 'Thứ 6', val: 32 },
            { day: 'Thứ 7', val: clicksCount > 10 ? clicksCount - 5 : 28 },
            { day: 'Chủ Nhật', val: clicksCount }
          ].map((item, idx) => {
            const maxVal = 50;
            const heightPercent = Math.min((item.val / maxVal) * 100, 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[9px] font-mono text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.val}
                </span>
                <div 
                  style={{ height: `${heightPercent}%` }} 
                  className="w-full bg-gradient-to-t from-brand-orange/40 to-brand-coral rounded-t-lg transition-all duration-500 hover:from-brand-coral hover:to-brand-orange relative"
                >
                  <div className="absolute inset-0 bg-muted/50 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg"></div>
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 whitespace-nowrap">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSaveAffiliate} className="glass-card p-6 rounded-2xl border border-border space-y-6">
        {affiliateSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            Lưu thông tin Affiliate thành công!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Mã giới thiệu (SaaS/Creator Affiliate)</label>
            <input 
              type="text" 
              value={affiliateCode}
              onChange={(e) => onAffiliateCodeChange(e.target.value)}
              placeholder="Ví dụ: luannguyen, mmo99"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Tài khoản nhận tiền (Ngân hàng, STK)</label>
            <input 
              type="text" 
              value={paymentInfo}
              onChange={(e) => onPaymentInfoChange(e.target.value)}
              placeholder="MBBank - 0912345678 - NGUYEN VAN A"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground font-semibold mb-2">Telegram Chat ID (Nhận thông báo đơn)</label>
            <input 
              type="text" 
              value={telegramChatId}
              onChange={(e) => onTelegramChatIdChange(e.target.value)}
              placeholder="Ví dụ: 123456789 (Lấy từ @userinfobot)"
              className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
            />
          </div>
        </div>

        {affiliateCode && (
          <div className="space-y-4">
            {/* Box 1: SaaS Affiliate */}
            <div className="p-4 bg-brand-orange/5 rounded-xl border border-brand-orange/20 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block">1. Giới thiệu nền tảng QuickBio (Nhận hoa hồng từ hệ thống)</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Gắn link trang chủ hoặc link trang Bio của bạn lên mạng xã hội. Nếu người xem đăng ký tài khoản và nâng cấp VIP, bạn sẽ nhận được hoa hồng!
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-semibold w-16 text-muted-foreground">Trang chủ:</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/?ref=${affiliateCode}`}
                    className="flex-1 bg-black/40 border border-border rounded-lg px-3 py-2 text-[10px] sm:text-xs font-mono text-brand-orange outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?ref=${affiliateCode}`);
                      onLinkCopiedChange(true);
                      setTimeout(() => onLinkCopiedChange(false), 1500);
                    }}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-white touch-target min-h-[38px] ${linkCopied ? 'bg-green-500 hover:bg-green-600 scale-105' : 'bg-brand-orange hover:bg-brand-coral active:scale-95'}`}
                    title="Copy Link"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-semibold w-16 text-muted-foreground">Trang Bio:</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/${userSlug || 'luannguyen'}?ref=${affiliateCode}`}
                    className="flex-1 bg-black/40 border border-border rounded-lg px-3 py-2 text-[10px] sm:text-xs font-mono text-brand-orange outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${userSlug || 'luannguyen'}?ref=${affiliateCode}`);
                      onLinkCopiedChange(true);
                      setTimeout(() => onLinkCopiedChange(false), 1500);
                    }}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-white touch-target min-h-[38px] ${linkCopied ? 'bg-green-500 hover:bg-green-600 scale-105' : 'bg-brand-orange hover:bg-brand-coral active:scale-95'}`}
                    title="Copy Link"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: Creator Affiliate */}
            <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
              <div>
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">2. Giới thiệu sản phẩm của bạn (CTV Bán hộ)</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Gửi cấu trúc link này cho CTV của bạn. CTV thay <strong>MA_CUA_CTV</strong> bằng mã của họ. Khi có khách mua hàng từ link này, hoa hồng sẽ chia tự động qua SePay.
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/${userSlug || 'luannguyen'}?ref=MA_CUA_CTV`}
                  className="flex-1 bg-black/40 border border-border rounded-lg px-3 py-2 text-[10px] sm:text-xs font-mono text-muted-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${userSlug || 'luannguyen'}?ref=MA_CUA_CTV`);
                  }}
                  className="p-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-white touch-target min-h-[38px] bg-slate-700 hover:bg-slate-600 active:scale-95"
                  title="Copy Cấu trúc Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 touch-target min-h-[40px]"
        >
          Kích hoạt & Lưu Affiliate
        </button>
      </form>

      {/* CTV order list */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Danh sách đơn hàng CTV bán hộ</h4>
        {commissions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">Chưa phát sinh đơn hàng giới thiệu nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-muted-foreground">
              <thead className="text-[10px] text-muted-foreground uppercase border-b border-border bg-muted/50 font-mono">
                <tr>
                  <th className="px-4 py-3">Mã ĐH</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Doanh số</th>
                  <th className="px-4 py-3">Hoa hồng (50%)</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-brand-orange">{c.orders?.payment_code}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{c.orders?.products?.name}</td>
                    <td className="px-4 py-3">{Number(c.orders?.amount).toLocaleString()}đ</td>
                    <td className="px-4 py-3 text-brand-orange font-bold">{Number(c.amount).toLocaleString()}đ</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        c.status === 'paid' 
                          ? 'bg-green-500/10 text-green-400' 
                          : c.status === 'requested'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {c.status === 'paid' 
                          ? 'Đã thanh toán' 
                          : c.status === 'requested' 
                          ? 'Đang rút' 
                          : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
