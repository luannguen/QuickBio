import React, { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  DollarSign, 
  Check, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  Users,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigateToHome: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateToHome }) => {
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
      <div className="px-3 py-2 text-xs font-bold text-semantic-muted uppercase tracking-wider">
        Menu Quản trị
      </div>
      <button
        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-2 border bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
      >
        <DollarSign className="w-4 h-4" />
        <span>Duyệt Yêu Cầu Rút Tiền</span>
        {totalRequestsCount > 0 && (
          <span className="ml-auto bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {totalRequestsCount}
          </span>
        )}
      </button>
      
      <button
        onClick={onNavigateToHome}
        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-2 text-semantic-muted hover:bg-muted/50 hover:text-foreground transition-all mt-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </button>
    </div>
  );

  const headerContent = (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight hidden lg:block">QuickBio Admin Console</h1>
          <h1 className="text-sm font-bold tracking-tight lg:hidden">Admin Console</h1>
          <p className="text-xs text-semantic-muted hidden lg:block">Hệ thống quản lý đối soát và vận hành nền tảng</p>
          <p className="text-[10px] text-brand-orange lg:hidden">Super Admin Control</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 mr-2 lg:mr-4">
            <img 
              src={user.avatar_url} 
              alt={user.full_name} 
              className="w-8 h-8 rounded-full border border-border"
            />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{user.full_name}</div>
              <div className="text-[10px] text-brand-orange">Super Admin</div>
            </div>
          </div>
        )}
        <Button 
          onClick={signOut}
          variant="secondary"
          className="text-xs px-3 py-1.5 lg:px-4 lg:py-2"
        >
          Đăng xuất
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );

  const bottomNavContent = (
    <>
      <button
        onClick={loadAdminData}
        className="flex flex-col items-center justify-center flex-1 min-h-[44px] text-brand-orange"
      >
        <DollarSign className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Duyệt rút tiền</span>
      </button>
      <button
        onClick={onNavigateToHome}
        className="flex flex-col items-center justify-center flex-1 min-h-[44px] text-semantic-muted hover:text-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Trang chủ</span>
      </button>
    </>
  );

  return (
    <Layout 
      headerContent={headerContent} 
      sidebarContent={sidebarContent}
      bottomNavContent={bottomNavContent}
    >
      {/* Title & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">Yêu Cầu Rút Tiền Hoa Hồng</h2>
          <p className="text-xs text-semantic-muted mt-1">Duyệt các yêu cầu rút số dư hoa hồng từ các Cộng Tác Viên (CTV).</p>
        </div>

        <div className="flex gap-3 lg:gap-4 w-full lg:w-auto">
          <Card className="flex-1 lg:flex-none p-4 lg:px-5 flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <div className="text-[10px] text-semantic-muted uppercase font-bold tracking-wider">Tổng cần chi trả</div>
              <div className="text-base lg:text-lg font-extrabold text-foreground">
                {totalPayoutRequested.toLocaleString('vi-VN')}đ
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 lg:flex-none p-4 lg:px-5 flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-semantic-info/10 flex items-center justify-center text-semantic-info">
              <Users className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <div className="text-[10px] text-semantic-muted uppercase font-bold tracking-wider">Số yêu cầu</div>
              <div className="text-base lg:text-lg font-extrabold text-foreground">
                {totalRequestsCount} yêu cầu
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main List */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
            <p className="text-sm text-semantic-muted">Đang tải danh sách rút tiền...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-semantic-error/10 border border-semantic-error/20 rounded-full flex items-center justify-center text-semantic-error mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-sm text-semantic-error font-semibold">{error}</p>
            <Button 
              onClick={loadAdminData}
              variant="secondary"
            >
              Thử lại
            </Button>
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 bg-semantic-success/10 border border-semantic-success/20 rounded-full flex items-center justify-center text-semantic-success mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Không có yêu cầu nào cần duyệt</h3>
            <p className="text-xs text-semantic-muted max-w-xs mx-auto">Tất cả các yêu cầu rút tiền từ CTV đã được giải quyết hoặc chưa có yêu cầu mới.</p>
          </div>
        ) : (
          <div className="lg:overflow-x-auto hidden lg:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50.02] text-xs text-semantic-muted uppercase font-medium tracking-wider">
                  <th className="py-4 px-6">Cộng tác viên</th>
                  <th className="py-4 px-6">Số tiền rút</th>
                  <th className="py-4 px-6">Thông tin nhận tiền</th>
                  <th className="py-4 px-6">Thời gian yêu cầu</th>
                  <th className="py-4 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-muted/50.02] transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-bold text-foreground">{comm.profiles?.full_name || 'N/A'}</div>
                      <div className="text-xs text-semantic-muted mt-0.5">{comm.profiles?.email || 'N/A'}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm font-bold text-brand-orange">
                        {Number(comm.amount).toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="py-5 px-6 max-w-xs">
                      <div className="bg-black/20 px-3 py-2 rounded-lg border border-border text-xs font-mono select-all text-muted-foreground">
                        {comm.profiles?.payment_info || comm.payment_info || 'Chưa cung cấp'}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-semantic-muted text-xs">
                      {new Date(comm.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <Button
                        onClick={() => handleApprove(comm.affiliate_id, comm.profiles?.full_name || 'CTV', Number(comm.amount))}
                        className="ml-auto"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Duyệt chuyển
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Mobile View for Commissions */}
        {commissions.length > 0 && (
          <div className="lg:hidden divide-y divide-white/5">
            {commissions.map((comm) => (
              <div key={comm.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{comm.profiles?.full_name || 'N/A'}</h4>
                    <p className="text-xs text-semantic-muted">{comm.profiles?.email || 'N/A'}</p>
                  </div>
                  <div className="text-sm font-bold text-brand-orange">
                    {Number(comm.amount).toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-border space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-semantic-muted">Thông tin nhận tiền:</div>
                  <div className="text-xs font-mono break-all text-muted-foreground select-all leading-normal">
                    {comm.profiles?.payment_info || comm.payment_info || 'Chưa cung cấp'}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-semantic-muted">
                    {new Date(comm.created_at).toLocaleDateString('vi-VN')}
                  </span>
                  
                  <Button
                    onClick={() => handleApprove(comm.affiliate_id, comm.profiles?.full_name || 'CTV', Number(comm.amount))}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Duyệt chuyển
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
};
