import React from 'react';

interface PhoneMockupProps {
  mockPhoneStep: 'bio' | 'checkout' | 'paid';
  setMockPhoneStep: (step: 'bio' | 'checkout' | 'paid') => void;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  mockPhoneStep,
  setMockPhoneStep,
  touchHandlers,
}) => {
  return (
    <div className="flex justify-center pt-4">
      <div 
        {...touchHandlers}
        className="relative w-[260px] h-[520px] bg-card rounded-[36px] p-2.5 shadow-2xl border-[4px] border-border overflow-hidden flex flex-col select-none touch-pan-y"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20 flex items-center justify-center">
          <div className="w-10 h-0.5 bg-muted/50 rounded-full"></div>
        </div>

        <div className="relative flex-1 rounded-[30px] overflow-hidden bg-background border border-border flex flex-col p-3 pt-6">
          {mockPhoneStep === 'bio' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="text-center space-y-1.5 mt-2">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full mx-auto object-cover border border-border"
                />
                <div>
                  <h4 className="text-[10px] font-bold text-foreground">Luan Nguyen</h4>
                  <p className="text-[8px] text-muted-foreground">Tài liệu & Công cụ MMO chuyên nghiệp</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="glass-card p-2.5 rounded-xl border border-border space-y-2">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" 
                    alt="ChatGPT Ebook"
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <div className="space-y-0.5 text-left">
                    <h5 className="text-[9px] font-bold text-foreground leading-snug truncate">100+ Prompt ChatGPT Thôi Miên</h5>
                    <p className="text-[8px] text-muted-foreground line-clamp-1">Viết kịch bản, content chốt sale trong 3s.</p>
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

              <div className="text-center text-[7px] text-muted-foreground pt-1.5 border-t border-border relative">
                <span>⚡ Tạo Bio Link bởi QuickBio</span>
                <span className="absolute bottom-[-14px] left-0 right-0 text-[6px] text-muted-foreground block text-center animate-pulse">Vuốt ngang để đổi bước</span>
              </div>
            </div>
          )}

          {mockPhoneStep === 'checkout' && (
            <div className="flex-1 flex flex-col justify-between space-y-3 text-center">
              <h5 className="text-[9px] font-bold text-brand-orange">Quét Mã VietQR Chuyển Khoản</h5>
              <div className="w-28 h-28 bg-white p-1 rounded-lg mx-auto flex items-center justify-center">
                <img 
                  src="https://api.vietqr.io/image/970422-11301442277-hFpQhC9.jpg?accountName=NGUYEN%20THIEN%20LUAN&amount=49000&addInfo=QB41500"
                  alt="VietQR"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-0.5 text-[10px]">
                <div className="text-[8px] text-muted-foreground">Số tiền: <strong className="text-foreground">49.000đ</strong></div>
                <div className="text-[8px] text-muted-foreground">Nội dung: <strong className="text-brand-orange font-mono">QB41500</strong></div>
              </div>
              <button 
                onClick={() => setMockPhoneStep('paid')}
                className="w-full py-1.5 bg-gradient-to-r from-brand-orange to-brand-coral text-foreground text-[8px] font-bold rounded-lg min-h-[36px] flex items-center justify-center"
              >
                Bấm giả lập thanh toán
              </button>
            </div>
          )}

          {mockPhoneStep === 'paid' && (
            <div className="flex-1 flex flex-col justify-center items-center space-y-3 text-center">
              <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h5 className="text-[9px] font-bold text-green-400">Thanh Toán Thành Công!</h5>
                <p className="text-[8px] text-muted-foreground max-w-[140px] mx-auto">File đã tự động gửi qua email của khách hàng.</p>
              </div>
              <a 
                href="https://quick-bio-lilac.vercel.app/downloads/100-prompt-chatgpt.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-muted/50 text-foreground border border-border text-[8px] font-bold rounded-lg"
              >
                📥 Tải File Ebook
              </a>
              <button 
                onClick={() => setMockPhoneStep('bio')}
                className="text-[8px] text-muted-foreground hover:text-foreground underline pt-2"
              >
                Quay lại trang Bio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
