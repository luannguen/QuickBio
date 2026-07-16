import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Calculator, 
  Landmark, 
  CheckCircle, 
  ArrowLeft, 
  Send,
  Mail,
  Zap,
  DollarSign
} from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { GlobalHeader } from "@/shared/components/layout/GlobalHeader";

interface KiemTienPageProps {
  onNavigateToLanding: () => void;
}

export const KiemTienPage: React.FC<KiemTienPageProps> = ({ onNavigateToLanding }) => {
  // States cho công cụ tính toán thu nhập
  const [salesPerDay, setSalesPerDay] = useState(5);
  const [avgPrice, setAvgPrice] = useState(50000);
  
  // States cho bộ tạo link affiliate
  const [affCode, setAffCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  // Tính toán kết quả MMO
  // Hoa hồng Affiliate của QuickBio là 50% cho gói Pro (99.000đ)
  // Nếu tự bán sản phẩm số của mình thì hưởng 100% doanh thu (trừ phí SePay ~0.5%)
  const monthlyRevenueSelf = salesPerDay * avgPrice * 30;
  const monthlyRevenueAff = salesPerDay * 49500 * 30; // 50% của 99k Pro

  // Sinh link giới thiệu
  const cleanCode = affCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const baseUrl = window.location.origin;
  const affUrl = cleanCode ? `${baseUrl}?ref=${cleanCode}` : baseUrl;

  // Bài viết mẫu tiếp thị chốt đơn
  const samplePost = `🚀 [CỖ MÁY KIẾM TIỀN TỰ ĐỘNG 24/7] BÁN SẢN PHẨM SỐ TRONG 3 GIÂY!

Mọi người có bao giờ mệt mỏi khi bán Ebook, Template Canva, hay tài liệu mà cứ phải:
❌ Túc trực check tin nhắn đối soát tiền chuyển khoản thủ công?
❌ Khách chuyển khoản xong phải lọ mọ tìm link Drive để gửi?
❌ Trôi tin nhắn lúc nửa đêm làm mất khách?

Em vừa tìm ra một công cụ cực kỳ đỉnh cao của Việt Nam: QuickBio!

Chỉ cần 1 phút thiết lập:
✅ Tự động tạo mã VietQR khớp số tài khoản cá nhân của bạn.
✅ Khách quét mã thanh toán phát, tiền về tài khoản ngân hàng của bạn ngay lập tức.
✅ Hệ thống tự động bắn file tải về Email khách sau đúng 3 giây!
✅ Chạy phăm phăm kể cả lúc 2h sáng khi mình đang ngủ.

Đặc biệt nền tảng đang cho dùng thử miễn phí 100%!
Ai đang bán template Canva, Ebook, khóa học hay muốn làm đại lý nhận 50% hoa hồng trọn đời thì vào đây tạo thử nhé:
👉 ${affUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(samplePost);
    setCopiedPost(true);
    setTimeout(() => setCopiedPost(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affUrl)}`, '_blank');
  };

  const handleShareZalo = () => {
    window.open(`https://sp.zalo.me/share_to_zalo?url=${encodeURIComponent(affUrl)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white overflow-hidden relative selection:bg-brand-orange selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-coral/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#080B11]/80 backdrop-blur-md border-b border-white/5">
        <GlobalHeader 
          onNavigateToHome={onNavigateToLanding}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16 relative">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-orange text-sm font-medium animate-pulse">
            <Sparkles className="w-4 h-4" />
            Chương Trình Kiếm Tiền Thụ Động Cùng QuickBio
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Chia Sẻ <span className="bg-gradient-to-r from-brand-orange to-brand-coral bg-clip-text text-transparent">QuickBio</span>, <br />
            Rinh Về <span className="text-green-400">50% Hoa Hồng</span> Trọn Đời
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Hỗ trợ KOC, Freelancer và Creator xây dựng cỗ máy bán hàng số tự động 24/7. Nhận hoa hồng trọn đời cực khủng khi giới thiệu người dùng nâng cấp gói Pro.
          </p>
        </section>

        {/* Calculator Section */}
        <Card className="p-6 md:p-8 relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 p-4 bg-brand-orange/10 rounded-bl-3xl border-l border-b border-brand-dark/20 flex items-center gap-1.5 text-xs text-brand-orange font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            Công cụ tính MMO
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Bảng Tính Thu Nhập Ước Tính
            </h2>
            <p className="text-sm text-white/50">
              Kéo thanh trượt bên dưới để ước lượng số tiền bạn có thể tạo ra tự động mỗi tháng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Sliders */}
            <div className="space-y-6">
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Số đơn hàng phát sinh/ngày:</span>
                  <span className="font-bold text-brand-orange">{salesPerDay} đơn</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={salesPerDay} 
                  onChange={(e) => setSalesPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>1 đơn</span>
                  <span>100 đơn</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Giá bán sản phẩm (hoặc giá gói):</span>
                  <span className="font-bold text-brand-orange">{avgPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <input 
                  type="range" 
                  min="20000" 
                  max="500000" 
                  step="10000"
                  value={avgPrice} 
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>20.000đ</span>
                  <span>500.000đ</span>
                </div>
              </div>
            </div>

            {/* Display Profit */}
            <div className="bg-[#0b101b] border border-white/5 rounded-2xl p-6 flex flex-col justify-center space-y-6">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Nếu bạn tự bán sản phẩm số của mình:</div>
                <div className="text-3xl font-black text-white mt-1">
                  {monthlyRevenueSelf.toLocaleString('vi-VN')}đ <span className="text-sm font-normal text-white/50">/ tháng</span>
                </div>
                <div className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-brand-orange" />
                  Tiền chuyển thẳng vào ngân hàng cá nhân qua VietQR.
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Nếu bạn làm CTV giới thiệu gói Pro (50% hoa hồng):</div>
                <div className="text-3xl font-black text-green-400 mt-1">
                  {monthlyRevenueAff.toLocaleString('vi-VN')}đ <span className="text-sm font-normal text-white/50">/ tháng</span>
                </div>
                <div className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                  Rút hoa hồng dễ dàng bất cứ lúc nào.
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Fast Share Section */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Custom Link Generator */}
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-orange" />
              1. Tạo Link Tiếp Thị Của Bạn
            </h3>
            <p className="text-sm text-white/60">
              Nhập mã đối tác (Affiliate Code) của bạn để hệ thống tự động chèn vào link chia sẻ và bài viết tiếp thị.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Nhập mã đối tác của bạn</Label>
                <Input 
                  type="text" 
                  value={affCode}
                  onChange={(e) => setAffCode(e.target.value)}
                  placeholder="Ví dụ: luannguyen"
                  className="mb-1.5"
                />
                <span className="text-[10px] text-semantic-muted block">Lấy mã này trong phần "Kiếm tiền (Affiliate)" tại Dashboard của bạn.</span>
              </div>

              <div className="bg-[#0b101b] border border-white/5 p-4 rounded-xl space-y-2">
                <div className="text-xs text-white/40 uppercase font-semibold">Đường link tiếp thị của bạn:</div>
                <div className="text-xs font-semibold text-brand-orange truncate tracking-wide">
                  {affUrl}
                </div>
              </div>

              {/* Share Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleShareFacebook}
                  className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2]"
                >
                  <svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Chia sẻ FB
                </Button>
                <Button 
                  onClick={handleShareZalo}
                  className="bg-[#0068FF]/10 hover:bg-[#0068FF]/20 border border-[#0068FF]/20 text-[#0068FF]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Chia sẻ Zalo
                </Button>
              </div>

              <Button 
                onClick={handleCopyLink}
                variant="secondary"
                className="w-full py-6"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    Đã copy link thành công!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white/60" />
                    Copy đường link tiếp thị
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Copy Post Component */}
          <Card className="p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                2. Bài Đăng Facebook & Zalo Sẵn Có
              </h3>
              <p className="text-sm text-white/60">
                Bài viết chốt sale có tỷ lệ chuyển đổi cao đã chèn sẵn link tiếp thị của bạn. Chỉ cần nhấn copy và đăng bài lên mạng xã hội!
              </p>

              <div className="bg-[#0b101b] border border-white/5 p-4 rounded-xl h-44 overflow-y-auto text-xs text-white/70 whitespace-pre-line font-mono select-all scrollbar-thin">
                {samplePost}
              </div>
            </div>

            <Button 
              onClick={handleCopyPost}
              className="w-full py-6 transition-all duration-300 transform hover:scale-[1.01] shadow-lg shadow-brand-orange/15"
            >
              {copiedPost ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Đã copy toàn bộ bài viết!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy bài viết chốt sale ngay
                </>
              )}
            </Button>
          </Card>
        </section>

        {/* Benefits Cards Grid */}
        <section className="space-y-8 pt-4">
          <h3 className="text-2xl font-bold text-center">Tại sao nên kiếm tiền cùng QuickBio?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0c111d] border border-white/5 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Hoa hồng 50% trọn đời</h4>
              <p className="text-xs text-white/50 leading-relaxed">Nhận ngay một nửa doanh thu đăng ký trọn đời từ bất kỳ khách hàng nào nâng cấp qua link của bạn.</p>
            </div>
            
            <div className="bg-[#0c111d] border border-white/5 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Bán sản phẩm số tự động</h4>
              <p className="text-xs text-white/50 leading-relaxed">Tự tạo sản phẩm của riêng bạn để bán nhận tiền trực tiếp VietQR và tự động giao file về Email khách.</p>
            </div>

            <div className="bg-[#0c111d] border border-white/5 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold">Tối giản trong 60 giây</h4>
              <p className="text-xs text-white/50 leading-relaxed">Không cần biết lập trình. Giao diện thiết lập trực quan, kéo thả tức thì trên mọi thiết bị di động.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-16 text-center text-xs text-white/30">
        © 2026 QuickBio. Phát triển bởi Đội ngũ Công nghệ Antigravity.
      </footer>
    </div>
  );
};
