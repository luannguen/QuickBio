import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LandingPageView } from './LandingPageView';

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

  return (
    <LandingPageView 
      isAuthenticated={isAuthenticated}
      loading={loading}
      onNavigateToDashboard={onNavigateToDashboard}
      onNavigateToDemoBio={onNavigateToDemoBio}
      onNavigateToAIVoice={onNavigateToAIVoice}
    />
  );
};
export default LandingPage;
