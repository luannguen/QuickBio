import React from 'react';

interface LayoutProps {
  headerContent: React.ReactNode;
  sidebarContent?: React.ReactNode;
  bottomNavContent?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  headerContent,
  sidebarContent,
  bottomNavContent,
  children
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 lg:pb-0">
      {/* Top Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="w-full">
            {headerContent}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Left Sidebar column - Desktop only */}
        {sidebarContent && (
          <aside className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="sticky top-24 space-y-4">
              {sidebarContent}
            </div>
          </aside>
        )}

        {/* Right Content column */}
        <main className={`space-y-6 ${sidebarContent ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - Mobile only */}
      {bottomNavContent && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t border-border px-4 py-2 pb-safe-bottom shadow-2xl">
          <div className="flex items-center justify-around max-w-lg mx-auto h-14">
            {bottomNavContent}
          </div>
        </nav>
      )}
    </div>
  );
};
