import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Layers, ChevronDown, Tag, Home } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { AIVoiceWidget } from '../../components/AIVoiceWidget';
import { useLandingMobile } from "./hooks/useLandingMobile";
import { PhoneMockup } from './components/PhoneMockup';
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { GlobalHeader } from "@/shared/components/layout/GlobalHeader";

// ============================================================
// TiltCard Component: Parallax 3D mouse rotate effect
// ============================================================
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    setCoords({ x: normX, y: normY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const rotateX = isHovered ? coords.y * -10 : 0;
  const rotateY = isHovered ? coords.x * 10 : 0;
  
  const shineX = isHovered ? (coords.x + 0.5) * 100 : 50;
  const shineY = isHovered ? (coords.y + 0.5) * 100 : 50;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 107, 53, 0.05) 0%, transparent 65%)`,
          zIndex: 5
        }}
      />
      <div style={{ transform: 'translateZ(8px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};

interface LandingPageViewProps {
  isAuthenticated: boolean;
  onNavigateToDashboard: () => void;
  onNavigateToDemoBio: () => void;
  onNavigateToAIVoice: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  isAuthenticated,
  onNavigateToDashboard,
  onNavigateToDemoBio,
  onNavigateToAIVoice
}) => {
  const {
    showAuthModal,
    setShowAuthModal,
    mockPhoneStep,
    setMockPhoneStep,
    openFaq,
    toggleFaq,
    touchHandlers,
    handleStart,
    handleAuthSuccess,
  } = useLandingMobile(isAuthenticated, onNavigateToDashboard);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pb-28 lg:pb-0">
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
      <div className="absolute top-[-10%] left-[-15%] lg:top-[-20%] lg:left-[-10%] w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-brand-orange/10 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] lg:bottom-[-10%] lg:right-[-10%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-brand-green/10 rounded-full blur-[80px] lg:blur-[100px] pointer-events-none"></div>

      {/* Navigation Header */}
      <GlobalHeader 
        onNavigateToHome={() => window.scrollTo(0, 0)}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToDemoBio={onNavigateToDemoBio}
        onNavigateToAIVoice={onNavigateToAIVoice}
        onStartAuth={handleStart}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess} 
      />

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-8 lg:pt-12 pb-12 lg:pb-24 space-y-12 lg:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 lg:space-y-8 relative">
            <div className="inline-flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] lg:text-xs font-semibold text-brand-orange relative z-10">
              <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              <span>SaaS MMO Tự động hoá 100%</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-foreground">
              Giải phóng thu nhập từ <br className="hidden lg:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">
                Lượng Follow
              </span> của bạn
            </h1>

            <p className="text-xs sm:text-lg text-muted-foreground leading-relaxed max-w-sm lg:max-w-xl mx-auto lg:mx-0">
              Xây dựng cửa hàng sản phẩm số trên Bio-Link chỉ trong 30 giây. Khách quét mã VietQR thanh toán - Tiền về bank của bạn - Tự động bàn giao file tức thì.
            </p>

            <div className="pt-2 lg:pt-0 flex flex-col sm:flex-row gap-3 lg:gap-4 max-w-xs lg:max-w-none mx-auto lg:mx-0">
              <Button 
                onClick={handleStart}
                className="w-full lg:w-auto py-3.5 lg:px-8 lg:py-6 shadow-lg shadow-brand-orange/20 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] group"
              >
                <span>Tạo Bio & DigiStore miễn phí</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>

              <Button 
                onClick={onNavigateToDemoBio}
                variant="secondary"
                className="w-full lg:w-auto py-3.5 lg:px-8 lg:py-6 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Xem demo trang Bio</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Mobile Mockup */}
          <div className="lg:col-span-5 flex justify-center [perspective:1200px]">
             {/* Desktop version (with 3D rotation) */}
             <div className="hidden lg:flex w-full justify-center">
              <div 
                className="relative w-[280px] h-[570px] bg-card rounded-[45px] p-3 shadow-[20px_20px_60px_-10px_rgba(0,0,0,0.85),-10px_-10px_35px_rgba(255,255,255,0.02)] border-[6px] border-border ring-8 ring-black/50 overflow-hidden flex flex-col transition-all duration-700 ease-out hover:[transform:rotateY(0deg)_rotateX(0deg)_translateZ(25px)] hover:shadow-brand-orange/15 hover:border-border cursor-grab active:cursor-grabbing"
                style={{
                  transform: 'rotateY(-18deg) rotateX(12deg) rotateZ(-3deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-muted/50 rounded-full"></div>
                </div>

                {/* iPhone Screen Content */}
                <div className="relative flex-1 rounded-[38px] overflow-hidden bg-background border border-border flex flex-col p-4 pt-8" style={{ transform: 'translateZ(10px)' }}>
                  {mockPhoneStep === 'bio' && (
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="text-center space-y-2 mt-2">
                        <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full mx-auto object-cover border border-border"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-foreground">Luan Nguyen</h4>
                          <p className="text-[10px] text-muted-foreground">Tài liệu & Công cụ MMO chuyên nghiệp</p>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="glass-card p-3 rounded-xl border border-border space-y-2.5">
                          <img 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" 
                            alt="ChatGPT Ebook"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <div className="space-y-1 text-left">
                            <h5 className="text-[10px] font-bold text-foreground leading-snug line-clamp-1">100+ Prompt ChatGPT Thôi Miên</h5>
                            <p className="text-[9px] text-muted-foreground line-clamp-2">Bấm viết kịch bản, content chốt sale trong 3 giây.</p>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[10px] font-extrabold text-brand-orange">49.000đ</span>
                            <button 
                              onClick={() => setMockPhoneStep('checkout')}
                              className="px-2.5 py-1.5 bg-brand-orange hover:bg-brand-coral text-foreground text-[9px] font-bold rounded-lg transition-all min-h-[32px] flex items-center justify-center"
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-[8px] text-muted-foreground pt-2 border-t border-border">
                        ⚡ Tạo Bio Link bởi QuickBio
                      </div>
                    </div>
                  )}

                  {mockPhoneStep === 'checkout' && (
                    <div className="flex-1 flex flex-col justify-between space-y-4 text-center">
                      <h5 className="text-[11px] font-bold text-brand-orange">Quét Mã VietQR Chuyển Khoản</h5>
                      <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border border-border">
                        <img 
                          src={`https://api.vietqr.io/image/970422-11301442277-hFpQhC9.jpg?accountName=NGUYEN%20THIEN%20LUAN&amount=49000&addInfo=QB41500`}
                          alt="VietQR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="text-[9px] text-muted-foreground">Số tiền: <strong className="text-foreground">49.000đ</strong></div>
                        <div className="text-[9px] text-muted-foreground">Nội dung: <strong className="text-brand-orange font-mono">QB41500</strong></div>
                      </div>
                      <button 
                        onClick={() => setMockPhoneStep('paid')}
                        className="w-full py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-[9px] font-bold rounded-xl transition-all min-h-[36px] flex items-center justify-center"
                      >
                        Bấm giả lập thanh toán
                      </button>
                    </div>
                  )}

                  {mockPhoneStep === 'paid' && (
                    <div className="flex-1 flex flex-col justify-center items-center space-y-4 text-center">
                      <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 animate-bounce">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-bold text-green-400">Thanh Toán Thành Công!</h5>
                        <p className="text-[9px] text-muted-foreground max-w-[180px]">File sản phẩm đã được tự động giao qua email.</p>
                      </div>
                      <a 
                        href="https://quick-bio-lilac.vercel.app/downloads/100-prompt-chatgpt.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-muted/50 hover:bg-muted/50 text-foreground border border-border text-[9px] font-bold rounded-xl transition-all"
                      >
                        📥 Tải File Ebook
                      </a>
                      <button 
                        onClick={() => setMockPhoneStep('bio')}
                        className="text-[9px] text-muted-foreground hover:text-foreground underline pt-4"
                      >
                        Quay lại trang Bio
                      </button>
                    </div>
                  )}
                </div>
              </div>
             </div>

             {/* Mobile version (with touch swipe logic) */}
             <div className="lg:hidden w-full">
               <PhoneMockup 
                 mockPhoneStep={mockPhoneStep}
                 setMockPhoneStep={setMockPhoneStep}
                 touchHandlers={touchHandlers}
               />
             </div>
          </div>
        </div>

        {/* Bento Grid Features - Responsive Desktop & Mobile combined */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full max-w-5xl lg:pt-16 mx-auto">
          <div className="lg:hidden px-1 text-xs font-black uppercase tracking-wider text-brand-orange">Tính năng cốt lõi</div>

          <TiltCard className="md:col-span-2 rounded-2xl lg:rounded-3xl">
            <Card className="p-5 lg:p-8 text-left space-y-2 lg:space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-brand-orange/30 transition-all duration-500 h-full">
              <div className="space-y-2">
                <div className="hidden lg:block text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Công cụ thiết kế</div>
                <h3 className="text-sm lg:text-xl font-bold lg:font-extrabold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange lg:hidden"></span>
                  Trình dựng Bio-Link kéo thả
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground max-w-md leading-relaxed">
                  Tùy biến Avatar, màu nền, nút bấm xã hội và xem trước hiển thị di động tức thì ngay trong màn hình soạn thảo.
                </p>
              </div>
              <div className="hidden lg:flex w-full bg-background/80 rounded-2xl p-4 border border-border items-center gap-4 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-10 h-10 rounded-full bg-muted/50 border border-border flex-shrink-0 flex items-center justify-center text-muted-foreground">👤</div>
                <div className="flex-1 space-y-1.5">
                  <div className="w-24 h-2.5 bg-muted/50 rounded"></div>
                  <div className="w-32 h-1.5 bg-muted/50 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7CB342]"></span>
                </div>
              </div>
            </Card>
          </TiltCard>

          <TiltCard className="md:col-span-1 rounded-2xl lg:rounded-3xl">
            <Card className="p-5 lg:p-8 text-left space-y-2 lg:space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#8BC34A]/30 transition-all duration-500 h-full">
              <div className="space-y-2">
                <div className="hidden lg:block text-[10px] uppercase font-extrabold tracking-widest text-[#8BC34A]">Thanh toán tức thì</div>
                <h3 className="text-sm lg:text-xl font-bold lg:font-extrabold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8BC34A] lg:hidden"></span>
                  Quét VietQR Tự động
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                  Tiền về thẳng tài khoản ngân hàng cá nhân của bạn, không qua trung gian giam vốn.
                </p>
              </div>
              <div className="hidden lg:flex bg-[#8BC34A]/10 border border-[#8BC34A]/25 p-3.5 rounded-2xl items-center gap-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xl">💰</span>
                <div className="text-xs">
                  <div className="font-extrabold text-foreground">Biến động số dư MBBank</div>
                  <div className="text-[#8BC34A] font-extrabold font-mono">+49.000 VND</div>
                </div>
              </div>
            </Card>
          </TiltCard>

          <TiltCard className="md:col-span-1 rounded-2xl lg:rounded-3xl">
            <Card className="p-5 lg:p-8 text-left space-y-2 lg:space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-[#3b82f6]/30 transition-all duration-500 h-full">
              <div className="space-y-2">
                <div className="hidden lg:block text-[10px] uppercase font-extrabold tracking-widest text-[#3b82f6]">Giao hàng số</div>
                <h3 className="text-sm lg:text-xl font-bold lg:font-extrabold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6] lg:hidden"></span>
                  Tự động bàn giao File
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                  File tài liệu, khóa học được gửi trực tiếp qua email của khách ngay khi thanh toán thành công.
                </p>
              </div>
              <div className="hidden lg:flex bg-muted/50.02] border border-border p-3.5 rounded-2xl items-center gap-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xl">📧</span>
                <div className="text-[10px] space-y-0.5">
                  <div className="font-extrabold text-foreground">Đã gửi: 100+ Prompt ChatGPT...</div>
                </div>
              </div>
            </Card>
          </TiltCard>

          <TiltCard className="md:col-span-2 rounded-2xl lg:rounded-3xl">
            <Card className="p-5 lg:p-8 text-left space-y-2 lg:space-y-6 flex flex-col justify-between overflow-hidden relative group hover:border-brand-coral/30 transition-all duration-500 h-full">
              <div className="space-y-2">
                <div className="hidden lg:block text-[10px] uppercase font-extrabold tracking-widest text-brand-coral">Trí tuệ nhân tạo</div>
                <h3 className="text-sm lg:text-xl font-bold lg:font-extrabold text-foreground flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-brand-coral lg:hidden"></span>
                  Sáng tạo Content AI
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground max-w-md leading-relaxed">
                  Tự động tạo các bài viết bán hàng thôi miên trên Facebook để kéo traffic về Bio Link của bạn.
                </p>
              </div>
              <div className="hidden lg:flex bg-background/80 rounded-2xl p-4 border border-border flex-col gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-[9px] text-muted-foreground flex items-center justify-between">
                  <span>Prompt: "Viết bài tiếp thị Canva Template..."</span>
                  <span className="bg-brand-coral/20 text-brand-coral font-bold px-1.5 py-0.5 rounded text-[8px] font-mono">Gemini Pro</span>
                </div>
                <div className="text-[9px] text-muted-foreground italic line-clamp-2 leading-relaxed">
                  "🚀 Mở khóa kho Canva 500+ Mẫu thiết kế bán hàng kéo thả, tạo banner Shopee/Facebook siêu lung linh..."
                </div>
              </div>
            </Card>
          </TiltCard>
        </div>

        {/* Top Creators Showroom (Desktop only for brevity, or we can keep it responsive) */}
        <div className="hidden lg:block w-full max-w-5xl pt-20 pb-8 text-center space-y-8 mx-auto">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Nhà sáng tạo tiêu biểu</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">Cộng Đồng QuickBio MMO Thịnh Vượng</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">Hàng ngàn Creator, Marketer đang xây dựng nguồn thu nhập thụ động bền vững từ sản phẩm số mỗi ngày.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Nguyễn Tiến Luân', role: 'MMO Marketer', earning: '34.8Mđ', desc: 'Đã bán 500+ bộ Prompt ChatGPT & Canva Templates.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Khánh Vy', role: 'Content Creator', earning: '18.5Mđ', desc: 'Kiếm thu nhập thụ động từ việc chia sẻ file PDF bài giảng cực kỳ đơn giản.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Hoàng Minh', role: 'Designer / Freelancer', earning: '22.4Mđ', desc: 'Tuyển 50+ CTV cùng phân phối bộ preset chỉnh ảnh Lightroom cao cấp.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80' }
            ].map((creator, idx) => (
              <TiltCard key={idx} className="rounded-3xl">
                <Card className="p-6 space-y-4 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 h-full">
                  <div className="flex items-center gap-4">
                    <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover border border-border pointer-events-none" />
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-foreground">{creator.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{creator.role}</p>
                    </div>
                    <div className="ml-auto bg-brand-orange/15 border border-brand-orange/25 text-brand-orange text-xs font-black px-2.5 py-1 rounded-xl">
                      +{creator.earning}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed text-left">{creator.desc}</p>
                </Card>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Pricing Table Section */}
        <div id="pricing" className="w-full max-w-5xl pt-8 lg:pt-24 lg:pb-12 text-center space-y-6 lg:space-y-12 mx-auto">
          <div className="space-y-2 lg:space-y-4">
            <h3 className="text-lg lg:text-3xl font-extrabold text-foreground">
              <span className="hidden lg:inline">Bắt Đầu Tạo Thu Nhập Ngay Hôm Nay</span>
              <span className="lg:hidden">Bảng Giá Dịch Vụ</span>
            </h3>
            <p className="text-xs lg:text-sm text-muted-foreground max-w-xl mx-auto">
              Lựa chọn gói dịch vụ phù hợp nhất với nhu cầu kinh doanh sản phẩm số của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 max-w-3xl mx-auto">
            {/* Gói Free */}
            <Card className="p-6 lg:p-8 text-left space-y-4 lg:space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-border hover:shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center lg:block">
                  <h4 className="text-sm lg:text-lg font-bold text-foreground">QuickBio Free</h4>
                  <span className="text-lg font-black text-foreground lg:hidden">0đ</span>
                  <p className="hidden lg:block text-xs text-muted-foreground mt-1">Dành cho người mới bắt đầu trải nghiệm MMO.</p>
                </div>
                <div className="hidden lg:flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">0đ</span>
                  <span className="text-xs text-muted-foreground">/ trọn đời</span>
                </div>
                <ul className="space-y-2 lg:space-y-3 pt-0 lg:pt-4 lg:border-t border-border text-[11px] lg:text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Tạo 1 trang Bio-Link cơ bản</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Đăng tối đa 1 sản phẩm số</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground lg:text-muted-foreground">
                    <span className="hidden lg:inline">✗</span>
                    <span className="lg:hidden">✗ Không có Sáng tạo AI (Gemini)</span>
                    <span className="hidden lg:inline">Không có Sáng tạo AI (Gemini)</span>
                  </li>
                  <li className="hidden lg:flex items-center gap-2 text-muted-foreground">
                    <span>✗</span>
                    <span>Không có hệ thống CTV Affiliate</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={handleStart}
                variant="secondary"
                className="w-full lg:mt-8"
              >
                Trải nghiệm miễn phí
              </Button>
            </Card>

            {/* Gói Pro */}
            <Card className="p-6 lg:p-8 border-brand-orange/30 text-left space-y-4 lg:space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:border-brand-orange/50 hover:shadow-2xl hover:shadow-brand-orange/5 bg-gradient-to-b from-brand-orange/5 via-transparent to-transparent">
              <div className="hidden lg:block absolute top-0 right-0 bg-brand-orange text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Phổ biến nhất
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center lg:block">
                  <h4 className="text-sm lg:text-lg font-bold text-foreground flex items-center gap-1.5 lg:gap-2">
                    QuickBio Pro
                    <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-brand-orange" />
                  </h4>
                  <span className="text-lg font-black text-brand-orange lg:hidden">99.000đ<span className="text-[10px] text-muted-foreground font-normal">/th</span></span>
                  <p className="hidden lg:block text-xs text-muted-foreground mt-1">Đầy đủ vũ khí MMO đỉnh cao để kiếm tiền thụ động.</p>
                </div>
                <div className="hidden lg:flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">99.000đ</span>
                  <span className="text-xs text-muted-foreground">/ tháng</span>
                </div>
                <ul className="space-y-2 lg:space-y-3 pt-0 lg:pt-4 lg:border-t border-brand-orange/10 text-[11px] lg:text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Đăng bán sản phẩm KHÔNG giới hạn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Sáng tạo Content Tự động (Gemini AI Pro)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Bật Affiliate tuyển CTV không giới hạn</span>
                  </li>
                  <li className="hidden lg:flex items-center gap-2">
                    <span className="text-brand-orange font-bold">✓</span>
                    <span>Hỗ trợ thiết kế tên miền riêng (Sắp ra mắt)</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={handleStart}
                className="w-full lg:mt-8 shadow-md shadow-brand-orange/10"
              >
                Nâng cấp Pro ngay
              </Button>
            </Card>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="w-full max-w-4xl pt-8 lg:pt-20 pb-12 text-center space-y-4 lg:space-y-12 mx-auto">
          <div className="space-y-1 lg:space-y-4">
            <span className="hidden lg:block text-[10px] uppercase font-extrabold tracking-widest text-brand-orange">Hỏi đáp thắc mắc</span>
            <h3 className="text-base lg:text-3xl font-extrabold text-foreground">Hỏi đáp thắc mắc</h3>
            <p className="text-[11px] lg:text-sm text-muted-foreground max-w-xl mx-auto">Giải đáp nhanh về QuickBio.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 lg:space-y-4 text-left">
            {[
              { q: 'Hệ thống đối soát tự động qua SePay vận hành thế nào?', a: 'Khi có khách hàng quét mã VietQR để mua sản phẩm, hệ thống SePay sẽ tự động phát hiện biến động số dư tài khoản của bạn thông qua API trong vòng 1-2 giây. QuickBio sẽ lập tức xác thực giao dịch, hiển thị link tải trực tiếp cho khách và tự động gửi email đính kèm file gốc cho khách.' },
              { q: 'Tôi có phải chia sẻ doanh thu từ sản phẩm cho QuickBio không?', a: 'Không! Với tài khoản của bạn, dòng tiền quét mã VietQR chuyển khoản sẽ chảy trực tiếp 100% vào tài khoản ngân hàng cá nhân của chính bạn. Chúng tôi không qua trung gian giam vốn và không thu bất kỳ phí chiết khấu giao dịch nào.' },
              { q: 'Hệ thống Affiliate ăn chia hoa hồng CTV tự động hoạt động thế nào?', a: 'Bạn có thể tuyển CTV quảng bá sản phẩm cho mình. Khi CTV chia sẻ link Bio kèm mã giới thiệu (ref) của họ, hệ thống sẽ tự động ghi nhận cookie của trình duyệt. Nếu khách mua bất kỳ sản phẩm nào trên Bio, hoa hồng sẽ tự động được ghi nhận vào tài khoản CTV của họ và bạn đối soát duyệt thanh toán dễ dàng tại Dashboard.' },
              { q: 'QuickBio Pro có giá bao nhiêu và tôi có được hủy gói không?', a: 'Gói Pro có phí là 99.000đ/tháng mở khóa toàn bộ tính năng bán hàng không giới hạn, CTV Affiliate và trợ lý AI Gemini. Bạn có thể gia hạn theo tháng hoặc hủy bất cứ lúc nào ngay tại giao diện quản trị.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-card/40 rounded-xl lg:rounded-2xl border border-border overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 lg:px-6 py-4 flex items-center justify-between text-foreground font-bold text-xs lg:text-sm hover:bg-muted/50.02] transition-colors text-left"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ml-2 ${openFaq === idx ? 'transform rotate-180 text-brand-orange' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? 'max-h-40 border-t border-border' : 'max-h-0'}`}>
                  <p className="px-4 lg:px-6 py-3 lg:py-4 text-[11px] lg:text-xs text-muted-foreground leading-relaxed bg-background/30">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border mt-16 lg:mt-24 py-6 lg:py-8 text-center text-muted-foreground text-[11px] lg:text-sm">
        <p>© 2026 QuickBio. All rights reserved.</p>
      </footer>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) - Hidden on lg */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border px-2 py-2 pb-safe-bottom shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto h-14">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Trang chủ</span>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Layers className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Tính năng</span>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-brand-orange transition-colors min-w-[60px] h-full"
          >
            <Tag className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Bảng giá</span>
          </button>
          
          <button 
            onClick={handleStart}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-brand-orange transition-colors min-w-[60px] h-full"
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
