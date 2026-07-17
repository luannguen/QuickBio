import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Sparkles, AlertCircle } from 'lucide-react';
import { useVapiStore } from "@/shared/hooks/store";

export const AIVoiceWidget: React.FC = () => {
  const { 
    isCallActive, 
    connecting, 
    isListening, 
    volume, 
    startTrigger,
    stopTrigger,
    setCallActive, 
    setConnecting, 
    setListening, 
    setVolume,
    resetCall 
  } = useVapiStore();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  // Lấy các biến cấu hình từ biến môi trường
  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '';
  // ID Assistant có thể lấy từ .env hoặc lấy mặc định nếu chưa cấu hình
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || 'a97112ea-e910-4ea5-b593-3ea79e5e1639';

  useEffect(() => {
    if (!publicKey) {
      console.warn('Vapi: Thiếu VITE_VAPI_PUBLIC_KEY trong file .env');
      return;
    }

    try {
      // Khởi tạo SDK Vapi (sửa lỗi interop ESM/CommonJS)
      const VapiClass = (Vapi as any).default || Vapi;
      const vapiInstance = new VapiClass(publicKey);
      vapiRef.current = vapiInstance;

      // Thiết lập các sự kiện lắng nghe
      vapiInstance.on('call-start', () => {
        setCallActive(true);
        setConnecting(false);
        setErrorMsg(null);
      });

      vapiInstance.on('call-end', () => {
        resetCall();
      });

      vapiInstance.on('speech-start', () => {
        setListening(true);
      });

      vapiInstance.on('speech-end', () => {
        setListening(false);
      });

      vapiInstance.on('volume-level', (vol: number) => {
        setVolume(vol);
      });

      vapiInstance.on('error', (err: any) => {
        console.error('Vapi Web SDK Error:', err);
        setErrorMsg(err.message || 'Lỗi kết nối máy chủ thoại.');
        resetCall();
      });
    } catch (e: any) {
      console.error('Khởi tạo Vapi thất bại:', e);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [publicKey]);

  // Lắng nghe lệnh kích hoạt cuộc gọi từ trang Landing Page
  useEffect(() => {
    if (startTrigger > 0 && !isCallActive && !connecting) {
      setConnecting(true);
      setErrorMsg(null);
      vapiRef.current?.start(assistantId).catch((err: any) => {
        console.error('Không thể bắt đầu cuộc gọi từ trigger:', err);
        setErrorMsg(err.message || 'Lỗi kết nối cuộc gọi.');
        resetCall();
      });
    }
  }, [startTrigger]);

  useEffect(() => {
    if (stopTrigger > 0 && isCallActive) {
      vapiRef.current?.stop();
    }
  }, [stopTrigger]);

  const handleToggleCall = async () => {
    // Trường hợp chưa có API Key
    if (!publicKey) {
      setErrorMsg('Vui lòng thêm VITE_VAPI_PUBLIC_KEY vào .env để gọi Trợ lý ảo.');
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    if (isCallActive) {
      // Tắt cuộc gọi
      vapiRef.current?.stop();
    } else {
      // Bắt đầu cuộc gọi
      setConnecting(true);
      setErrorMsg(null);
      try {
        await vapiRef.current?.start(assistantId);
      } catch (err: any) {
        console.error('Không thể bắt đầu cuộc gọi:', err);
        setErrorMsg(err.message || 'Lỗi kết nối cuộc gọi.');
        setConnecting(false);
      }
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Thông báo lỗi nếu có */}
      {errorMsg && (
        <div className="bg-red-500/90 backdrop-blur-md text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-red-400/20 max-w-xs animate-fade-in flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Bong bóng giới thiệu khi rảnh */}
      {!isCallActive && !connecting && (
        <div className="group/tooltip relative mr-2">
          <div className="bg-foreground text-background border border-border/10 backdrop-blur-md text-xs px-3 py-2 rounded-xl shadow-xl whitespace-nowrap animate-bounce flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            <span className="font-medium">Alo thử ngay Trợ lý ảo AI Lễ Tân!</span>
          </div>
        </div>
      )}

      {/* Khung điều khiển cuộc gọi */}
      <div className="flex items-center gap-3">
        {/* Trạng thái sóng âm động khi đang gọi */}
        {isCallActive && (
          <div className="bg-card border border-border backdrop-blur-md py-2 px-4 rounded-full flex items-center gap-3 shadow-lg animate-fade-in">
            <span className="text-[10px] text-muted-foreground tracking-wider font-semibold">
              {isListening ? 'AI ĐANG NGHE...' : 'AI ĐANG NÓI...'}
            </span>
            <div className="flex gap-1 items-end h-5">
              {[...Array(5)].map((_, i) => {
                // Tạo biên độ sóng nhảy múa theo volume thực của AI/Người nói
                const baseHeight = 4;
                const sensitivity = [12, 28, 40, 24, 14][i]; // Độ nhạy khác nhau cho từng cột
                const computedHeight = isCallActive 
                  ? Math.min(24, Math.floor(baseHeight + volume * sensitivity))
                  : baseHeight;

                return (
                  <div
                    key={i}
                    className="w-0.75 bg-brand-orange rounded-full transition-all duration-75"
                    style={{
                      height: `${computedHeight}px`
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Nút cuộc gọi chính */}
        <button
          onClick={handleToggleCall}
          aria-label={isCallActive ? 'Kết thúc cuộc gọi với trợ lý ảo' : 'Bắt đầu cuộc gọi với trợ lý ảo'}
          title={isCallActive ? 'Kết thúc cuộc gọi' : 'Bắt đầu trò chuyện'}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 cursor-pointer touch-target ${
            isCallActive 
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
              : connecting
                ? 'bg-brand-orange animate-pulse'
                : 'bg-gradient-to-tr from-brand-orange to-brand-coral hover:shadow-brand-orange/30'
          }`}
        >
          {/* Vòng tròn nhấp nháy bên ngoài khi cuộc gọi hoạt động */}
          {isCallActive && (
            <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping pointer-events-none"></span>
          )}
          {!isCallActive && !connecting && (
            <span className="absolute inset-0 rounded-full bg-brand-orange/20 animate-pulse pointer-events-none"></span>
          )}

          {/* Biểu tượng */}
          {isCallActive ? (
            <PhoneOff className="w-6 h-6 text-white" />
          ) : connecting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Phone className="w-6 h-6 text-white animate-[wiggle_3s_infinite]" />
          )}
        </button>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-8deg); }
          20%, 40% { transform: rotate(8deg); }
          50% { transform: rotate(0deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
