import React, { useState } from 'react';
import { Sparkles, FileText, Menu, X, ShieldCheck, LayoutDashboard, Eye } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useAuth } from "@/shared/hooks/useAuth";

interface GlobalHeaderProps {
  onNavigateToHome: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToDemoBio?: () => void;
  onNavigateToAIVoice?: () => void;
  onNavigateToBlog?: () => void;
  onStartAuth?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onNavigateToHome,
  onNavigateToDashboard,
  onNavigateToAdmin,
  onNavigateToDemoBio,
  onNavigateToAIVoice,
  onNavigateToBlog,
  onStartAuth
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <header className="relative z-50 max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex justify-between items-center border-b lg:border-none border-border bg-brand-card/10 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
      <button 
        onClick={onNavigateToHome}
        className="flex items-center gap-1.5 lg:gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none relative z-50"
      >
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
          <Sparkles className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" />
        </div>
        <span className="text-base lg:text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/70">
          QuickBio
        </span>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-4">
        {onNavigateToBlog && (
          <Button onClick={onNavigateToBlog} variant="ghost" className="text-foreground hover:text-brand-orange flex items-center gap-1 font-bold">
            <FileText className="w-4 h-4" /> Bài viết
          </Button>
        )}

        {onNavigateToAIVoice && (
          <Button onClick={onNavigateToAIVoice} variant="ghost" className="text-brand-orange hover:text-brand-coral flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Tổng đài Lễ tân AI
          </Button>
        )}

        {onNavigateToDemoBio && (
          <Button onClick={onNavigateToDemoBio} variant="ghost">
            Trang cá nhân mẫu
          </Button>
        )}
        
        {isAdmin && onNavigateToAdmin && (
          <Button onClick={onNavigateToAdmin} variant="outline" className="border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Admin Console
          </Button>
        )}

        {(onStartAuth || onNavigateToDashboard) && (
          <Button onClick={isAuthenticated && onNavigateToDashboard ? onNavigateToDashboard : onStartAuth} variant="secondary">
            {loading ? 'Đang tải...' : isAuthenticated ? 'Vào Dashboard' : 'Trải nghiệm Demo'}
          </Button>
        )}

        <ThemeToggle />
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="flex lg:hidden items-center gap-2 relative z-50">
        <ThemeToggle />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-foreground focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 gap-4 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {onNavigateToBlog && (
            <Button onClick={() => { onNavigateToBlog(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-lg h-14">
              <FileText className="w-5 h-5 mr-3" /> Bài viết
            </Button>
          )}

          {onNavigateToAIVoice && (
            <Button onClick={() => { onNavigateToAIVoice(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-lg h-14 text-brand-orange">
              <Sparkles className="w-5 h-5 mr-3" /> Tổng đài Lễ tân AI
            </Button>
          )}

          {onNavigateToDemoBio && (
            <Button onClick={() => { onNavigateToDemoBio(); setIsMobileMenuOpen(false); }} variant="ghost" className="w-full justify-start text-lg h-14">
              <Eye className="w-5 h-5 mr-3" /> Trang cá nhân mẫu
            </Button>
          )}

          <div className="h-px w-full bg-border my-2" />

          {isAdmin && onNavigateToAdmin && (
            <Button onClick={() => { onNavigateToAdmin(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full justify-center text-lg h-14 border-brand-orange/50 text-brand-orange">
              <ShieldCheck className="w-5 h-5 mr-2" /> Admin Console
            </Button>
          )}

          {(onStartAuth || onNavigateToDashboard) && (
            <Button onClick={() => { 
              if(isAuthenticated && onNavigateToDashboard) onNavigateToDashboard(); 
              else if(onStartAuth) onStartAuth(); 
              setIsMobileMenuOpen(false); 
            }} variant="default" className="w-full justify-center text-lg h-14">
              {loading ? 'Đang tải...' : isAuthenticated ? (
                <><LayoutDashboard className="w-5 h-5 mr-2" /> Vào Dashboard</>
              ) : 'Trải nghiệm Demo'}
            </Button>
          )}
        </div>
      )}
    </header>
  );
};
