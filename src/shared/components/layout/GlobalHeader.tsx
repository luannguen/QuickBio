import React from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { useAuth } from "@/shared/hooks/useAuth";

interface GlobalHeaderProps {
  onNavigateToHome: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToDemoBio?: () => void;
  onNavigateToAIVoice?: () => void;
  onNavigateToBlog?: () => void;
  onStartAuth?: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onNavigateToHome,
  onNavigateToDashboard,
  onNavigateToDemoBio,
  onNavigateToAIVoice,
  onNavigateToBlog,
  onStartAuth
}) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="relative z-50 max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 flex justify-between items-center border-b lg:border-none border-border bg-brand-card/10 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
      <button 
        onClick={onNavigateToHome}
        className="flex items-center gap-1.5 lg:gap-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
      >
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-tr from-brand-orange to-brand-coral rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
          <Sparkles className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-white" />
        </div>
        <span className="text-base lg:text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/70">
          QuickBio
        </span>
      </button>

      <div className="flex items-center gap-2 lg:gap-4">
        {onNavigateToBlog && (
          <Button 
            onClick={onNavigateToBlog}
            variant="ghost"
            className="text-foreground hover:text-brand-orange flex items-center gap-1 font-bold"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline">Bài viết</span>
          </Button>
        )}

        {onNavigateToAIVoice && (
          <Button 
            onClick={onNavigateToAIVoice}
            variant="ghost"
            className="text-brand-orange hover:text-brand-coral flex items-center gap-1 font-bold lg:mr-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tổng đài </span>Lễ tân AI
          </Button>
        )}

        {onNavigateToDemoBio && (
          <Button 
            onClick={onNavigateToDemoBio}
            variant="ghost"
            className="hidden lg:inline-flex"
          >
            Trang cá nhân mẫu
          </Button>
        )}
        
        {(onStartAuth || onNavigateToDashboard) && (
          <Button 
            onClick={isAuthenticated && onNavigateToDashboard ? onNavigateToDashboard : onStartAuth}
            variant="secondary"
            className="hidden lg:inline-flex"
          >
            {loading ? 'Đang tải...' : isAuthenticated ? 'Vào Dashboard' : 'Trải nghiệm Demo'}
          </Button>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};
