import React from 'react';

interface MobileLayoutProps {
  headerContent: React.ReactNode;
  bottomNavContent: React.ReactNode;
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  headerContent,
  bottomNavContent,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#080B11] text-white flex flex-col font-sans pb-24">
      {/* Mobile Top Header */}
      <header className="border-b border-white/5 bg-brand-card/30 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="w-full">
          {headerContent}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 space-y-6 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/90 backdrop-blur-lg border-t border-white/5 px-4 py-2 pb-safe-bottom shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto h-14">
          {bottomNavContent}
        </div>
      </nav>
    </div>
  );
};
