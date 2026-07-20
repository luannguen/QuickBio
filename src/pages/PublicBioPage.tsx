import React from 'react';
import { Compass } from 'lucide-react';
import { usePublicBio } from "@/features/public-bio/hooks/usePublicBio";
import { PublicBioLayout } from "@/features/public-bio/ui/PublicBioLayout";
import { Button } from "@/shared/ui/Button";
import { PublicBioSkeleton } from "@/features/public-bio/components/PublicBioSkeleton";

interface PublicBioProps {
  slug: string;
  currentUserId?: string;
  onNavigateToDashboard?: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToSam?: () => void;
  onNavigateToArticle?: (slug: string) => void;
  onNavigateToLandingPublic?: (bioSlug: string, landingSlug: string) => void;
}

export const PublicBio: React.FC<PublicBioProps> = ({ 
  slug, 
  currentUserId, 
  onNavigateToDashboard, 
  onNavigateToLanding, 
  onNavigateToSam, 
  onNavigateToArticle,
  onNavigateToLandingPublic
}) => {
  const {
    bio,
    products,
    articles,
    landingPages,
    loading,
    activeProduct,
    setActiveProduct,
    formattedTime,
    showToast,
    toastData,
  } = usePublicBio(slug);

  if (loading) {
    return <PublicBioSkeleton />;
  }

  if (!bio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="max-w-sm glass-panel p-8 rounded-2xl border border-border space-y-6">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Không tìm thấy trang</h2>
            <p className="text-sm text-muted-foreground">
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
      articles={articles}
      landingPages={landingPages}
      activeProduct={activeProduct}
      setActiveProduct={setActiveProduct}
      formattedTime={formattedTime}
      showToast={showToast}
      toastData={toastData}
      currentUserId={currentUserId}
      onNavigateToDashboard={onNavigateToDashboard}
      onNavigateToLanding={onNavigateToLanding}
      onNavigateToSam={onNavigateToSam}
      onNavigateToArticle={onNavigateToArticle}
      onNavigateToLandingPublic={onNavigateToLandingPublic}
    />
  );
};

export default PublicBio;
