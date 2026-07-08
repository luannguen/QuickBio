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
  const [mockPhoneStep, setMockPhoneStep] = useState<'bio' | 'checkout' | 'paid'>('bio');

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
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-semibold text-brand-orange">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Giải pháp SaaS MMO tự động hoá 100%</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Biến Bio-Link thành{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">
                Cửa hàng Sản phẩm số
              </span>{' '}
              Tự động hóa 100%
            </h1>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl">
              Tạo trang cá nhân chuyên nghiệp, đăng bán ebook, tài liệu, slide. Khách chỉ cần quét VietQR, hệ thống sẽ tự động xác thực và bàn giao file trực tiếp qua email chỉ trong 3 giây.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 group text-sm"
              >
                <span>Tạo Bio & DigiStore miễn phí</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={onNavigateToDemoBio}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                <span>Xem demo trang Bio công khai</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Mobile Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[280px] h-[570px] bg-[#0d111a] rounded-[45px] p-3 shadow-2xl border-[6px] border-white/10 ring-8 ring-black/40 overflow-hidden flex flex-col">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full"></div>
              </div>

              {/* iPhone Screen Content */}
              <div className="relative flex-1 rounded-[38px] overflow-hidden bg-[#080B11] border border-white/5 flex flex-col p-4 pt-8">
                {mockPhoneStep === 'bio' && (
                  <div className="flex-1 flex flex-col justify-between space-y-4 animate-fade-in">
                    {/* Header */}
                    <div className="text-center space-y-2 mt-2">
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full mx-auto object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">Luan Nguyen</h4>
                        <p className="text-[10px] text-white/50">Tài liệu & Công cụ MMO chuyên nghiệp</p>
                      </div>
                    </div>

                    {/* Product Card */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="glass-card p-3 rounded-xl border border-white/10 space-y-2.5">
                        <img 
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" 
                          alt="ChatGPT Ebook"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="space-y-1 text-left">
                          <h5 className="text-[10px] font-bold text-white leading-snug line-clamp-1">100+ Prompt ChatGPT Thôi Miên Khách Hàng</h5>
                          <p className="text-[9px] text-white/40 line-clamp-2">Bấm viết kịch bản, content chốt sale trong 3 giây.</p>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] font-extrabold text-brand-orange">49.000đ</span>
                          <button 
                            onClick={() => setMockPhoneStep('checkout')}
                            className="px-2.5 py-1.5 bg-brand-orange hover:bg-brand-coral text-white text-[9px] font-bold rounded-lg transition-all"
                          >
                            Mua ngay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Watermark footer */}
                    <div className="text-center text-[8px] text-white/30 pt-2 border-t border-white/5">
                      ⚡ Tạo Bio Link bởi QuickBio.vn
                    </div>
                  </div>
                )}

                {mockPhoneStep === 'checkout' && (
                  <div className="flex-1 flex flex-col justify-between space-y-4 animate-fade-in text-center">
                    <h5 className="text-[11px] font-bold text-brand-orange">Quét Mã VietQR Chuyển Khoản</h5>
                    <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border border-white/15">
                      <img 
                        src={`https://api.vietqr.io/image/970422-11301442277-hFpQhC9.jpg?accountName=NGUYEN%20THIEN%20LUAN&amount=49000&addInfo=QB41500`}
                        alt="VietQR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="text-[9px] text-white/50">Số tiền: <strong className="text-white">49.000đ</strong></div>
                      <div className="text-[9px] text-white/50">Nội dung: <strong className="text-brand-orange font-mono">QB41500</strong></div>
                    </div>
                    <button 
                      onClick={() => setMockPhoneStep('paid')}
                      className="w-full py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-[9px] font-bold rounded-xl transition-all animate-pulse animate-duration-1000"
                    >
                      Bấm giả lập thanh toán thành công
                    </button>
                  </div>
                )}

                {mockPhoneStep === 'paid' && (
                  <div className="flex-1 flex flex-col justify-center items-center space-y-4 animate-fade-in text-center">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 animate-bounce">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-green-400">Thanh Toán Thành Công!</h5>
                      <p className="text-[9px] text-white/50 max-w-[180px]">File sản phẩm đã được tự động giao qua email của khách hàng.</p>
                    </div>
                    <a 
                      href="https://quick-bio-lilac.vercel.app/downloads/100-prompt-chatgpt.html"
                      target="_blank"
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[9px] font-bold rounded-xl transition-all"
                    >
                      📥 Tải File Ebook Ngay
                    </a>
                    <button 
                      onClick={() => setMockPhoneStep('bio')}
                      className="text-[9px] text-white/30 hover:text-white underline pt-4"
                    >
                      Quay lại trang Bio
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
        {/* Pricing Table Section */}
        <div className="w-full max-w-5xl pt-24 pb-12 text-center space-y-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-extrabold text-white">
              Bắt Đầu Tạo Thu Nhập Ngay Hôm Nay
            </h3>
            <p className="text-sm text-white/50 max-w-xl mx-auto">
              Lựa chọn gói dịch vụ phù hợp nhất với nhu cầu kinh doanh sản phẩm số của bạn. Nâng cấp bất cứ lúc nào.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Gói Free */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 text-left space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-white/10 hover:shadow-2xl">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">QuickBio Free</h4>
                  <p className="text-xs text-white/50 mt-1">Dành cho người mới bắt đầu trải nghiệm MMO.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">0đ</span>
                  <span className="text-xs text-white/40">/ trọn đời</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-white/5 text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Tạo 1 trang Bio-Link cơ bản</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Đăng tối đa 1 sản phẩm số</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/30">
                    <span>✗</span>
                    <span>Không có Sáng tạo AI (Gemini)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white/30">
                    <span>✗</span>
                    <span>Không có hệ thống CTV Affiliate</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleStart}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-all mt-8"
              >
                Trải nghiệm miễn phí
              </button>
            </div>

            {/* Gói Pro */}
            <div className="glass-card p-8 rounded-3xl border border-brand-orange/30 text-left space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-brand-orange/50 hover:shadow-2xl hover:shadow-brand-orange/5 bg-gradient-to-b from-brand-orange/5 via-transparent to-transparent">
              <div className="absolute top-0 right-0 bg-brand-orange text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Phổ biến nhất
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    QuickBio Pro
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                  </h4>
                  <p className="text-xs text-white/50 mt-1">Đầy đủ vũ khí MMO đỉnh cao để kiếm tiền thụ động.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">99.000đ</span>
                  <span className="text-xs text-white/40">/ tháng</span>
                </div>
                <ul className="space-y-3 pt-4 border-t border-brand-orange/10 text-xs text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Không giới hạn sản phẩm số đăng bán</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Sáng tạo Content Tự động (Gemini AI Pro)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Bật hệ thống Affiliate tuyển CTV không giới hạn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Hỗ trợ thiết kế tên miền riêng (Sắp ra mắt)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={handleStart}
                className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold text-xs rounded-xl shadow-md shadow-brand-orange/10 transition-all mt-8"
              >
                Nâng cấp Pro ngay
              </button>
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
