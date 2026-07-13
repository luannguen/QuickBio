import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/useIsMobile';
import { LandingPageDesktop } from './LandingPageDesktop';
import { LandingPageMobile } from './LandingPageMobile';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToDemoBio: () => void;
  onNavigateToAIVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  onNavigateToDemoBio,
  onNavigateToAIVoice
}) => {
  const { isAuthenticated, loading } = useAuth();
  const isMobile = useIsMobile(1024); // 1024px targets mobile & tablets

  const sharedProps = {
    isAuthenticated,
    loading,
    onNavigateToDashboard,
    onNavigateToDemoBio,
    onNavigateToAIVoice
  };

  if (isMobile) {
    return <LandingPageMobile {...sharedProps} />;
  }

  return <LandingPageDesktop {...sharedProps} />;
};
export default LandingPage;
