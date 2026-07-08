import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, ArrowRight, ShoppingBag, QrCode, Share2, Layers } from 'lucide-react';
import { AuthModal } from '../../components/AuthModal';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToDemoBio: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard, onNavigateToDemoBio }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStart = () => {
    if (isAuthenticated) {
      onNavigateToDashboard();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onNavigateToDashboard();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080B11] text-white">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            QuickBio
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onNavigateToDemoBio}
            className="text-sm font-medium text-white/75 hover:text-white transition-colors"
          >
            Trang cá nhân mẫu
          </button>
          
          <button 
            onClick={handleStart}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all active:scale-95 touch-target"
          >
            {loading ? 'Đang tải...' : isAuthenticated ? 'Vào Dashboard' : 'Trải nghiệm Demo'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-semibold text-brand-orange animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Giải pháp MMO đột phá 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]">
          Biến Bio-Link thành{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">
            Cửa hàng Sản phẩm số
          </span>{' '}
          Tự động 100%
        </h1>

        <p className="text-lg text-white/50 max-w-xl leading-relaxed">
          Tạo trang cá nhân đẹp mắt, đăng tải ebook, template, khóa học của bạn. Khách quét mã VietQR &rarr; Hệ thống kiểm tra giao dịch và giao hàng tự động.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 group text-base"
          >
            <span>Tạo Bio & DigiStore của bạn</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onNavigateToDemoBio}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 text-base"
          >
            <span>Xem demo trang Bio công khai</span>
          </button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pt-16">
          
          <div className="glass-card p-6 rounded-2xl border border-white/5 text-left space-y-4">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange border border-brand-orange/25">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Bio-Link Cao cấp</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Trình biên tập trực quan, chọn màu sắc gradient và giao diện Glassmorphism mượt mà. Tối ưu hoàn hảo cho hiển thị trên điện thoại.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 text-left space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-brand-coral border border-brand-coral/25">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Bán Sản phẩm số</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Upload file zip, pdf, link khóa học. Giao hàng tự động qua email và hiển thị link tải trực tiếp ngay sau khi khách chuyển khoản thành công.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 text-left space-y-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/25">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Thanh toán VietQR Tự động</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Tiền chảy trực tiếp vào tài khoản ngân hàng cá nhân của bạn. Không qua trung gian giam vốn, không lo chiết khấu cao. Tự động hóa qua SePay Webhook.
            </p>
          </div>

        </div>

        {/* Tech and flow overview */}
        <div className="w-full max-w-4xl pt-16">
          <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 text-left">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-orange" />
              Quy trình hoạt động (MMO Loop)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Thiết lập cửa hàng', desc: 'Đăng ký cấu hình API SePay để nhận biến động số dư.' },
                { step: '2', title: 'Đăng bán sản phẩm', desc: 'Upload các template, ebook và đặt giá bán.' },
                { step: '3', title: 'Khách hàng mua', desc: 'Khách quét mã VietQR được sinh tự động.' },
                { step: '4', title: 'Nhận tiền & Giao file', desc: 'Tiền về ngân hàng của bạn, khách tự động nhận file.' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2 relative">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </span>
                    <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed pl-11 sm:pl-0 sm:pt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Affiliate Recruitment Section */}
        <div className="w-full max-w-4xl pt-16">
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-tr from-brand-orange/10 via-brand-coral/5 to-transparent border border-brand-orange/20 text-left space-y-6">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-brand-orange/20 text-[10px] font-bold text-brand-orange uppercase tracking-wider">
                  Dành cho Cộng Tác Viên (CTV)
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  🔥 Kiếm Tiền Online Không Cần Vốn Với QuickBio Affiliate
                </h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                  Quảng bá các sản phẩm số chất lượng cao trên Bio và nhận ngay **50% hoa hồng** cho mỗi đơn hàng thanh toán thành công. Hệ thống tự động ghi nhận hoa hồng qua mã giới thiệu của bạn.
                </p>
              </div>
              <button 
                onClick={handleStart}
                className="px-6 py-3.5 bg-brand-orange hover:bg-brand-coral text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-center"
              >
                Tham gia Affiliate ngay
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <span className="text-brand-orange font-bold text-sm">✓</span>
                <span>Chiết khấu 50% hoa hồng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-orange font-bold text-sm">✓</span>
                <span>Theo dõi click & đơn real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-orange font-bold text-sm">✓</span>
                <span>Thanh toán hoa hồng nhanh chóng</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-24 py-8 text-center text-white/40 text-sm">
        <p>© 2026 QuickBio DigiStore. All rights reserved.</p>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
};
export default LandingPage;
