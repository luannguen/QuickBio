import React, { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { DesktopLayout } from '../../components/layout/DesktopLayout';
import { 
  DollarSign, 
  Check, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  Users,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardDesktopProps {
  onNavigateToHome: () => void;
}

export const AdminDashboardDesktop: React.FC<AdminDashboardDesktopProps> = ({ onNavigateToHome }) => {
  const { user, signOut } = useAuth();
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

  const sidebarContent = (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-bold text-white/40 uppercase tracking-wider">
        Menu Quản trị
      </div>
      <button
        className="w-full px-4 py-3 rounded-xl text-left text-xs font-bold flex items-center gap-2 border bg-gradient-to-r from-brand-orange/15 to-brand-coral/5 border-brand-orange/30 text-brand-orange"
      >
        <DollarSign className="w-4 h-4" />
        <span>Duyệt Yêu Cầu Rút Tiền</span>
        {totalRequestsCount > 0 && (
          <span className="ml-auto bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full font-black">
            {totalRequestsCount}
          </span>
        )}
      </button>
      
      <button
        onClick={onNavigateToHome}
        className="w-full px-4 py-3 rounded-xl text-left text-xs font-bold flex items-center gap-2 text-white/50 hover:bg-white/5 hover:text-white transition-all mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </button>
    </div>
  );

  const headerContent = (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">QuickBio Admin Console</h1>
          <p className="text-xs text-white/50">Hệ thống quản lý đối soát và vận hành nền tảng</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 mr-4">
            <img 
              src={user.avatar_url} 
              alt={user.full_name} 
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{user.full_name}</div>
              <div className="text-[9px] text-[#FF6B35]">Super Admin</div>
            </div>
          </div>
        )}
        <button 
          onClick={signOut}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl transition-all active:scale-95 touch-target"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <DesktopLayout sidebarContent={sidebarContent} headerContent={headerContent}>
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Yêu Cầu Rút Tiền Hoa Hồng</h2>
          <p className="text-xs text-white/50 mt-1">Duyệt các yêu cầu rút số dư hoa hồng từ các Cộng Tác Viên (CTV).</p>
        </div>

        <div className="flex gap-4">
          <div className="glass-card px-5 py-4 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/15 flex items-center justify-center text-brand-orange">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Tổng cần chi trả</div>
              <div className="text-lg font-extrabold text-white">
                {totalPayoutRequested.toLocaleString('vi-VN')}đ
              </div>
            </div>
          </div>
          
          <div className="glass-card px-5 py-4 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Số yêu cầu</div>
              <div className="text-lg font-extrabold text-white">
                {totalRequestsCount} yêu cầu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
            <p className="text-sm text-white/50">Đang tải danh sách rút tiền...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/15 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-sm text-red-400 font-semibold">{error}</p>
            <button 
              onClick={loadAdminData}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl"
            >
              Thử lại
            </button>
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 bg-green-500/15 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold">Không có yêu cầu nào cần duyệt</h3>
            <p className="text-xs text-white/40 max-w-xs mx-auto">Tất cả các yêu cầu rút tiền từ CTV đã được giải quyết hoặc chưa có yêu cầu mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] text-white/50 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Cộng tác viên</th>
                  <th className="py-4 px-6">Số tiền rút</th>
                  <th className="py-4 px-6">Thông tin nhận tiền</th>
                  <th className="py-4 px-6">Thời gian yêu cầu</th>
                  <th className="py-4 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-bold text-white">{comm.profiles?.full_name || 'N/A'}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{comm.profiles?.email || 'N/A'}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm font-black text-[#FF6B35] font-mono">
                        {Number(comm.amount).toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="py-5 px-6 max-w-xs">
                      <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/5 text-[11px] font-mono select-all">
                        {comm.profiles?.payment_info || comm.payment_info || 'Chưa cung cấp'}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-white/60">
                      {new Date(comm.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={() => handleApprove(comm.affiliate_id, comm.profiles?.full_name || 'CTV', Number(comm.amount))}
                        className="px-4 py-2 bg-brand-orange hover:bg-brand-coral text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 ml-auto touch-target"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Duyệt chuyển tiền
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DesktopLayout>
  );
};
