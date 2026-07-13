import React from 'react';

interface DesktopLayoutProps {
  sidebarContent: React.ReactNode;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  sidebarContent,
  headerContent,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#080B11] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-brand-card/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {headerContent}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar column (e.g. Navigation) */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 space-y-4">
            {sidebarContent}
          </div>
        </aside>

        {/* Right Content column */}
        <main className="lg:col-span-3 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
