import React, { useEffect, useState } from 'react';
import { useAdmin } from "@/shared/hooks/useAdmin";
import { useAuth } from "@/shared/hooks/useAuth";
import { Layout } from "@/app/layouts/Layout";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { 
  DollarSign, 
  Check, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  Users,
  ShieldCheck,
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Activity,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { articleService } from "@/entities/article/api";
import { useToastStore } from "@/shared/stores/useToastStore";
import { useConfirm } from "@/shared/stores/useModalStore";

interface AdminDashboardViewProps {
  onNavigateToHome: () => void;
  onNavigateToDashboard: () => void;
}

type TabType = 'overview' | 'users' | 'orders' | 'withdrawals' | 'articles' | 'products';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateToHome, onNavigateToDashboard }) => {
  const { user, signOut } = useAuth();
  const toast = useToastStore();
  const confirm = useConfirm();
  const { 
    commissions, 
    stats,
    users,
    orders,
    loading, 
    error, 
    loadAdminData,
    loadDashboardStats,
    loadUsers,
    loadOrders,
    loadArticles,
    loadProducts,
    approveWithdrawal,
    moderateProduct,
    products,
    articles,
    changeUserPlan
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (activeTab === 'overview') {
      loadDashboardStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'orders') {
      loadOrders(100);
    } else if (activeTab === 'withdrawals') {
      loadAdminData();
    } else if (activeTab === 'articles') {
      loadArticles();
    } else if (activeTab === 'products') {
      loadProducts();
    }
  }, [activeTab, loadDashboardStats, loadUsers, loadOrders, loadAdminData, loadArticles, loadProducts]);

  const handleApprove = async (userId: string, userName: string, amount: number) => {
    const confirmed = await confirm({
      title: 'Phê duyệt chuyển khoản',
      message: `Xác nhận bạn đã chuyển khoản số tiền ${amount.toLocaleString('vi-VN')}đ cho CTV ${userName}?\nHệ thống sẽ cập nhật trạng thái các giao dịch hoa hồng thành ĐÃ THANH TOÁN.`,
      confirmText: 'Đã thanh toán',
      variant: 'info'
    });
    if (!confirmed) return;

    const success = await approveWithdrawal(userId);
    if (success) {
      toast.success('Đã duyệt và thanh toán hoa hồng thành công!');
    } else {
      toast.error('Phê duyệt thất bại. Vui lòng kiểm tra lại!');
    }
  };

  const handlePlanChange = async (userId: string, userName: string, currentPlan: string, newPlan: string) => {
    if (currentPlan === newPlan) return;
    
    // Nếu downgrade (từ pro/premium xuống free)
    if (newPlan === 'free' && currentPlan !== 'free') {
      const confirmed = await confirm({
        title: 'Xác nhận Hạ cấp Gói',
        message: `Bạn đang hạ cấp ${userName} từ gói ${currentPlan.toUpperCase()} xuống FREE.\nĐiều này sẽ lập tức khoá các quyền lợi cao cấp của họ.\nBạn có chắc chắn muốn tiếp tục?`,
        confirmText: 'Đồng ý hạ cấp',
        variant: 'danger'
      });
      if (!confirmed) return;
    } else {
      // Xác nhận nâng cấp
      const confirmed = await confirm({
        title: 'Xác nhận Đổi Gói',
        message: `Bạn muốn chuyển ${userName} sang gói ${newPlan.toUpperCase()}?`,
        confirmText: 'Đồng ý',
        variant: 'info'
      });
      if (!confirmed) return;
    }

    const res = await changeUserPlan(userId, newPlan);
    if (res.success) {
      toast.success(`Đã cập nhật gói của ${userName} thành ${newPlan.toUpperCase()}`);
      // Nếu Admin tự đổi gói cho chính mình thì reload trang để cập nhật lại quyền trên UI
      if (userId === user?.id) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      toast.error(res.message || 'Có lỗi xảy ra khi đổi gói. Vui lòng thử lại.');
    }
  };

  const headerContent = (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight hidden lg:block">SaaS Admin Console</h1>
          <h1 className="text-sm font-bold tracking-tight lg:hidden">Admin Console</h1>
          <p className="text-xs text-semantic-muted hidden lg:block">Quản trị toàn bộ nền tảng đa khách thuê</p>
          <p className="text-[10px] text-brand-orange lg:hidden">Super Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 mr-2 lg:mr-4">
            <img 
              src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} 
              alt={user.full_name || 'Admin'} 
              className="w-8 h-8 rounded-full border border-border"
            />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{user.full_name || 'Admin'}</div>
              <div className="text-[10px] text-brand-orange uppercase">Quản trị viên</div>
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

  const sidebarContent = (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-bold text-semantic-muted uppercase tracking-wider">
        Menu Quản trị
      </div>
      <button
        onClick={() => setActiveTab('overview')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'overview' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Tổng quan</span>
      </button>

      <button
        onClick={() => setActiveTab('users')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'users' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Người dùng (Tenants)</span>
      </button>

      <button
        onClick={() => setActiveTab('orders')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'orders' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Đơn hàng hệ thống</span>
      </button>
      
      <button
        onClick={() => setActiveTab('withdrawals')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'withdrawals' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <DollarSign className="w-4 h-4" />
        <span>Duyệt Rút Tiền</span>
        {commissions.length > 0 && (
          <span className="ml-auto bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {commissions.length}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('articles')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'articles' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Kiểm duyệt Bài viết</span>
      </button>

      <button
        onClick={() => setActiveTab('products')}
        className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all ${
          activeTab === 'products' 
            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/30' 
            : 'text-semantic-muted hover:bg-muted/50 hover:text-foreground border border-transparent'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Kiểm duyệt Sản phẩm</span>
      </button>
      
      <button
        onClick={onNavigateToDashboard}
        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 text-semantic-muted hover:bg-muted/50 hover:text-foreground transition-all border border-transparent"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Về Tenant Dashboard</span>
      </button>

      <button
        onClick={onNavigateToHome}
        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 text-semantic-muted hover:bg-muted/50 hover:text-foreground transition-all mt-2 border border-transparent"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </button>
    </div>
  );

  const bottomNavContent = (
    <>
      <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'overview' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <LayoutDashboard className="w-5 h-5" />
      </button>
      <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'users' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <Users className="w-5 h-5" />
      </button>
      <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'orders' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <ShoppingCart className="w-5 h-5" />
      </button>
      <button onClick={() => setActiveTab('withdrawals')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'withdrawals' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <DollarSign className="w-5 h-5" />
      </button>
      <button onClick={() => setActiveTab('articles')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'articles' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <FileText className="w-5 h-5" />
      </button>
      <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center justify-center flex-1 min-h-[44px] ${activeTab === 'products' ? 'text-brand-orange' : 'text-semantic-muted'}`}>
        <ShoppingBag className="w-5 h-5" />
      </button>
    </>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-brand-orange" />
        <h2 className="text-xl font-extrabold">Tổng Quan Nền Tảng</h2>
      </div>
      
      {loading && !stats ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex flex-col gap-2">
            <div className="text-xs text-semantic-muted uppercase font-bold">Tổng số User</div>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-semantic-info" />
              {stats.total_users}
            </div>
          </Card>
          <Card className="p-5 flex flex-col gap-2">
            <div className="text-xs text-semantic-muted uppercase font-bold">Tổng đơn hàng</div>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-semantic-success" />
              {stats.total_orders}
            </div>
          </Card>
          <Card className="p-5 flex flex-col gap-2">
            <div className="text-xs text-semantic-muted uppercase font-bold">Tổng doanh thu hệ thống</div>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-orange" />
              {stats.total_revenue.toLocaleString('vi-VN')}đ
            </div>
          </Card>
          <Card className="p-5 flex flex-col gap-2">
            <div className="text-xs text-semantic-muted uppercase font-bold">Hoa hồng đã chi trả</div>
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-semantic-error" />
              {stats.total_commissions_paid.toLocaleString('vi-VN')}đ
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center text-semantic-muted">
          Không có dữ liệu
        </Card>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-brand-orange" />
        <h2 className="text-xl font-extrabold">Quản Lý Users (Tenants)</h2>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs text-semantic-muted uppercase font-medium tracking-wider">
                  <th className="py-4 px-6">User / Tenant</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Ngày tham gia</th>
                  <th className="py-4 px-6">Vai trò</th>
                  <th className="py-4 px-6">Gói (Plan)</th>
                  <th className="py-4 px-6 text-right">Tổng Doanh Thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img src={u.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+u.email} alt="" className="w-8 h-8 rounded-full border border-border" />
                      <span className="font-bold">{u.full_name || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 text-semantic-muted">{u.email}</td>
                    <td className="py-4 px-6 text-xs">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-brand-orange/20 text-brand-orange' : 'bg-muted text-muted-foreground'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        value={u.plan || 'free'}
                        onChange={(e) => handlePlanChange(u.id, u.full_name || u.email, u.plan || 'free', e.target.value)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold uppercase border-none outline-none cursor-pointer ${
                          u.plan === 'premium' ? 'bg-purple-500/20 text-purple-400' :
                          u.plan === 'pro' ? 'bg-semantic-info/20 text-semantic-info' : 
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        <option value="free">FREE</option>
                        <option value="pro">PRO</option>
                        <option value="premium">PREMIUM</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-foreground">
                      {Number(u.total_revenue).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-semantic-muted">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-5 h-5 text-brand-orange" />
        <h2 className="text-xl font-extrabold">Lịch Sử Đơn Hàng (Toàn Hệ Thống)</h2>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs text-semantic-muted uppercase font-medium tracking-wider">
                  <th className="py-4 px-6">Mã Giao Dịch</th>
                  <th className="py-4 px-6">Sản Phẩm</th>
                  <th className="py-4 px-6">Creator (Tenant)</th>
                  <th className="py-4 px-6">Email Khách Hàng</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6 text-right">Số Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs">{o.payment_code}</td>
                    <td className="py-4 px-6 font-medium">{o.product_name}</td>
                    <td className="py-4 px-6 text-semantic-muted">{o.creator_name}</td>
                    <td className="py-4 px-6 text-xs">{o.customer_email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${o.status === 'paid' ? 'bg-semantic-success/20 text-semantic-success' : 'bg-semantic-warning/20 text-semantic-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-foreground">
                      {Number(o.amount).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-semantic-muted">Không có đơn hàng nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">Yêu Cầu Rút Tiền Hoa Hồng</h2>
          <p className="text-xs text-semantic-muted mt-1">Duyệt các yêu cầu rút số dư hoa hồng từ các Cộng Tác Viên (CTV).</p>
        </div>
      </div>

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
            <Button onClick={loadAdminData} variant="secondary">Thử lại</Button>
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
                <tr className="border-b border-border bg-muted/50 text-xs text-semantic-muted uppercase font-medium tracking-wider">
                  <th className="py-4 px-6">Cộng tác viên</th>
                  <th className="py-4 px-6">Số tiền rút</th>
                  <th className="py-4 px-6">Thông tin nhận tiền</th>
                  <th className="py-4 px-6">Thời gian yêu cầu</th>
                  <th className="py-4 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-muted/50 transition-colors">
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
                      <Button onClick={() => handleApprove(comm.affiliate_id, comm.profiles?.full_name || 'CTV', Number(comm.amount))} className="ml-auto">
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
      </Card>
    </div>
  );

  const renderArticles = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-brand-orange" />
          <h2 className="text-xl font-extrabold">Kiểm duyệt Bài viết</h2>
        </div>
        <Button onClick={loadArticles} variant="outline" size="sm">
          Làm mới
        </Button>
      </div>
      
      <Card className="overflow-hidden border-border bg-card/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-semantic-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Tác giả</th>
                <th className="px-6 py-4 font-semibold">Tiêu đề</th>
                <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{article.profiles?.full_name || 'Không rõ'}</div>
                    <div className="text-xs text-semantic-muted">{article.profiles?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px] truncate font-medium">{article.title}</div>
                    <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer" className="text-xs text-brand-orange hover:underline">
                      Xem chi tiết
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {article.status === 'published' ? (
                        <span className="bg-semantic-success/20 text-semantic-success text-[10px] px-2 py-0.5 rounded-full w-max">Đã xuất bản</span>
                      ) : (
                        <span className="bg-muted text-semantic-muted text-[10px] px-2 py-0.5 rounded-full w-max">Bản nháp</span>
                      )}
                      
                      {article.moderation_status === 'approved' && <span className="text-xs text-semantic-success">Đã duyệt</span>}
                      {article.moderation_status === 'warned' && <span className="text-xs text-brand-orange">Đã cảnh báo</span>}
                      {article.moderation_status === 'suspended' && <span className="text-xs text-semantic-error">Đã đình chỉ</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {article.moderation_status !== 'approved' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs bg-semantic-success hover:bg-semantic-success/90"
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: 'Duyệt bài viết',
                              message: 'Duyệt bài viết này?',
                              confirmText: 'Duyệt',
                              variant: 'info'
                            });
                            if (confirmed) {
                              await articleService.adminModerateArticle(article.id, 'approved');
                              loadArticles();
                              toast.success('Đã duyệt bài viết');
                            }
                          }}
                        >
                          Duyệt
                        </Button>
                      )}
                      {article.moderation_status !== 'warned' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                          onClick={async () => {
                            const msg = window.prompt('Nhập nội dung cảnh báo:');
                            if (msg !== null) {
                              await articleService.adminModerateArticle(article.id, 'warned', msg);
                              loadArticles();
                            }
                          }}
                        >
                          Cảnh báo
                        </Button>
                      )}
                      {article.moderation_status !== 'suspended' && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 text-xs"
                          onClick={async () => {
                            const msg = window.prompt('Lý do đình chỉ (ẩn bài viết):');
                            if (msg !== null) {
                              await articleService.adminModerateArticle(article.id, 'suspended', msg);
                              loadArticles();
                            }
                          }}
                        >
                          Đình chỉ
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-semantic-muted">
                    Chưa có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-brand-orange" />
          <h2 className="text-xl font-extrabold">Kiểm duyệt Sản phẩm</h2>
        </div>
        <Button onClick={loadProducts} variant="outline" size="sm">
          Làm mới
        </Button>
      </div>
      
      <Card className="overflow-hidden border-border bg-card/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-semantic-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Creator</th>
                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold">Giá</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{prod.profiles?.full_name || 'Không rõ'}</div>
                    <div className="text-xs text-semantic-muted">{prod.profiles?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.cover_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded border border-border"
                      />
                      <div>
                        <div className="max-w-[200px] truncate font-medium">{prod.name}</div>
                        <div className="text-[10px] text-brand-orange mt-0.5">{prod.product_type === 'physical' ? 'SP Vật lý' : 'SP Số'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-brand-orange">{prod.price.toLocaleString('vi-VN')}đ</div>
                  </td>
                  <td className="px-6 py-4">
                    {prod.status === 'active' ? (
                      <span className="bg-semantic-success/20 text-semantic-success text-[10px] px-2 py-0.5 rounded-full">Đang bán</span>
                    ) : (
                      <span className="bg-semantic-error/20 text-semantic-error text-[10px] px-2 py-0.5 rounded-full">Bị ẩn/Đình chỉ</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {prod.status !== 'inactive' && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 text-xs"
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: 'Đình chỉ sản phẩm',
                              message: 'Đình chỉ (ẩn) sản phẩm này khỏi hệ thống?'
                            });
                            if (confirmed) {
                              await moderateProduct(prod.id, 'suspend');
                              toast.success('Đã đình chỉ sản phẩm');
                            }
                          }}
                        >
                          Đình chỉ
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs border-semantic-error text-semantic-error hover:bg-semantic-error/10"
                        onClick={async () => {
                          const confirmed = await confirm({
                            title: 'Xóa sản phẩm',
                            message: 'Xóa vĩnh viễn sản phẩm này? (Không thể hoàn tác)'
                          });
                          if (confirmed) {
                            await moderateProduct(prod.id, 'delete');
                            toast.success('Đã xóa sản phẩm');
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-semantic-muted">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <Layout 
      headerContent={headerContent} 
      sidebarContent={sidebarContent}
      bottomNavContent={bottomNavContent}
    >
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'withdrawals' && renderWithdrawals()}
      {activeTab === 'articles' && renderArticles()}
      {activeTab === 'products' && renderProducts()}
    </Layout>
  );
};
