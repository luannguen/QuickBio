import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Check, Crown, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useToastStore } from '@/shared/stores/useToastStore';

export const PricingModal: React.FC = () => {
  const { user } = useAuth();
  const toast = useToastStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleUpgradeClick = () => {
    setShowQR(true);
  };

  const handlePaymentConfirmed = async () => {
    setIsProcessing(true);
    try {
      // Logic gửi yêu cầu nâng cấp lên admin (Tạo 1 bản ghi vào bảng transaction hoặc notification)
      // Tạm thời mock logic ở đây:
      setTimeout(() => {
        setIsProcessing(false);
        toast.success('Admin đang xử lý nâng cấp cho bạn. Sẽ hoàn tất trong ít phút.', 'Đã gửi yêu cầu');
        setShowQR(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast.error('Không thể gửi yêu cầu', 'Lỗi');
    }
  };

  if (showQR) {
    return (
      <div className="p-6 text-center space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange mb-2">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Thanh toán qua VietQR</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Vui lòng dùng app ngân hàng quét mã QR bên dưới. Nội dung chuyển khoản: <span className="font-bold text-white">UPGRADE PRO {user?.email}</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl mx-auto w-64 h-64 flex items-center justify-center">
          {/* Mock QR Code */}
          <img 
            src={`https://img.vietqr.io/image/MB-09125-compact2.png?amount=199000&addInfo=UPGRADE%20PRO%20${user?.email}&accountName=QUICKBIO`} 
            alt="VietQR" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowQR(false)}>
            Quay lại
          </Button>
          <Button 
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={handlePaymentConfirmed}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            Tôi đã chuyển khoản
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gói Free */}
      <div className="rounded-2xl border border-white/10 bg-background/50 p-8 flex flex-col relative overflow-hidden">
        <h3 className="text-xl font-medium text-white mb-2">Gói Cơ Bản (Free)</h3>
        <div className="mb-6 flex items-baseline text-white">
          <span className="text-3xl font-bold">0đ</span>
          <span className="text-muted-foreground ml-1">/tháng</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-start text-sm text-muted-foreground">
            <Check className="w-5 h-5 mr-3 text-green-500 shrink-0" /> Tạo 1 trang Bio duy nhất
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <Check className="w-5 h-5 mr-3 text-green-500 shrink-0" /> Tối đa 3 sản phẩm E-commerce
          </li>
          <li className="flex items-start text-sm text-muted-foreground">
            <Check className="w-5 h-5 mr-3 text-green-500 shrink-0" /> Có gắn Logo QuickBio
          </li>
        </ul>
        <Button variant="outline" className="w-full" disabled={user?.plan !== 'pro'}>
          {user?.plan === 'pro' ? 'Chuyển về gói này' : 'Đang sử dụng'}
        </Button>
      </div>

      {/* Gói Pro */}
      <div className="rounded-2xl border border-brand-orange bg-brand-orange/5 p-8 flex flex-col relative overflow-hidden shadow-[0_0_30px_-5px_rgba(255,107,0,0.3)]">
        <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          PHỔ BIẾN
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="w-6 h-6 text-brand-orange" />
          <h3 className="text-xl font-medium text-white">Gói Pro</h3>
        </div>
        
        <div className="mb-6 flex items-baseline text-white">
          <span className="text-4xl font-bold">199.000đ</span>
          <span className="text-muted-foreground ml-1">/tháng</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-start text-sm text-white">
            <Check className="w-5 h-5 mr-3 text-brand-orange shrink-0" /> 
            <span className="font-medium">Không giới hạn</span> số lượng trang Bio
          </li>
          <li className="flex items-start text-sm text-white">
            <Check className="w-5 h-5 mr-3 text-brand-orange shrink-0" /> 
            Đăng <span className="font-medium mx-1">không giới hạn</span> sản phẩm
          </li>
          <li className="flex items-start text-sm text-white">
            <Check className="w-5 h-5 mr-3 text-brand-orange shrink-0" /> 
            Tính năng kéo thả (Drag & Drop) nâng cao
          </li>
          <li className="flex items-start text-sm text-white">
            <Check className="w-5 h-5 mr-3 text-brand-orange shrink-0" /> 
            Ẩn hoàn toàn Logo QuickBio
          </li>
          <li className="flex items-start text-sm text-white">
            <Check className="w-5 h-5 mr-3 text-brand-orange shrink-0" /> 
            Tên miền tùy chỉnh (Custom Domain)
          </li>
        </ul>
        <Button 
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/25"
          onClick={handleUpgradeClick}
          disabled={user?.plan === 'pro'}
        >
          {user?.plan === 'pro' ? 'Bạn đang là Pro' : 'Nâng cấp ngay'}
        </Button>
      </div>
    </div>
  );
};
