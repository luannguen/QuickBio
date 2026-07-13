import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/useIsMobile';
import { AdminDashboardDesktop } from './AdminDashboardDesktop';
import { AdminDashboardMobile } from './AdminDashboardMobile';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome }) => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile(1024); // Use 1024px to cover tablets and mobile

  // List of emails allowed to log in as admin
  const ADMIN_EMAILS = [
    'luan.nguyenthien@gmail.com', 
    'luannguyenthien@gmail.com', 
    'luannguyen@quickbio.vn'
  ];

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35] mx-auto" />
          <p className="text-sm text-white/50">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Access Denied View
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11] p-4 text-center">
        <div className="max-w-md glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
          <div className="w-16 h-16 bg-red-500/15 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Từ chối truy cập</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Bạn không có quyền quản trị viên để truy cập khu vực này. Email của bạn ({user?.email || 'Chưa đăng nhập'}) chưa được phân quyền admin.
            </p>
          </div>
          
          <button 
            onClick={onNavigateToHome}
            className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>
      </div>
    );
  }

  // Authorised - Render responsive views
  if (isMobile) {
    return <AdminDashboardMobile onNavigateToHome={onNavigateToHome} />;
  }

  return <AdminDashboardDesktop onNavigateToHome={onNavigateToHome} />;
};
