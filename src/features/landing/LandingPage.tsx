import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, ArrowRight, Layers, ChevronDown } from 'lucide-react';
import { AuthModal } from '../../components/AuthModal';
import { AIVoiceWidget } from '../../components/AIVoiceWidget';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToDemoBio: () => void;
  onNavigateToAIVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard, onNavigateToDemoBio, onNavigateToAIVoice }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mockPhoneStep, setMockPhoneStep] = useState<'bio' | 'checkout' | 'paid'>('bio');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="min-h-screen relative overflow-hidden bg-[#080B11] text-white bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        .animate-float {
          animation: float-slow 7s ease-in-out infinite;
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-1deg); }
        }
        .animate-float-delay {
          animation: float-delay 9s ease-in-out infinite;
        }
      `}</style>
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
            onClick={onNavigateToAIVoice}
            className="text-sm font-medium text-brand-orange hover:text-brand-coral transition-colors flex items-center gap-1 font-bold mr-2 touch-target"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tổng đài Lễ tân AI</span>
          </button>

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

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
              Giải phóng thu nhập từ{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">
                Lượng Follow
              </span>{' '}
              của bạn
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">
              Xây dựng cửa hàng sản phẩm số trên Bio-Link chỉ trong 30 giây. Khách quét mã VietQR thanh toán - Tiền về bank của bạn - Hệ thống tự động bàn giao file qua Email tức thì.
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
                      ⚡ Tạo Bio Link bởi QuickBio
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

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pt-16">
          {/* Bento Card 1: Bio-Link Builder (width: md:col-span-2) */}
          <div className="bg-[#0f1422]/60 rounded-3xl border border-white/5 p-8 text-left space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-brand-orange/30 transition-all duration-500">
            <div className="absolute -inset-px bg-gradient-to-tr from-brand-orange/0 via-transparent to-brand-orange/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Công cụ thiết kế</div>
              <h3 className="text-xl font-extrabold text-white">Trình dựng Bio-Link kéo thả cực cuốn</h3>
              <p className="text-sm text-white/50 max-w-md leading-relaxed">Tùy biến Avatar, màu nền, các mạng xã hội và xem trước giao diện trên điện thoại ngay lập tức.</p>
            </div>
            {/* Visual mini builder wireframe inside card */}
            <div className="w-full bg-[#080b11]/80 rounded-2xl p-4 border border-white/10 flex items-center gap-4 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-white/60">👤</div>
              <div className="flex-1 space-y-1.5">
                <div className="w-24 h-2.5 bg-white/10 rounded"></div>
                <div className="w-32 h-1.5 bg-white/5 rounded"></div>
              </div>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CB342]"></span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: VietQR Verification (width: md:col-span-1) */}
          <div className="bg-[#0f1422]/60 rounded-3xl border border-white/5 p-8 text-left space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#8BC34A]/30 transition-all duration-500">
            <div className="absolute -inset-px bg-gradient-to-tr from-[#8BC34A]/0 via-transparent to-[#8BC34A]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-[#8BC34A]">Thanh toán tức thì</div>
              <h3 className="text-xl font-extrabold text-white">Quét VietQR Tự động</h3>
              <p className="text-sm text-white/50 leading-relaxed">Tiền về thẳng tài khoản ngân hàng cá nhân của bạn, không qua trung gian giam vốn.</p>
            </div>
            {/* Visual bank notification alert inside card */}
            <div className="bg-[#8BC34A]/10 border border-[#8BC34A]/25 p-3.5 rounded-2xl flex items-center gap-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-xl">💰</span>
              <div className="text-xs">
                <div className="font-extrabold text-white">Biến động số dư MBBank</div>
                <div className="text-[#8BC34A] font-extrabold font-mono">+49.000 VND (QB41500)</div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Digital Goods Delivery (width: md:col-span-1) */}
          <div className="bg-[#0f1422]/60 rounded-3xl border border-white/5 p-8 text-left space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#3b82f6]/30 transition-all duration-500">
            <div className="absolute -inset-px bg-gradient-to-tr from-[#3b82f6]/0 via-transparent to-[#3b82f6]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-[#3b82f6]">Giao hàng số</div>
              <h3 className="text-xl font-extrabold text-white">Tự động bàn giao File</h3>
              <p className="text-sm text-white/50 leading-relaxed">File tài liệu, khóa học được gửi trực tiếp qua email của khách hàng ngay khi thanh toán thành công.</p>
            </div>
            {/* Visual delivery simulation inside card */}
            <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl flex items-center gap-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-xl">📧</span>
              <div className="text-[10px] space-y-0.5">
                <div className="font-extrabold text-white">Đã gửi: 100+ Prompt ChatGPT...</div>
                <div className="text-white/40 font-mono">Người nhận: luan.nguyen***@gmail.com</div>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Gemini AI Assistant (width: md:col-span-2) */}
          <div className="bg-[#0f1422]/60 rounded-3xl border border-white/5 p-8 text-left space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-brand-coral/30 transition-all duration-500">
            <div className="absolute -inset-px bg-gradient-to-tr from-brand-coral/0 via-transparent to-brand-coral/10 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-brand-coral">Trí tuệ nhân tạo</div>
              <h3 className="text-xl font-extrabold text-white">Viết Content bằng Gemini AI Pro</h3>
              <p className="text-sm text-white/50 max-w-md leading-relaxed">Tự động tạo các bài viết bán hàng thôi miên trên Facebook để kéo traffic về Bio Link của bạn.</p>
            </div>
            {/* Visual AI Prompting inside card */}
            <div className="bg-[#080b11]/80 rounded-2xl p-4 border border-white/10 flex flex-col gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              <div className="text-[9px] text-white/40 flex items-center justify-between">
                <span>Prompt: "Viết bài tiếp thị Canva Template..."</span>
                <span className="bg-brand-coral/20 text-brand-coral font-bold px-1.5 py-0.5 rounded text-[8px] font-mono">Gemini Pro</span>
              </div>
              <div className="text-[9px] text-white/70 italic line-clamp-2 leading-relaxed">
                "🚀 Mở khóa kho Canva 500+ Mẫu thiết kế bán hàng kéo thả, tạo banner Shopee/Facebook siêu lung linh trong 3 giây..."
              </div>
            </div>
          </div>
        </div>

        {/* Top Creators Showroom */}
        <div className="w-full max-w-5xl pt-20 pb-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Nhà sáng tạo tiêu biểu</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Cộng Đồng QuickBio MMO Thịnh Vượng</h3>
            <p className="text-sm text-white/50 max-w-xl mx-auto">Hàng ngàn Creator, Marketer đang xây dựng nguồn thu nhập thụ động bền vững từ sản phẩm số mỗi ngày.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Nguyễn Tiến Luân', role: 'MMO Marketer', earning: '34.8Mđ', desc: 'Đã bán 500+ bộ Prompt ChatGPT & Canva Templates.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Khánh Vy', role: 'Content Creator', earning: '18.5Mđ', desc: 'Kiếm thu nhập thụ động từ việc chia sẻ file PDF bài giảng cực kỳ đơn giản.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Hoàng Minh', role: 'Designer / Freelancer', earning: '22.4Mđ', desc: 'Tuyển 50+ CTV cùng phân phối bộ preset chỉnh ảnh Lightroom cao cấp.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80' }
            ].map((creator, idx) => (
              <div key={idx} className="bg-[#0f1422]/40 rounded-3xl border border-white/5 p-6 space-y-4 hover:border-brand-orange/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">{creator.name}</h4>
                    <p className="text-[10px] text-white/50">{creator.role}</p>
                  </div>
                  <div className="ml-auto bg-brand-orange/15 border border-brand-orange/25 text-brand-orange text-xs font-black px-2.5 py-1 rounded-xl">
                    +{creator.earning}
                  </div>
                </div>
                <p className="text-xs text-white/60 leading-relaxed text-left">{creator.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Showcase Section (Visual Powerhouse) */}
        <div className="w-full max-w-5xl pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-coral/10 border border-brand-coral/20 text-xs font-semibold text-brand-coral">
              <span className="w-2 h-2 rounded-full bg-brand-coral animate-ping"></span>
              <span>Độc quyền bản Pro</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Báo Cáo Doanh Thu Real-time & Biểu Đồ Trực Quan
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Theo dõi chi tiết số lượt click link, lượt quét QR thanh toán, tỷ lệ chuyển đổi đơn hàng và doanh số thực tế theo thời gian thực. Giúp các Nhà sáng tạo đo lường chính xác hiệu quả kéo traffic từ Facebook, TikTok, Zalo.
            </p>
            <ul className="space-y-3.5 text-xs text-white/70">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Thống kê chi tiết số click vào từng sản phẩm số</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Tự động tính tỷ lệ chuyển đổi (Click-to-Sale) của trang</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Biểu đồ tăng trưởng trực quan tăng 200% khả năng tối ưu hóa</span>
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2 flex justify-center relative">
            <div className="absolute inset-0 bg-brand-orange/10 rounded-3xl filter blur-3xl pointer-events-none"></div>
            <div className="relative group transition-all duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-coral rounded-2xl blur-lg opacity-25 group-hover:opacity-45 transition duration-500"></div>
              <img 
                src="/sales_dashboard.png" 
                alt="Sales Dashboard Mockup" 
                className="relative w-full max-w-[420px] rounded-2xl border border-white/10 shadow-2xl shadow-brand-orange/5 animate-float transform group-hover:scale-[1.03] group-hover:rotate-[-1deg] transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Builder Visual Section */}
        <div className="w-full max-w-5xl pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center relative order-1">
            <div className="absolute inset-0 bg-brand-green/10 rounded-3xl filter blur-3xl pointer-events-none"></div>
            <div className="relative group transition-all duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-green to-[#D4E157] rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition duration-500"></div>
              <img 
                src="/hero_visual.png" 
                alt="Bio Builder Mockup" 
                className="relative w-full max-w-[420px] rounded-2xl border border-white/10 shadow-2xl shadow-brand-green/5 animate-float-delay transform group-hover:scale-[1.03] group-hover:rotate-[1deg] transition-all duration-500"
              />
            </div>
          </div>
          <div className="space-y-6 text-left order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
              <span>🚀</span>
              <span>Tốc độ & Trải nghiệm</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Trình Thiết Kế Bio-link Tức Thì
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Tùy biến không giới hạn Avatar cá nhân, màu sắc, font chữ, các mạng xã hội liên kết. Cập nhật và lưu thay đổi ngay lập tức lên trang Bio công khai của bạn mà không cần bất kỳ kỹ năng lập trình nào.
            </p>
            <ul className="space-y-3.5 text-xs text-white/70">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Tải ảnh đại diện, ảnh sản phẩm nhanh chóng bằng kéo thả/dán ảnh</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Xem trước trực quan phiên bản Mobile ngay trong trang sửa</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 flex items-center justify-center font-bold text-[10px]">✓</div>
                <span>Hệ thống lưu nháp tự động chống mất dữ liệu</span>
              </li>
            </ul>
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

        {/* FAQ Accordion Section */}
        <div className="w-full max-w-4xl pt-20 pb-12 text-center space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Hỏi đáp thắc mắc</span>
            <h3 className="text-3xl font-extrabold text-white">Những Câu Hỏi Thường Gặp</h3>
            <p className="text-sm text-white/50 max-w-xl mx-auto">Giải đáp mọi thắc mắc của bạn về dòng tiền, cổng thanh toán và cách vận hành QuickBio.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-left">
            {[
              { q: 'Hệ thống đối soát tự động qua SePay vận hành thế nào?', a: 'Khi có khách hàng quét mã VietQR để mua sản phẩm, hệ thống SePay sẽ tự động phát hiện biến động số dư tài khoản của bạn thông qua API trong vòng 1-2 giây. QuickBio sẽ lập tức xác thực giao dịch, hiển thị link tải trực tiếp cho khách và tự động gửi email đính kèm file gốc cho khách.' },
              { q: 'Tôi có phải chia sẻ doanh thu từ sản phẩm cho QuickBio không?', a: 'Không! Với tài khoản của bạn, dòng tiền quét mã VietQR chuyển khoản sẽ chảy trực tiếp 100% vào tài khoản ngân hàng cá nhân của chính bạn. Chúng tôi không qua trung gian giam vốn và không thu bất kỳ phí chiết khấu giao dịch nào.' },
              { q: 'Hệ thống Affiliate ăn chia hoa hồng CTV tự động hoạt động thế nào?', a: 'Bạn có thể tuyển CTV quảng bá sản phẩm cho mình. Khi CTV chia sẻ link Bio kèm mã giới thiệu (ref) của họ, hệ thống sẽ tự động ghi nhận cookie của trình duyệt. Nếu khách mua bất kỳ sản phẩm nào trên Bio, hoa hồng sẽ tự động được ghi nhận vào tài khoản CTV của họ và bạn đối soát duyệt thanh toán dễ dàng tại Dashboard.' },
              { q: 'QuickBio Pro có giá bao nhiêu và tôi có được hủy gói không?', a: 'Gói Pro có phí là 99.000đ/tháng mở khóa toàn bộ tính năng bán hàng không giới hạn, CTV Affiliate và trợ lý AI Gemini. Bạn có thể gia hạn theo tháng hoặc hủy bất cứ lúc nào ngay tại giao diện quản trị.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#0f1422]/40 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-white font-bold text-sm hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${openFaq === idx ? 'transform rotate-180 text-brand-orange' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-40 border-t border-white/5' : 'max-h-0'}`}>
                  <p className="px-6 py-4 text-xs text-white/60 leading-relaxed bg-[#080b11]/30">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
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
      <AIVoiceWidget />
    </div>
  );
};
export default LandingPage;
