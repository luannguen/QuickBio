import React, { useState } from 'react';
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

interface AIVoiceLandingPageProps {
  onNavigateToHome: () => void;
}

export const AIVoiceLandingPage: React.FC<AIVoiceLandingPageProps> = ({ onNavigateToHome }) => {
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
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <button 
          onClick={onNavigateToHome}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại Trang chủ</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-lg flex items-center justify-center">
            <Volume2 className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            QuickBio AI Voice
          </span>
        </div>
      </header>

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

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="bg-[#0f1422]/90 border border-brand-orange/20 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-brand-orange/5 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              <span className="text-xs font-bold text-brand-orange">Alo nói chuyện thử với Lễ Tân AI ở góc dưới màn hình! 👇</span>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Làm Việc 24/7 Không Nghỉ</h3>
            <p className="text-xs text-white/50 leading-relaxed">Không bao giờ bỏ lỡ cuộc gọi đặt lịch của khách hàng, kể cả ngoài giờ làm việc, đêm khuya hay ngày nghỉ lễ.</p>
          </div>

          <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Tra Lịch Trống Real-time</h3>
            <p className="text-xs text-white/50 leading-relaxed">Tự kết nối với cơ sở dữ liệu để tìm kiếm các khung giờ còn trống trong ngày và đề xuất trực tiếp cho khách chọn.</p>
          </div>

          <div className="bg-[#0c111d]/50 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-brand-orange/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-300 ease-out cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Báo Thanh Toán VietQR</h3>
            <p className="text-xs text-white/50 leading-relaxed">Tính tiền dịch vụ và đọc to thông tin chuyển khoản cùng mã giao dịch thông minh để khách quét mã đối soát tự động.</p>
          </div>
        </section>

        {/* Outbound Call Demo Section */}
        <section className="bg-gradient-to-b from-[#0f1422] to-[#080b11] border border-white/10 p-8 rounded-3xl space-y-8 max-w-xl mx-auto shadow-2xl relative backdrop-blur-md">
          <div className="absolute top-4 right-4 text-xs font-bold text-brand-orange/40">DEMO TRỰC TIẾP</div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">Hãy Để AI Gọi Điện Cho Bạn!</h2>
            <p className="text-xs text-white/50">Nhập thông tin bên dưới, hệ thống sẽ thực hiện cuộc gọi Outbound gọi trực tiếp vào máy của bạn để demo nói chuyện cùng AI.</p>
          </div>

          <form onSubmit={handleTriggerOutboundCall} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-white/50 mb-1.5">Tên Của Bạn</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-white/50 mb-1.5">Số Điện Thoại Nhận Cuộc Gọi</label>
              <input 
                type="tel" 
                placeholder="Ví dụ: 0912345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-200"
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

            <button
              type="submit"
              disabled={outboundLoading}
              className="w-full py-3.5 bg-gradient-to-tr from-brand-orange to-brand-coral hover:shadow-lg hover:shadow-brand-orange/15 text-white font-bold rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 touch-target"
            >
              {outboundLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang kết nối cuộc gọi...</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>AI Gọi Cho Tôi Trải Nghiệm Ngay!</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Affiliate Link Generator Section */}
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
              <input 
                type="text" 
                placeholder="Nhập mã CTV của bạn..."
                value={affCode}
                onChange={(e) => setAffCode(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-200 w-full md:w-48"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${copiedLink ? 'bg-green-500 text-white' : 'bg-brand-orange hover:bg-brand-coral text-white active:scale-95'}`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã Copy!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-xs text-white/40 break-all font-mono">
            <span>{refUrl}</span>
          </div>
        </section>

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
                  <button
                    onClick={() => handleCopyPost(post.content, index)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${copiedPost === index ? 'bg-green-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/80 active:scale-95'}`}
                  >
                    {copiedPost === index ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Đã Copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Bài</span>
                      </>
                    )}
                  </button>
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
