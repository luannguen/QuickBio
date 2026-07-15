import React, { useState } from 'react';
import { Sparkles, ArrowRight, ChevronDown, Home, Layers, Tag } from 'lucide-react';
import { AuthModal } from '../../components/AuthModal';
import { AIVoiceWidget } from '../../components/AIVoiceWidget';

interface LandingPageMobileProps {
  isAuthenticated: boolean;
  loading: boolean;
  onNavigateToDashboard: () => void;
  onNavigateToDemoBio: () => void;
  onNavigateToAIVoice: () => void;
}

export const LandingPageMobile: React.FC<LandingPageMobileProps> = ({
  isAuthenticated,
  onNavigateToDashboard,
  onNavigateToDemoBio,
  onNavigateToAIVoice
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mockPhoneStep, setMockPhoneStep] = useState<'bio' | 'checkout' | 'paid'>('bio');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Gesture States for Phone Mockup
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      if (mockPhoneStep === 'bio') setMockPhoneStep('checkout');
      else if (mockPhoneStep === 'checkout') setMockPhoneStep('paid');
      else if (mockPhoneStep === 'paid') setMockPhoneStep('bio');
    } else if (isRightSwipe) {
      if (mockPhoneStep === 'paid') setMockPhoneStep('checkout');
      else if (mockPhoneStep === 'checkout') setMockPhoneStep('bio');
      else if (mockPhoneStep === 'bio') setMockPhoneStep('paid');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

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
    <div className="min-h-screen relative overflow-hidden bg-[#080B11] text-white pb-28">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-4 py-4 flex justify-between items-center relative z-10 border-b border-white/5 bg-brand-card/10 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-lg flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-base font-black tracking-tight">QuickBio</span>
        </div>
        
        <button
          onClick={onNavigateToAIVoice}
          className="text-xs font-bold text-brand-orange flex items-center gap-1 min-h-[44px] px-2 hover:text-brand-coral transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Lễ tân AI
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-4 pt-8 space-y-12 relative z-10">
        
        {/* Intro badge & Heading */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-bold text-brand-orange mx-auto">
            <Sparkles className="w-3 h-3" />
            <span>SaaS MMO Tự Động Hóa 100%</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            Giải phóng thu nhập từ <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">
              Lượng Follow
            </span> của bạn
          </h1>

          <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto">
            Xây dựng cửa hàng sản phẩm số trên Bio-Link chỉ trong 30 giây. Khách quét mã VietQR thanh toán - Tiền về bank của bạn - Tự động bàn giao file tức thì.
          </p>

          <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
            <button 
              onClick={handleStart}
              className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs min-h-[48px] touch-target"
            >
              <span>Bắt đầu tạo Bio miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onNavigateToDemoBio}
              className="w-full py-3.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 text-xs min-h-[48px] touch-target"
            >
              <span>Xem trang Bio cá nhân mẫu</span>
            </button>
          </div>
        </div>

        {/* Mobile Phone Mockup */}
        <div className="flex justify-center pt-4">
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-[260px] h-[520px] bg-[#0d111a] rounded-[36px] p-2.5 shadow-2xl border-[4px] border-white/15 overflow-hidden flex flex-col select-none touch-pan-y"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-10 h-0.5 bg-white/20 rounded-full"></div>
            </div>

            <div className="relative flex-1 rounded-[30px] overflow-hidden bg-[#080B11] border border-white/5 flex flex-col p-3 pt-6">
              {mockPhoneStep === 'bio' && (
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="text-center space-y-1.5 mt-2">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
                      alt="Avatar" 
                      className="w-12 h-12 rounded-full mx-auto object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-white">Luan Nguyen</h4>
                      <p className="text-[8px] text-white/50">Tài liệu & Công cụ MMO chuyên nghiệp</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="glass-card p-2.5 rounded-xl border border-white/10 space-y-2">
                      <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" 
                        alt="ChatGPT Ebook"
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <div className="space-y-0.5 text-left">
                        <h5 className="text-[9px] font-bold text-white leading-snug truncate">100+ Prompt ChatGPT Thôi Miên</h5>
                        <p className="text-[8px] text-white/40 line-clamp-1">Viết kịch bản, content chốt sale trong 3s.</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-[#FF6B35]">49.000đ</span>
                        <button 
                          onClick={() => setMockPhoneStep('checkout')}
                          className="px-2 py-1 bg-brand-orange text-white text-[8px] font-bold rounded-md min-h-[32px] flex items-center justify-center"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[7px] text-white/30 pt-1.5 border-t border-white/5 relative">
                    <span>⚡ Tạo Bio Link bởi QuickBio</span>
                    <span className="absolute bottom-[-14px] left-0 right-0 text-[6px] text-white/40 block text-center animate-pulse">Vuốt ngang để đổi bước</span>
                  </div>
                </div>
              )}

              {mockPhoneStep === 'checkout' && (
                <div className="flex-1 flex flex-col justify-between space-y-3 text-center">
                  <h5 className="text-[9px] font-bold text-brand-orange">Quét Mã VietQR Chuyển Khoản</h5>
                  <div className="w-28 h-28 bg-white p-1 rounded-lg mx-auto flex items-center justify-center">
                    <img 
                      src={`https://api.vietqr.io/image/970422-11301442277-hFpQhC9.jpg?accountName=NGUYEN%20THIEN%20LUAN&amount=49000&addInfo=QB41500`}
                      alt="VietQR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="text-[8px] text-white/50">Số tiền: <strong className="text-white">49.000đ</strong></div>
                    <div className="text-[8px] text-white/50">Nội dung: <strong className="text-brand-orange font-mono">QB41500</strong></div>
                  </div>
                  <button 
                    onClick={() => setMockPhoneStep('paid')}
                    className="w-full py-1.5 bg-gradient-to-r from-brand-orange to-brand-coral text-white text-[8px] font-bold rounded-lg min-h-[36px] flex items-center justify-center"
                  >
                    Bấm giả lập thanh toán
                  </button>
                </div>
              )}

              {mockPhoneStep === 'paid' && (
                <div className="flex-1 flex flex-col justify-center items-center space-y-3 text-center">
                  <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-[9px] font-bold text-green-400">Thanh Toán Thành Công!</h5>
                    <p className="text-[8px] text-white/50 max-w-[140px] mx-auto">File đã tự động gửi qua email của khách hàng.</p>
                  </div>
                  <a 
                    href="https://quick-bio-lilac.vercel.app/downloads/100-prompt-chatgpt.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/5 text-white border border-white/10 text-[8px] font-bold rounded-lg"
                  >
                    📥 Tải File Ebook
                  </a>
                  <button 
                    onClick={() => setMockPhoneStep('bio')}
                    className="text-[8px] text-white/30 hover:text-white underline pt-2"
                  >
                    Quay lại trang Bio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature List (Mobile Bento alternative) */}
        <div id="features" className="space-y-4 pt-4">
          <div className="px-1 text-xs font-black uppercase tracking-wider text-brand-orange">Tính năng cốt lõi</div>
          
          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              Trình dựng Bio-Link kéo thả
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tùy biến Avatar, màu nền, nút bấm xã hội và xem trước hiển thị di động tức thì ngay trong màn hình soạn thảo.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8BC34A]"></span>
              VietQR & Ngân hàng tự động
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tạo mã QR VietQR động. Nhận chuyển khoản trực tiếp 100% về tài khoản ngân hàng cá nhân của bạn, không giam vốn.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              Tự động bàn giao File
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Sau khi khách quét mã thanh toán, hệ thống tự động giao link tải và gửi email file zip/pdf cho khách tức thì.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-coral"></span>
              Sáng tạo nội dung Gemini AI
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Trợ lý AI viết kịch bản video ngắn và bài quảng cáo Facebook kéo traffic về trang cá nhân của bạn.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div id="pricing" className="space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-extrabold text-white">Bảng Giá Dịch Vụ</h3>
            <p className="text-xs text-white/50">Lựa chọn gói dịch vụ phù hợp với bạn.</p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">QuickBio Free</h4>
                <span className="text-lg font-black text-white">0đ</span>
              </div>
              <ul className="space-y-2 text-[11px] text-white/60">
                <li>✓ Tạo 1 trang Bio-Link cơ bản</li>
                <li>✓ Đăng tối đa 1 sản phẩm số</li>
                <li className="text-white/20">✗ Không có Sáng tạo AI (Gemini)</li>
              </ul>
              <button 
                onClick={handleStart}
                className="w-full py-2.5 bg-white/5 border border-white/10 text-white font-bold text-xs rounded-xl"
              >
                Trải nghiệm miễn phí
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-brand-orange/30 bg-gradient-to-b from-brand-orange/5 to-transparent space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  QuickBio Pro
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                </h4>
                <span className="text-lg font-black text-brand-orange">99.000đ<span className="text-[10px] text-white/50 font-normal">/th</span></span>
              </div>
              <ul className="space-y-2 text-[11px] text-white/60">
                <li>✓ Đăng bán sản phẩm KHÔNG giới hạn</li>
                <li>✓ Sáng tạo Content tự động (Gemini AI Pro)</li>
                <li>✓ Bật Affiliate tuyển CTV không giới hạn</li>
              </ul>
              <button 
                onClick={handleStart}
                className="w-full py-2.5 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-md"
              >
                Nâng cấp Pro ngay
              </button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-8">
          <div className="text-center space-y-1">
            <h3 className="text-base font-extrabold text-white">Hỏi đáp thắc mắc</h3>
            <p className="text-[11px] text-white/50">Giải đáp nhanh về QuickBio.</p>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Hệ thống đối soát SePay hoạt động thế nào?', a: 'Khi có khách quét mã VietQR, hệ thống SePay tự động phát hiện số dư thay đổi qua API trong 1-2 giây để kích hoạt đơn và giao file qua Email cho khách.' },
              { q: 'Tôi có phải chia sẻ doanh thu không?', a: 'Không! Dòng tiền chuyển khoản trực tiếp chảy vào tài khoản ngân hàng của bạn 100%. QuickBio không thu phí chiết khấu giao dịch.' },
              { q: 'Hệ thống Affiliate CTV vận hành ra sao?', a: 'Bạn tuyển CTV. Khi khách mua hàng từ link kèm mã ref của CTV, hệ thống tự động ghi nhận hoa hồng 50% để bạn duyệt thanh toán cho CTV tại dashboard.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#0f1422]/40 rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left text-xs font-bold hover:bg-white/[0.01]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/50 flex-shrink-0 ml-2 transition-transform ${openFaq === idx ? 'transform rotate-180 text-brand-orange' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="px-4 py-3 text-[11px] text-white/60 leading-normal border-t border-white/5 bg-[#080b11]/30">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-6 text-center text-white/60 text-[11px]">
        <p>© 2026 QuickBio. All rights reserved.</p>
      </footer>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-white/5 px-2 py-2 pb-safe-bottom shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto h-14">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center text-white/60 hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Trang chủ</span>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-white/60 hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Tính năng</span>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-white/60 hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Tag className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Bảng giá</span>
          </button>
          
          <button 
            onClick={handleStart}
            className="flex flex-col items-center justify-center text-white/60 hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Sparkles className="w-5 h-5 mb-1 text-brand-orange animate-pulse" />
            <span className="text-[9px] font-bold text-brand-orange">Tạo Bio</span>
          </button>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess} 
      />
      <AIVoiceWidget />
    </div>
  );
};

// Helper SVG component
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
