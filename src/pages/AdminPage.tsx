import React from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { AdminDashboardView } from "@/features/admin/AdminDashboardView";
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from "@/shared/ui/Button";

interface AdminDashboardProps {
  onNavigateToHome: () => void;
  onNavigateToDashboard: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const { user, loading } = useAuth();

  // List of emails allowed to log in as admin (Fallback)
  const ADMIN_EMAILS = [
    'luan.nguyenthien@gmail.com', 
    'luannguyenthien@gmail.com', 
    'luannguyen@quickbio.vn'
  ];

  const isAdmin = user && (user.role === 'admin' || ADMIN_EMAILS.includes(user.email || ''));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35] mx-auto" />
          <p className="text-sm text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Access Denied View
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md glass-panel p-8 rounded-2xl border border-border space-y-6">
          <div className="w-16 h-16 bg-red-500/15 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Từ chối truy cập</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bạn không có quyền quản trị viên để truy cập khu vực này. Email của bạn ({user?.email || 'Chưa đăng nhập'}) chưa được phân quyền admin.
            </p>
          </div>
          
          <Button 
            onClick={onNavigateToHome}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return <AdminDashboardView onNavigateToHome={onNavigateToHome} onNavigateToDashboard={onNavigateToDashboard} />;
};
