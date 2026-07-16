import React, { useState, useRef } from 'react';
import { 
  Phone, 
  Sparkles, 
  Zap, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  AlertCircle, 
  MessageSquare,
  Volume2
} from 'lucide-react';
import { useVapiStore } from "@/shared/hooks/store";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { GlobalHeader } from "@/shared/components/layout/GlobalHeader";

// ============================================================
// 1. TiltCard Component: Hiệu ứng Parallax 3D xoay theo con trỏ chuột
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
    
    // Chuẩn hoá toạ độ từ -0.5 đến 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    setCoords({ x: normX, y: normY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const rotateX = isHovered ? coords.y * -12 : 0; // Tối đa xoay 12 độ
  const rotateY = isHovered ? coords.x * 12 : 0;
  
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
      {/* Lớp phản chiếu ánh sáng bóng bẩy */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 107, 53, 0.08) 0%, transparent 60%)`,
          zIndex: 5
        }}
      />
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};

// ============================================================
// 2. VoiceOrb Component: Quả cầu 3D sinh học dạng lỏng (Liquid Orb) nhún nhảy theo âm lượng
// ============================================================
interface VoiceOrbProps {
  isActive: boolean;
  connecting: boolean;
  volume: number;
  onToggle: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isActive, connecting, volume, onToggle }) => {
  const baseScale = isActive ? 1.08 : 1.0;
  const scale = baseScale + volume * 0.45;

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Vòng hào quang phát sáng 3D */}
      <div 
        className="absolute w-44 h-44 rounded-full bg-brand-orange/15 blur-[55px] transition-all duration-300 animate-[pulse_4s_infinite]"
        style={{ transform: `scale(${scale})` }}
      />
      <div 
        className="absolute w-36 h-36 rounded-full bg-indigo-500/10 blur-[45px] transition-all duration-500 animate-[pulse_5s_infinite]"
        style={{ transform: `scale(${scale * 0.85})` }}
      />

      {/* Quả cầu chính */}
      <button 
        onClick={onToggle}
        aria-label={isActive ? 'Tắt cuộc gọi' : 'Bắt đầu cuộc gọi'}
        title={isActive ? 'Kết thúc cuộc gọi' : 'Trò chuyện cùng Lễ tân AI'}
        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-brand-orange via-brand-coral to-indigo-600 shadow-[inset_0_-8px_16px_rgba(0,0,0,0.5),0_12px_24px_rgba(255,107,53,0.3)] transition-all duration-150 flex items-center justify-center overflow-hidden border border-white/25 hover:border-white/40 cursor-pointer active:scale-95 group focus:outline-none focus:ring-4 focus:ring-brand-orange/30 z-10"
        style={{
          transform: `scale(${scale})`,
          animation: isActive ? 'liquidMorphActive 2.2s ease-in-out infinite' : 'liquidMorph 8s ease-in-out infinite'
        }}
      >
        {/* Phản xạ ánh sáng bề mặt */}
        <div className="absolute top-[8%] left-[8%] w-[25%] h-[25%] bg-white/25 rounded-full blur-[1px] pointer-events-none" />
        
        {/* Vòng xoay holographic bên trong */}
        <div className="absolute w-[85%] h-[85%] rounded-full border border-white/10 animate-[spin_12s_linear_infinite] pointer-events-none" />
        <div className="absolute w-[65%] h-[65%] rounded-full border border-white/5 animate-[spin_8s_linear_infinite_reverse] pointer-events-none" />

        {/* Nội dung trung tâm */}
        <div className="z-20 text-white flex flex-col items-center justify-center pointer-events-none">
          {connecting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isActive ? (
            <div className="flex items-end gap-1 h-8">
              {[...Array(3)].map((_, i) => {
                const sensitivity = [12, 22, 14][i];
                const height = Math.min(26, 12 + volume * sensitivity);
                return (
                  <div 
                    key={i} 
                    className="w-1 bg-white rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          ) : (
            <Volume2 className="w-8 h-8 text-white animate-pulse" />
          )}
        </div>
      </button>

      <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold mt-4 animate-pulse select-none">
        {connecting ? 'Đang kết nối...' : isActive ? 'Bấm để gác máy ❌' : 'Bấm quả cầu để alo AI 📞'}
      </span>

      <style>{`
        @keyframes liquidMorph {
          0%, 100% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
          33% { border-radius: 42% 58% 68% 32% / 42% 48% 58% 52%; }
          66% { border-radius: 58% 42% 32% 68% / 48% 58% 42% 52%; }
        }
        @keyframes liquidMorphActive {
          0%, 100% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
          25% { border-radius: 38% 62% 62% 38% / 48% 48% 52% 52%; }
          50% { border-radius: 62% 38% 38% 62% / 40% 60% 40% 60%; }
          75% { border-radius: 46% 54% 54% 46% / 54% 40% 60% 40%; }
        }
      `}</style>
    </div>
  );
};

interface AIVoiceLandingPageProps {
  onNavigateToHome: () => void;
}

export const AIVoiceLandingPage: React.FC<AIVoiceLandingPageProps> = ({ onNavigateToHome }) => {
  const { 
    isCallActive, 
    connecting, 
    volume, 
    triggerStart, 
    triggerStop 
  } = useVapiStore();

  // States cho bộ tạo cuộc gọi Outbound Demo
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [outboundLoading, setOutboundLoading] = useState(false);
  const [outboundSuccess, setOutboundSuccess] = useState('');
  const [outboundError, setOutboundError] = useState('');

  // States cho bộ tạo link affiliate giới thiệu
  const [affCode, setAffCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState<number | null>(null);

  const baseUrl = window.location.origin;
  const cleanCode = affCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const refUrl = cleanCode ? `${baseUrl}/tong-dai-ai?ref=${cleanCode}` : `${baseUrl}/tong-dai-ai`;

  const handleToggleCall = () => {
    if (isCallActive) {
      triggerStop();
    } else {
      triggerStart();
    }
  };

  // Xử lý kích hoạt cuộc gọi AI Outbound gọi lại
  const handleTriggerOutboundCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setOutboundError('Vui lòng điền đầy đủ họ tên và số điện thoại.');
      return;
    }

    setOutboundLoading(true);
    setOutboundSuccess('');
    setOutboundError('');

    try {
      const response = await fetch('/api/vapi-outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName.trim(),
          phone: customerPhone.trim()
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOutboundSuccess('Đang kết nối! Điện thoại của bạn sẽ đổ chuông sau 3 - 5 giây nữa. Hãy nhấc máy trò chuyện cùng AI Lễ Tân nhé! 📞');
        setCustomerName('');
        setCustomerPhone('');
      } else {
        setOutboundError(data.message || 'Lỗi gửi yêu cầu gọi điện. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setOutboundError('Đường truyền mạng bị lỗi. Vui lòng thử lại sau.');
    } finally {
      setOutboundLoading(false);
    }
  };

  // Sao chép link tiếp thị
  const handleCopyLink = () => {
    navigator.clipboard.writeText(refUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  // Danh sách các bài viết tiếp thị virus đỉnh cao để copy chia sẻ
  const viralPosts = [
    {
      title: "Kịch bản 1: Chia sẻ Kể chuyện (Storytelling - Dành cho Facebook/Threads)",
      content: `🔥 CÁCH TÔI BIẾN CHIẾC HOTLINE ĐANG "BẬN RỘN" THÀNH CỖ MÁY CHỐT LỊCH TỰ ĐỘNG 24/7!

Là chủ Spa/Phòng khám, có bao giờ bạn gặp tình cảnh:
❌ Khách gọi điện đặt lịch hẹn lúc 10h đêm khi lễ tân đã về nghỉ?
❌ Đang làm răng/chăm sóc khách, điện thoại reo mà không thể nhấc máy?
❌ Khách chuyển khoản xong phải lọ mọ chụp bill gửi Zalo đối soát?

Bên em vừa hoàn thiện thành công giải pháp: LỄ TÂN AI VOICE TỔNG ĐÀI TIẾNG VIỆT 🎙️
Trải nghiệm trực tiếp cực kỳ gây sốc tại đây:
👉 ${refUrl}

Không chỉ nghe điện thoại và nói chuyện mượt mà như người thật, em nó còn tự biết:
✅ Hỏi ngày giờ rảnh -> tự tra cứu dữ liệu thời gian thực.
✅ Nhận diện giọng nói tiếng Việt cực chuẩn, bất kể vùng miền.
✅ Đọc to số tài khoản & mã VietQR tương ứng để khách chuyển khoản tự động.
✅ Tự đồng bộ lịch hẹn vào Google Calendar của chủ tiệm ngay lập tức!

Bấm vào link dưới đây, click nút điện thoại màu cam ở góc màn hình để nói chuyện thử với robot lễ tân hoàn toàn miễn phí nhé! 🚀
👉 ${refUrl}`
    },
    {
      title: "Kịch bản 2: Đánh thẳng Nỗi đau (Pain-point - Kích thích chủ tiệm tò mò)",
      content: `⚠️ BẠN ĐANG VỨT TIỀN QUA CỬA SỔ VÌ BỎ LỠ 60% CUỘC GỌI ĐẶT LỊCH HẸN?

Theo thống kê, hơn một nửa số cuộc gọi đặt lịch cho Nha khoa, Spa, Salon bị bỏ lỡ vào khung giờ nghỉ trưa, sau 8h tối, hoặc khi lễ tân bận tiếp khách trực tiếp. Khách hàng không đợi được sẽ gọi cho đối thủ ngay lập tức!

Giải pháp tối ưu chi phí: Lễ tân ảo AI trực hotline 24/7.
✅ Chi phí nghe máy chỉ bằng 1/10 lương nhân viên.
✅ Trực suốt ngày đêm, không bao giờ biết mệt mỏi hay thái độ với khách.
✅ Tự check giờ trống, ghi lịch và gửi mã VietQR thanh toán tự động qua điện thoại.

Thử nghiệm công nghệ gọi lại thông minh: Bạn chỉ cần nhập số điện thoại trên web, AI sẽ tự động gọi vào máy bạn để tư vấn thử!
Trải nghiệm thử tại đây:
👉 ${refUrl}`
    },
    {
      title: "Kịch bản 3: Cơ hội kinh doanh kiếm tiền (MMO & Cộng tác viên)",
      content: `💸 CƠ HỘI BẮT TAY KIẾM TIỀN THỤ ĐỘNG CÙNG LỄ TÂN AI VOICE TỔNG ĐÀI!

Công nghệ AI thoại (Voice Agent) tiếng Việt đang bùng nổ. Tất cả các phòng khám nha khoa, spa, tiệm tóc đều đang khát giải pháp trực hotline tự động để giảm tải nhân sự và tối ưu doanh số.

Bên em đã tích hợp giải pháp này vào QuickBio:
1. Bạn có thể giới thiệu giải pháp tổng đài AI cho các chủ phòng khám/spa quen biết.
2. Khi họ đăng ký lắp đặt qua link giới thiệu của bạn, bạn được nhận ngay 50% HOA HỒNG TRỌN ĐỜI!
3. Nhận file tài liệu, kịch bản mẫu và được kỹ thuật hỗ trợ kết nối từ A-Z.

👉 Lấy link giới thiệu và trải nghiệm nói chuyện thử với AI tại đây:
👉 ${refUrl}`
    }
  ];

  const handleCopyPost = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPost(index);
    setTimeout(() => setCopiedPost(null), 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080B11] text-white bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-40 bg-[#080B11]/80 backdrop-blur-md border-b border-white/5">
        <GlobalHeader 
          onNavigateToHome={onNavigateToHome}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-24 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-semibold text-brand-orange">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Xu Hướng Công Nghệ AI Đột Phá 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Tổng Đài Lễ Tân AI<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-coral">Tự Động Nghe & Chốt Lịch 24/7</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 leading-relaxed">
            Giải pháp tích hợp giọng nói trí tuệ nhân tạo tiếng Việt chuyên nghiệp dành riêng cho Nha Khoa, Spa, Salon. Tự động nhận diện cuộc gọi đặt lịch, đối soát lịch trống trên cơ sở dữ liệu và sinh mã VietQR chuyển khoản tự động.
          </p>

          {/* 3D Liquid voice orb demo */}
          <VoiceOrb 
            isActive={isCallActive}
            connecting={connecting}
            volume={volume}
            onToggle={handleToggleCall}
          />
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard className="rounded-2xl">
            <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer h-full">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Làm Việc 24/7 Không Nghỉ</h3>
              <p className="text-xs text-white/50 leading-relaxed">Không bao giờ bỏ lỡ cuộc gọi đặt lịch của khách hàng, kể cả ngoài giờ làm việc, đêm khuya hay ngày nghỉ lễ.</p>
            </div>
          </TiltCard>

          <TiltCard className="rounded-2xl">
            <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer h-full">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Tra Lịch Trống Real-time</h3>
              <p className="text-xs text-white/50 leading-relaxed">Tự kết nối với cơ sở dữ liệu để tìm kiếm các khung giờ còn trống trong ngày và đề xuất trực tiếp cho khách chọn.</p>
            </div>
          </TiltCard>

          <TiltCard className="rounded-2xl">
            <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer h-full">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Báo Thanh Toán VietQR</h3>
              <p className="text-xs text-white/50 leading-relaxed">Tính tiền dịch vụ và đọc to thông tin chuyển khoản cùng mã giao dịch thông minh để khách quét mã đối soát tự động.</p>
            </div>
          </TiltCard>
        </section>

        {/* Outbound Call Demo Section */}
        <TiltCard className="rounded-3xl max-w-xl mx-auto">
          <section className="bg-gradient-to-b from-[#0f1422] to-[#080b11] border border-white/10 p-8 rounded-3xl space-y-8 shadow-2xl relative backdrop-blur-md">
            <div className="absolute top-4 right-4 text-xs font-bold text-brand-orange/40">DEMO TRỰC TIẾP</div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Hãy Để AI Gọi Điện Cho Bạn!</h2>
              <p className="text-xs text-white/50">Nhập thông tin bên dưới, hệ thống sẽ thực hiện cuộc gọi Outbound gọi trực tiếp vào máy của bạn để demo nói chuyện cùng AI.</p>
            </div>

            <form onSubmit={handleTriggerOutboundCall} className="space-y-4">
              <div>
                <Label className="mb-1.5 text-white/50">Tên Của Bạn</Label>
                <Input 
                  type="text" 
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-1.5 text-white/50">Số Điện Thoại Nhận Cuộc Gọi</Label>
                <Input 
                  type="tel" 
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              {outboundError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{outboundError}</span>
                </div>
              )}

              {outboundSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl leading-relaxed">
                  {outboundSuccess}
                </div>
              )}

              <Button
                type="submit"
                disabled={outboundLoading}
                className="w-full py-6"
              >
                {outboundLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Đang kết nối cuộc gọi...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    <span>AI Gọi Cho Tôi Trải Nghiệm Ngay!</span>
                  </>
                )}
              </Button>
            </form>
          </section>
        </TiltCard>

        {/* Affiliate Link Generator Section */}
        <TiltCard className="rounded-3xl">
          <section className="bg-[#0a0f1d]/85 border border-white/10 p-8 rounded-3xl space-y-6 backdrop-blur-md shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-brand-orange" />
                  <span>Chia sẻ dự án - Nhận 50% hoa hồng</span>
                </h2>
                <p className="text-xs text-white/50 leading-relaxed">Tạo đường link giới thiệu của riêng bạn, chia sẻ lên mạng xã hội. Nếu có bất kỳ khách hàng nào đăng ký dịch vụ lễ tân tổng đài AI qua link này, bạn sẽ nhận được 50% doanh thu giới thiệu.</p>
              </div>
              
              <div className="w-full md:w-auto flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Nhập mã CTV của bạn..."
                  value={affCode}
                  onChange={(e) => setAffCode(e.target.value)}
                  className="w-full md:w-48"
                />
                <Button
                  onClick={handleCopyLink}
                  className={`shrink-0 ${copiedLink ? 'bg-semantic-success hover:bg-semantic-success text-white' : ''}`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>Đã Copy!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-xs text-white/40 break-all font-mono">
              <span>{refUrl}</span>
            </div>
          </section>
        </TiltCard>

        {/* Viral Marketing Swipe Files */}
        <section className="space-y-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
              <MessageSquare className="w-5 h-5 text-brand-orange" />
              <span>Kho Bài Viết Tiếp Thị (Viral Copywriting)</span>
            </h2>
            <p className="text-xs text-white/50">Copy nhanh các mẫu kịch bản bài viết tiếp thị virus bên dưới kèm link giới thiệu của bạn để đăng lên Threads, Facebook thu hút khách hàng quan tâm.</p>
          </div>

          <div className="space-y-6">
            {viralPosts.map((post, index) => (
              <div key={index} className="bg-[#0a0f1d]/80 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-brand-orange/20 transition-colors duration-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h4 className="text-sm font-bold text-brand-orange">{post.title}</h4>
                  <Button
                    onClick={() => handleCopyPost(post.content, index)}
                    variant="secondary"
                    className={copiedPost === index ? 'bg-semantic-success text-white hover:bg-semantic-success' : ''}
                  >
                    {copiedPost === index ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        <span>Đã Copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        <span>Copy Bài</span>
                      </>
                    )}
                  </Button>
                </div>
                <pre className="text-xs text-white/70 leading-relaxed font-sans whitespace-pre-wrap bg-black/20 p-4 rounded-2xl border border-white/5 overflow-x-auto max-h-64">
                  {post.content}
                </pre>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/30 relative z-10">
        © 2026 QuickBio AI Voice. Phát triển bởi Đội ngũ Công nghệ Antigravity.
      </footer>
    </div>
  );
};
