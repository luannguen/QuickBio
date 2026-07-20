import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Check, Crown } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useModalStore } from '@/shared/stores/useModalStore';
import { PricingModal } from '@/features/monetization/components/PricingModal';

export const PricingTable: React.FC = () => {
  const { user } = useAuth();
  const openModal = useModalStore((state) => state.openModal);

  const handleUpgradeClick = () => {
    if (!user) {
      openModal({ id: 'auth-modal', component: <div className="p-4 text-center">Vui lòng đăng nhập trước khi nâng cấp.</div> });
      // Thực tế có thể trỏ đến component login
      return;
    }
    openModal({
      id: 'pro-upgrade',
      title: 'Nâng cấp lên Pro',
      size: 'xl',
      component: <PricingModal />
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Gói Free */}
      <div className="rounded-2xl border border-white/10 bg-background/50 p-8 flex flex-col relative overflow-hidden">
        <h3 className="text-xl font-medium text-white mb-2">Gói Cơ Bản (Free)</h3>
        <div className="mb-6 flex items-baseline text-white">
          <span className="text-4xl font-bold">0đ</span>
          <span className="text-muted-foreground ml-1">/tháng</span>
        </div>
        <p className="text-sm text-white/50 mb-6">Trải nghiệm cơ bản, bắt đầu xây dựng thương hiệu cá nhân.</p>
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
        <Button variant="outline" className="w-full" disabled>
          {user?.plan === 'free' ? 'Đang sử dụng' : 'Gói Cơ Bản'}
        </Button>
      </div>

      {/* Gói Pro */}
      <div className="rounded-2xl border border-brand-orange bg-brand-orange/5 p-8 flex flex-col relative overflow-hidden shadow-[0_0_30px_-5px_rgba(255,107,0,0.3)] transform md:-translate-y-4">
        <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          PHỔ BIẾN
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="w-6 h-6 text-brand-orange" />
          <h3 className="text-xl font-medium text-white">Gói Pro</h3>
        </div>
        
        <div className="mb-6 flex items-baseline text-white">
          <span className="text-5xl font-black">199k</span>
          <span className="text-muted-foreground ml-1">/tháng</span>
        </div>
        <p className="text-sm text-white/80 mb-6 font-medium text-brand-orange">Công cụ mạnh mẽ nhất cho người kinh doanh chuyên nghiệp.</p>
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
            <span className="font-medium">Lễ tân Tổng đài AI (Dành cho Spa, Nha Khoa)</span>
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
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/25 py-6 text-lg font-bold"
          onClick={handleUpgradeClick}
          disabled={user?.plan === 'pro'}
        >
          {user?.plan === 'pro' ? 'Bạn đang là Pro' : 'Nâng cấp ngay'}
        </Button>
      </div>
    </div>
  );
};
