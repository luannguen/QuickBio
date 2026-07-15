import React from 'react';
import { Clock } from 'lucide-react';

interface CountdownBannerProps {
  formattedTime: string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ formattedTime }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-brand-orange via-brand-coral to-brand-orange text-white text-xs sm:text-sm font-bold text-center py-3 px-4 shadow-lg flex items-center justify-center gap-2.5 z-50 border-b border-white/10 backdrop-blur-md">
      <Clock className="w-4 h-4 animate-pulse text-yellow-300" />
      <span className="tracking-wider">GIẢM GIÁ ĐỘC QUYỀN 50% KẾT THÚC SAU:</span>
      <span className="bg-black/35 px-3 py-1 rounded-md font-mono text-yellow-300 shadow-inner tracking-wider border border-white/10">{formattedTime}</span>
    </div>
  );
};
