import React from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { LandingPageView } from "@/features/landing/LandingPageView";

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
  const { isAuthenticated } = useAuth();

  return (
    <LandingPageView 
      isAuthenticated={isAuthenticated}
      onNavigateToDashboard={onNavigateToDashboard}
      onNavigateToDemoBio={onNavigateToDemoBio}
      onNavigateToAIVoice={onNavigateToAIVoice}
    />
  );
};
export default LandingPage;
