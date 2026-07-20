import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { PricingModal } from '@/features/monetization/components/PricingModal';
import { Button } from '@/shared/ui/Button';
import { Lock, Crown } from 'lucide-react';
import { useModalStore } from '@/shared/stores/useModalStore';

interface ProGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
  showOverlay?: boolean;
}

export const ProGate: React.FC<ProGateProps> = ({ 
  children, 
  fallback,
  featureName = 'Tính năng này',
  showOverlay = false
}) => {
  const { user } = useAuth();
  const { openModal } = useModalStore();

  const isPro = user?.plan === 'pro';

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showOverlay) {
    return (
      <div className="relative group">
        <div className="opacity-50 blur-[2px] pointer-events-none transition-all duration-300">
          {children}
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-background/40 backdrop-blur-[1px] rounded-lg border border-white/10">
          <div className="bg-background/80 p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center mb-4 text-brand-orange">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Nâng cấp Pro</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {featureName} yêu cầu tài khoản Pro. Nâng cấp ngay để mở khóa toàn bộ tính năng.
            </p>
            <Button 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-medium"
              onClick={() => openModal({ 
                id: 'pro-upgrade',
                title: 'Nâng cấp lên Pro',
                size: 'xl',
                component: <PricingModal />
              })}
            >
              Xem bảng giá
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-xl border border-white/10 border-dashed">
      <Lock className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-medium text-white mb-2">Tính năng khóa</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {featureName} dành riêng cho thành viên Pro.
      </p>
      <Button 
        variant="outline" 
        className="border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10"
        onClick={() => openModal({ 
          id: 'pro-upgrade',
          title: 'Nâng cấp lên Pro',
          size: 'xl',
          component: <PricingModal />
        })}
      >
        <Crown className="w-4 h-4 mr-2" /> Nâng cấp Pro
      </Button>
    </div>
  );
};
