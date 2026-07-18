import { useState, useEffect } from 'react';
import { bioService } from "@/entities/bio/api";
import { landingService, LandingPage } from "@/entities/landing/api";
import { SamTayNguyenLanding } from './SamTayNguyenLanding';

interface DynamicLandingPageProps {
  bioSlug: string;
  landingSlug: string;
  onNavigateToHome: () => void;
  onNavigateToBio: () => void;
}

export function DynamicLandingPage({ bioSlug, landingSlug, onNavigateToHome, onNavigateToBio }: DynamicLandingPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [landingData, setLandingData] = useState<LandingPage | null>(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      setLoading(true);
      setError('');
      try {
        const bio = await bioService.getBioBySlug(bioSlug);
        if (!bio) {
          setError('Không tìm thấy Bio của người dùng.');
          return;
        }

        const landing = await landingService.getLandingPageBySlug(bio.user_id, landingSlug);
        if (!landing || landing.status !== 'active') {
          setError('Không tìm thấy Landing Page hoặc trang chưa được xuất bản.');
          return;
        }

        setLandingData(landing);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, [bioSlug, landingSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">404</h1>
          <p className="text-sm text-semantic-muted mb-6">{error || 'Không tìm thấy trang'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onNavigateToBio}
              className="px-4 py-2 bg-brand-orange text-white rounded-lg font-medium text-sm"
            >
              Về trang chủ Bio
            </button>
            <button 
              onClick={onNavigateToHome}
              className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm"
            >
              Về QuickBio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phân bổ component theo template_id
  switch (landingData.template_id) {
    case 'sam-scroll-world':
      return <SamTayNguyenLanding onNavigateToHome={onNavigateToHome} />;
    
    // Thêm các template khác ở đây trong tương lai
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-sm">
            <h1 className="text-2xl font-bold text-foreground mb-2">{landingData.title}</h1>
            <p className="text-sm text-semantic-muted mb-6">Trang này đang sử dụng giao diện mặc định chưa được hỗ trợ hoàn chỉnh.</p>
            <button 
              onClick={onNavigateToBio}
              className="px-4 py-2 bg-brand-orange text-white rounded-lg font-medium text-sm"
            >
              Về trang chủ Bio
            </button>
          </div>
        </div>
      );
  }
}
