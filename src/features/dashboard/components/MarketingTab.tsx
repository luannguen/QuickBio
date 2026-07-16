import type { Product } from "@/entities/product/api";
import { BookOpen, Sparkles, Users, ShoppingBag } from 'lucide-react';
import { useToastStore } from "@/shared/stores/useToastStore";

interface MarketingTabProps {
  mktFbPageId: string;
  onMktFbPageIdChange: (val: string) => void;
  mktTargetProductId: string;
  onMktTargetProductIdChange: (val: string) => void;
  mktFbPageToken: string;
  onMktFbPageTokenChange: (val: string) => void;
  mktStyle: string;
  onMktStyleChange: (val: string) => void;
  mktGeminiApiKey: string;
  onMktGeminiApiKeyChange: (val: string) => void;
  mktSaving: boolean;
  onSaveMarketingSettings: (e: React.FormEvent) => void;
  mktLastPostedAt: string;
  mktIsActive: boolean;
  onMktIsActiveChange: (val: boolean) => void;
  onTestAutoPost: () => void;
  mktTesting: boolean;
  mktTestSuccess: string;
  mktTestError: string;
  mktSubTab: 'autopost' | 'swipe';
  onMktSubTabChange: (val: 'autopost' | 'swipe') => void;
  products: Product[];
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
  mktFbPageId,
  onMktFbPageIdChange,
  mktTargetProductId,
  onMktTargetProductIdChange,
  mktFbPageToken,
  onMktFbPageTokenChange,
  mktStyle,
  onMktStyleChange,
  mktGeminiApiKey,
  onMktGeminiApiKeyChange,
  mktSaving,
  onSaveMarketingSettings,
  mktLastPostedAt,
  mktIsActive,
  onMktIsActiveChange,
  onTestAutoPost,
  mktTesting,
  mktTestSuccess,
  mktTestError,
  mktSubTab,
  onMktSubTabChange,
  products
}) => {
  const toast = useToastStore();
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-orange" />
            Hệ thống Tiếp thị Tự động (Marketing Automation)
          </h3>
          <p className="text-xs text-white/40 mt-1">Cấu hình tự động đăng bài bán hàng lên Facebook cá nhân/Page hoặc lấy kịch bản tiếp thị.</p>
        </div>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex border-b border-white/5 gap-2">
        <button 
          onClick={() => onMktSubTabChange('autopost')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            mktSubTab === 'autopost' 
              ? 'border-brand-orange text-brand-orange' 
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          🤖 Tự động đăng bài (Facebook Auto-Post)
        </button>
        <button 
          onClick={() => onMktSubTabChange('swipe')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            mktSubTab === 'swipe' 
              ? 'border-brand-orange text-brand-orange' 
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          📂 Thư viện Content Triệu View
        </button>
      </div>

      {/* SUBTAB 1: AUTOMATED FACEBOOK POSTING */}
      {mktSubTab === 'autopost' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Form Column */}
            <form onSubmit={onSaveMarketingSettings} className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 space-y-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cấu hình kết nối Facebook & AI</h4>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Kích hoạt Auto-Post tự động</div>
                  <div className="text-[10px] text-white/40 mt-0.5">Tự động đăng bài tiếp thị hàng ngày lên Facebook Page của bạn.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={mktIsActive}
                    onChange={(e) => onMktIsActiveChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/50 font-semibold mb-2">Facebook Page ID</label>
                  <input 
                    type="text" 
                    value={mktFbPageId}
                    onChange={(e) => onMktFbPageIdChange(e.target.value)}
                    placeholder="Nhập Page ID của bạn (Ví dụ: 10006394...)"
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                    required={mktIsActive}
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] text-white/50 font-semibold mb-2">Sản phẩm cần quảng bá chính</label>
                  <select 
                    value={mktTargetProductId}
                    onChange={(e) => onMktTargetProductIdChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                    required={mktIsActive}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    <option value="quickbio-platform">⭐ Quảng bá QuickBio (Nhận 50% hoa hồng Affiliate)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/50 font-semibold mb-2 flex items-center justify-between">
                  <span>Facebook Page Access Token (Mã kết nối)</span>
                  <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-orange underline">Hướng dẫn lấy token ↗</a>
                </label>
                <input 
                  type="password" 
                  value={mktFbPageToken}
                  onChange={(e) => onMktFbPageTokenChange(e.target.value)}
                  placeholder="EAAW..."
                  className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  required={mktIsActive}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/50 font-semibold mb-2">Phong cách viết bài của AI</label>
                  <select 
                    value={mktStyle}
                    onChange={(e) => onMktStyleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  >
                    <option value="Thuyết phục">Thuyết phục (AIDA/PAS)</option>
                    <option value="Hài hước">Hài hước & Cà khịa</option>
                    <option value="Giật gân">Giật gân & Gây tò mò</option>
                    <option value="Kể chuyện">Kể chuyện (Storytelling)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-white/50 font-semibold mb-2 flex items-center justify-between">
                    <span>Google Gemini API Key (Không bắt buộc)</span>
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-orange underline">Lấy API Key ↗</a>
                  </label>
                  <input 
                    type="password" 
                    value={mktGeminiApiKey}
                    onChange={(e) => onMktGeminiApiKeyChange(e.target.value)}
                    placeholder="Mặc định dùng API Key hệ thống"
                    className="w-full px-4 py-3 rounded-xl text-xs text-white glass-input"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={mktSaving}
                  className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50 touch-target min-h-[40px]"
                >
                  {mktSaving ? 'Đang lưu...' : 'Lưu cấu hình tiếp thị'}
                </button>
              </div>
            </form>

            {/* Actions & Status Column */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trạng thái & Kiểm thử</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-white/50">Tình trạng:</span>
                    <span className={`font-bold ${mktIsActive ? 'text-green-400' : 'text-white/30'}`}>
                      {mktIsActive ? 'Đang hoạt động' : 'Đang tắt'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-white/50">Đăng lần cuối:</span>
                    <span className="text-white">
                      {mktLastPostedAt ? new Date(mktLastPostedAt).toLocaleString('vi-VN') : 'Chưa đăng'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="text-[10px] text-white/50 leading-relaxed">
                    Nhấn nút dưới để bắt đầu gửi yêu cầu AI sinh bài đăng mới và trực tiếp đăng lên trang Facebook Page của bạn để kiểm tra cấu hình.
                  </div>
                  <button 
                    type="button"
                    onClick={onTestAutoPost}
                    disabled={mktTesting}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 touch-target min-h-[44px]"
                  >
                    {mktTesting ? 'Đang chạy thử...' : '🚀 Chạy thử đăng bài ngay'}
                  </button>
                </div>

                {mktTestSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] rounded-xl font-medium leading-relaxed animate-fade-in">
                    {mktTestSuccess}
                  </div>
                )}
                
                {mktTestError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-xl font-medium leading-relaxed animate-fade-in">
                    Lỗi test: {mktTestError}
                  </div>
                )}
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/5 bg-brand-orange/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  💡 Hướng dẫn cấu hình Facebook Page:
                </h4>
                <ol className="text-[10px] text-white/60 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>Truy cập <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline">Meta Developers</a> và tạo một App.</li>
                  <li>Thiết lập quyền truy cập Page (`pages_manage_posts`, `pages_read_engagement`).</li>
                  <li>Lấy **Page Access Token** trọn đời để dán vào cấu hình.</li>
                  <li>Khi lưu và bật hoạt động, Vercel Cron sẽ tự động kích hoạt đăng bài đều đặn mỗi ngày một lần cho bạn.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SWIPE FILES (MANUAL POSTING) */}
      {mktSubTab === 'swipe' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Ebook Prompt ChatGPT */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center border border-brand-orange/20">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                </div>
                <h4 className="font-bold text-sm text-white">Ebook: 100+ Prompt ChatGPT</h4>
                <p className="text-xs text-white/50 leading-relaxed">Bộ tài liệu thôi miên khách hàng giúp viết bài, làm kịch bản bán hàng trong 3 giây.</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    const content = `[KỊCH BẢN VIDEO TIKTOK 60S - 100+ PROMPT CHATGPT]\n- Cảnh 1: Mặt đối diện camera biểu cảm bức xúc.\n- Lời thoại (Hook): "Đừng bao giờ tự ngồi viết bài bán hàng nữa! Bạn đang lãng phí 3 tiếng cuộc đời mỗi ngày vô ích..."\n- Cảnh 2: Quay màn hình máy tính đang gõ ChatGPT chạy ra bài viết bán hàng cực đỉnh.\n- Lời thoại: "Đây là cách mình viết xong 5 bài quảng cáo Facebook chỉ trong đúng 30 giây bằng ChatGPT. Bí quyết không phải là AI thông minh, mà là do bộ PROMPT (câu lệnh) thôi miên này."\n- Cảnh 3: Chỉ tay xuống màn hình.\n- Lời thoại (CTA): "Mình đã tổng hợp hơn 100 Prompt viết bài chốt sale siêu đỉnh vào Ebook dưới link Bio của mình. Giá chỉ bằng một ly trà sữa 49k. Bấm vào mua và tải về dùng ngay để tiết kiệm 95% thời gian nhé!"`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Kịch bản TikTok!');
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  🎬 Copy Kịch bản TikTok
                </button>
                <button 
                  onClick={() => {
                    const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - 100+ PROMPT CHATGPT]\n🔥 CẢNH BÁO: CHATGPT SẼ LÀM BẠN MẤT KHÁCH NẾU KHÔNG BIẾT DÙNG CÂU LỆNH NÀY!\n\nRất nhiều bạn than phiền viết bài bán hàng bằng ChatGPT đọc nghe rất "robot", ngô nghê và không có cảm xúc chốt sale. Đó là vì bạn chỉ ra lệnh chung chung: "Hãy viết bài bán hàng cho tôi".\n\nĐể ChatGPT viết hay như một Copywriter 5 năm kinh nghiệm, bạn phải huấn luyện nó theo công thức:\n1. Xác định rõ chân dung khách hàng mục tiêu.\n2. Thiết lập giọng điệu (Tone of Voice) thân thiện, hài hước hoặc chuyên gia.\n3. Áp dụng công thức thôi miên AIDA/PAS.\n\n👉 Mình đã đóng gói toàn bộ 100+ Prompt (Câu lệnh) huấn luyện ChatGPT đỉnh cao này vào cuốn Cẩm Nang Thôi Miên Khách Hàng. \n📥 Tải về trực tiếp tại link Bio của mình chỉ với 49.000đ (Giá gốc 199k - Khuyến mãi hôm nay): [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Bài đăng Facebook!');
                  }}
                  className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  ✍️ Copy Bài đăng Facebook
                </button>
              </div>
            </div>

            {/* Card 2: Ebook TikTok */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="font-bold text-sm text-white">Ebook: Bí Kíp Xây Kênh TikTok</h4>
                <p className="text-xs text-white/50 leading-relaxed">Cẩm nang bẻ khóa thuật toán 2026, 15 mẫu Hook triệu view thu hút khách hàng tiềm năng.</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    const content = `[KỊCH BẢN VIDEO TIKTOK 60S - BÍ KÍP XÂY KÊNH TIKTOK]\n- Cảnh 1: Mặt biểu cảm nghiêm trọng, lắc đầu.\n- Lời thoại (Hook): "Đừng đăng video lên TikTok nữa nếu kênh của bạn vẫn lẹt đẹt dưới 1000 view! Bạn đã dính phải 3 lỗi cơ bản này..."\n- Cảnh 2: Quay cảnh bảng viết hoặc màn hình máy tính chỉ ra 3 lỗi: Không tối ưu 3 giây đầu, đổi chủ đề liên tục, hashtag sai cách.\n- Lời thoại: "Lỗi lớn nhất là bạn không giữ chân được người xem trong 3 giây đầu tiên. Thuật toán TikTok 2026 chấm điểm giữ chân cực kỳ nặng."\n- Cảnh 3: Cầm điện thoại chỉ vào trang Bio của mình.\n- Lời thoại (CTA): "Mình đã soạn sẵn Lộ trình 30 ngày xây kênh từ con số 0 kèm 15 mẫu Hook giật tít ăn tiền trong Ebook ở link Bio. Bấm tải ngay chỉ với 79k để cứu kênh của bạn nhé!"`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Kịch bản TikTok!');
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  🎬 Copy Kịch bản TikTok
                </button>
                <button 
                  onClick={() => {
                    const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - BÍ KÍP XÂY KÊNH TIKTOK]\n🔥 THUẬT TOÁN TIKTOK 2026 ĐÃ THAY ĐỔI - KÊNH CỦA BẠN ĐÃ CẬP NHẬT CHƯA?\n\nNếu bạn vẫn đang đăng video theo kiểu "hên xui", không có kịch bản giữ chân người xem thì xin chia buồn: video của bạn sẽ mãi mãi lẹt đẹt lèo tèo vài trăm view.\n\nĐể bẻ khóa thuật toán TikTok và kéo hàng triệu view organic traffic về bán hàng, bạn cần làm đúng:\n1. Công thức viết kịch bản 3 giây đầu giữ chân (Hook).\n2. Quy trình làm video chuẩn SEO TikTok Search.\n3. Kế hoạch đăng bài 30 ngày liên tục tạo tín hiệu tốt cho kênh.\n\n👉 Tất cả bí mật này được mình đúc kết trong cuốn Ebook "Bí Kíp Xây Kênh TikTok Triệu View". \n📥 Link tải tài liệu trực tiếp nằm ở Bio cá nhân của mình (Giá ưu đãi chỉ 79.000đ): [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Bài đăng Facebook!');
                  }}
                  className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  ✍️ Copy Bài đăng Facebook
                </button>
              </div>
            </div>

            {/* Card 3: 500+ Mẫu Canva */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-sm text-white">Ebook: 500+ Mẫu Canva</h4>
                <p className="text-xs text-white/50 leading-relaxed">Kho tài nguyên thiết kế banner, slide thuyết trình, cv chuyên nghiệp kéo thả trong 1 click.</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    const content = `[KỊCH BẢN VIDEO TIKTOK 60S - 500+ MẪU CANVA]\n- Cảnh 1: Chỉ tay vào màn hình thiết kế Canva lung linh cực đẹp.\n- Lời thoại (Hook): "Dành ra 2 tiếng để thiết kế một cái Slide thuyết trình hay Banner? Quá xưa rồi! Đây là cách mình thiết kế xong trong đúng 1 phút..."\n- Cảnh 2: Quay cảnh kéo thả một mẫu template có sẵn vô cùng nhanh chóng và đổi màu, chữ.\n- Lời thoại: "Chỉ cần chọn 1 trong 500 mẫu Canva Pro đã được thiết kế sẵn bởi các Designer chuyên nghiệp, kéo thả ảnh của bạn vào là xong. Đẹp mê ly."\n- Cảnh 3: Mặt vui vẻ kêu gọi hành động.\n- Lời thoại (CTA): "Trọn bộ 500+ mẫu Canva đa dạng lĩnh vực Slide, CV, Banner mình để link tải ở Bio. Chỉ 99k cho cả kho tài nguyên dùng trọn đời. Bấm tải ngay nhé!"`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Kịch bản TikTok!');
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  🎬 Copy Kịch bản TikTok
                </button>
                <button 
                  onClick={() => {
                    const content = `[BÀI ĐĂNG FACEBOOK ADS/GROUP - 500+ MẪU CANVA]\n🎨 KHÔNG CẦN BIẾT PHOTOSHOP VẪN THIẾT KẾ ĐẸP NHƯ DESIGNER CHUYÊN NGHIỆP!\n\nBạn đang chuẩn bị thuyết trình, làm CV xin việc hay thiết kế banner quảng cáo bán hàng nhưng không biết dùng các phần mềm đồ họa phức tạp? \n\nGiải pháp hoàn hảo nhất chính là tận dụng kho **500+ Mẫu Canva Cao Cấp** được thiết kế sẵn:\n- 150+ Mẫu slide thuyết trình ấn tượng, chuyên nghiệp.\n- 100+ Mẫu CV xin việc chinh phục nhà tuyển dụng.\n- 250+ Mẫu banner quảng cáo, avatar, cover thu hút lượt tương tác.\n- Chỉ việc kéo, thả ảnh và thay đổi nội dung trong 1 nốt nhạc!\n\n👉 Trở thành Designer chuyên nghiệp ngay hôm nay chỉ với 99.000đ.\n📥 Tải trọn bộ link Canva trực tiếp tại link Bio của mình: [DÁN LINK BIO CỦA BẠN VÀO ĐÂY]`;
                    navigator.clipboard.writeText(content);
                    toast.success('Đã copy Bài đăng Facebook!');
                  }}
                  className="w-full py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 text-xs font-semibold rounded-xl transition-all touch-target min-h-[38px]"
                >
                  ✍️ Copy Bài đăng Facebook
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-brand-orange/5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              💡 Hướng dẫn tăng traffic nhanh để kiếm đơn hàng:
            </h4>
            <ul className="text-xs text-white/60 space-y-2 list-disc pl-5 leading-relaxed">
              <li>Sử dụng kịch bản video trên, dùng điện thoại quay phim hoặc ghép chữ chạy trên Canva để đăng đều đặn mỗi ngày 1-2 video lên TikTok.</li>
              <li>Đăng bài viết chia sẻ giá trị lên các Group Facebook có tệp khách hàng tiềm năng lớn.</li>
              <li>Luôn kêu gọi hành động (Call To Action) rõ ràng: Khách hàng click vào link Bio của bạn để mua sản phẩm và nhận file tự động qua Email!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
