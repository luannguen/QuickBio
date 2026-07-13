import React, { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { 
  DollarSign, 
  Check, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardMobileProps {
  onNavigateToHome: () => void;
}

export const AdminDashboardMobile: React.FC<AdminDashboardMobileProps> = ({ onNavigateToHome }) => {
  const { signOut } = useAuth();
  const { commissions, loading, error, loadAdminData, approveWithdrawal } = useAdmin();

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleApprove = async (userId: string, userName: string, amount: number) => {
    const confirmed = window.confirm(
      `Xác nhận bạn đã chuyển khoản số tiền ${amount.toLocaleString('vi-VN')}đ cho CTV ${userName}?\n` +
      `Hệ thống sẽ cập nhật trạng thái các giao dịch hoa hồng thành ĐÃ THANH TOÁN.`
    );
    if (!confirmed) return;

    const success = await approveWithdrawal(userId);
    if (success) {
      alert('Đã duyệt và thanh toán hoa hồng thành công!');
    } else {
      alert('Phê duyệt thất bại. Vui lòng kiểm tra lại!');
    }
  };

  // Stats calculation
  const totalPayoutRequested = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalRequestsCount = commissions.length;

  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">Admin Console</h1>
          <p className="text-[9px] text-[#FF6B35]">Super Admin Control</p>
        </div>
      </div>
      
      <button 
        onClick={signOut}
        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold rounded-lg transition-all"
      >
        Thoát
      </button>
    </div>
  );

  const bottomNavContent = (
    <>
      <button
        onClick={loadAdminData}
        className="flex flex-col items-center justify-center flex-1 text-[#FF6B35]"
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[9px] font-bold mt-1">Duyệt rút tiền</span>
      </button>
      <button
        onClick={onNavigateToHome}
        className="flex flex-col items-center justify-center flex-1 text-white/40 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[9px] font-bold mt-1">Trang chủ</span>
      </button>
    </>
  );

  return (
    <MobileLayout headerContent={headerContent} bottomNavContent={bottomNavContent}>
      {/* Mobile Title */}
      <div className="space-y-1">
        <h2 className="text-lg font-extrabold tracking-tight">Duyệt Hoa Hồng CTV</h2>
        <p className="text-[11px] text-white/50">Phê duyệt chuyển tiền thanh toán hoa hồng tích lũy.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 rounded-xl border border-white/5 space-y-1.5">
          <div className="text-[9px] text-white/40 uppercase font-black tracking-wider">Tổng cần trả</div>
          <div className="text-base font-extrabold text-white">
            {totalPayoutRequested.toLocaleString('vi-VN')}đ
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl border border-white/5 space-y-1.5">
          <div className="text-[9px] text-white/40 uppercase font-black tracking-wider">Số yêu cầu</div>
          <div className="text-base font-extrabold text-white">
            {totalRequestsCount} yêu cầu
          </div>
        </div>
      </div>

      {/* Mobile Content List */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
          <p className="text-xs text-white/50">Đang tải yêu cầu...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs text-red-400 font-semibold">{error}</p>
          <button 
            onClick={loadAdminData}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs"
          >
            Thử lại
          </button>
        </div>
      ) : commissions.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Check className="w-8 h-8 text-green-400 mx-auto" />
          <h3 className="text-xs font-bold">Không có yêu cầu</h3>
          <p className="text-[10px] text-white/40">Tất cả yêu cầu rút tiền của CTV đã được duyệt.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commissions.map((comm) => (
            <div 
              key={comm.id} 
              className="glass-card p-4 rounded-xl border border-white/5 space-y-3.5 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{comm.profiles?.full_name || 'N/A'}</h4>
                  <p className="text-[10px] text-white/40">{comm.profiles?.email || 'N/A'}</p>
                </div>
                <div className="text-sm font-black text-[#FF6B35] font-mono">
                  {Number(comm.amount).toLocaleString('vi-VN')}đ
                </div>
              </div>

              {/* Bank Info Block */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                <div className="text-[8px] uppercase font-bold tracking-wider text-white/40">Thông tin nhận tiền:</div>
                <div className="text-[10px] font-mono break-all text-white/90 select-all leading-normal">
                  {comm.profiles?.payment_info || comm.payment_info || 'Chưa cung cấp'}
                </div>
              </div>

              {/* Footer row */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-[9px] text-white/30">
                  {new Date(comm.created_at).toLocaleDateString('vi-VN')}
                </span>
                
                <button
                  onClick={() => handleApprove(comm.affiliate_id, comm.profiles?.full_name || 'CTV', Number(comm.amount))}
                  className="px-4 py-2.5 bg-brand-orange hover:bg-brand-coral text-white text-[10px] font-black rounded-lg transition-all active:scale-95 flex items-center gap-1.5 touch-target min-h-[44px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  Duyệt chuyển
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MobileLayout>
  );
};
