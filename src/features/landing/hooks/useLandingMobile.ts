import { useState } from 'react';

export const useLandingMobile = (
  isAuthenticated: boolean,
  onNavigateToDashboard: () => void
) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mockPhoneStep, setMockPhoneStep] = useState<'bio' | 'checkout' | 'paid'>('bio');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Gesture States for Phone Mockup
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      if (mockPhoneStep === 'bio') setMockPhoneStep('checkout');
      else if (mockPhoneStep === 'checkout') setMockPhoneStep('paid');
      else if (mockPhoneStep === 'paid') setMockPhoneStep('bio');
    } else if (isRightSwipe) {
      if (mockPhoneStep === 'paid') setMockPhoneStep('checkout');
      else if (mockPhoneStep === 'checkout') setMockPhoneStep('bio');
      else if (mockPhoneStep === 'bio') setMockPhoneStep('paid');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleStart = () => {
    if (isAuthenticated) {
      onNavigateToDashboard();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onNavigateToDashboard();
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  return {
    showAuthModal,
    setShowAuthModal,
    mockPhoneStep,
    setMockPhoneStep,
    openFaq,
    toggleFaq,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    handleStart,
    handleAuthSuccess,
  };
};
