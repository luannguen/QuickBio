import React from 'react';
import { Loader2, Compass } from 'lucide-react';
import { usePublicBio } from './hooks/usePublicBio';
import { PublicBioLayout } from './ui/PublicBioLayout';
import { Button } from '../../components/ui/Button';

interface PublicBioProps {
  slug: string;
  onNavigateToLanding?: () => void;
  onNavigateToSam?: () => void;
}

export const PublicBio: React.FC<PublicBioProps> = ({ slug, onNavigateToLanding, onNavigateToSam }) => {
  const {
    bio,
    products,
    loading,
    activeProduct,
    setActiveProduct,
    formattedTime,
    showToast,
    toastData,
  } = usePublicBio(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange mx-auto" />
          <p className="text-sm text-white/50">Đang tải trang cá nhân...</p>
        </div>
      </div>
    );
  }

  if (!bio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11] p-4 text-center">
        <div className="max-w-sm glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Không tìm thấy trang</h2>
            <p className="text-sm text-white/50">
              Trang Bio Link này chưa được khởi tạo hoặc đã bị ẩn. Hãy tự tạo một trang cho riêng bạn!
            </p>
          </div>
          <Button 
            onClick={onNavigateToLanding}
            className="w-full"
          >
            Tạo Bio Link miễn phí
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PublicBioLayout
      bio={bio}
      products={products}
      activeProduct={activeProduct}
      setActiveProduct={setActiveProduct}
      formattedTime={formattedTime}
      showToast={showToast}
      toastData={toastData}
      onNavigateToLanding={onNavigateToLanding}
      onNavigateToSam={onNavigateToSam}
    />
  );
};

export default PublicBio;
