import React from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { LandingPageView } from "@/features/landing/LandingPageView";

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToDemoBio: () => void;
  onNavigateToAIVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  onNavigateToAdmin,
  onNavigateToDemoBio,
  onNavigateToAIVoice
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <LandingPageView 
      isAuthenticated={isAuthenticated}
      onNavigateToDashboard={onNavigateToDashboard}
      onNavigateToAdmin={onNavigateToAdmin}
      onNavigateToDemoBio={onNavigateToDemoBio}
      onNavigateToAIVoice={onNavigateToAIVoice}
    />
  );
};
export default LandingPage;
