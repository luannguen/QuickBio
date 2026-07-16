import { useState, useEffect } from 'react';
import { useAuth } from "@/shared/hooks/useAuth";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/DashboardPage";
import { BioBuilder } from "@/pages/BioBuilderPage";
import { PublicBio } from "@/pages/PublicBioPage";
import { KiemTienPage } from "@/pages/KiemTienPage";
import { AIVoiceLandingPage } from "@/pages/AIVoiceLandingPage";
import { AdminDashboard } from "@/pages/AdminPage";
import { BlogPage } from "@/pages/BlogPage";
import { ArticleDetailPage } from "@/pages/ArticleDetailPage";
import { SamTayNguyenLanding } from "@/pages/SamTayNguyenLanding";

type ViewType = 'landing' | 'dashboard' | 'bio-builder' | 'bio-public' | 'kiem-tien' | 'tong-dai-ai' | 'admin' | 'sam-tay-nguyen' | 'blog' | 'article';

function App() {
  const { user, loading } = useAuth();
  
  // Tự động lấy slug từ path của URL (ví dụ: localhost:5173/luannguyen -> slug là luannguyen)
  const getSlugFromPath = () => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const firstSegment = path.split('/')[0];
    if (!path || ['dashboard', 'bio-builder', 'landing', 'kiem-tien', 'tong-dai-ai', 'admin', 'sam-tay-nguyen', 'blog', 'article'].includes(firstSegment)) {
      return null;
    }
    return path; // User bio slug
  };

  const getInitialView = (): ViewType => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const firstSegment = path.split('/')[0];
    if (firstSegment === 'dashboard') return 'dashboard';
    if (firstSegment === 'bio-builder') return 'bio-builder';
    if (firstSegment === 'kiem-tien') return 'kiem-tien';
    if (firstSegment === 'tong-dai-ai') return 'tong-dai-ai';
    if (firstSegment === 'admin') return 'admin';
    if (firstSegment === 'sam-tay-nguyen') return 'sam-tay-nguyen';
    if (firstSegment === 'blog') return 'blog';
    if (firstSegment === 'article') return 'article';
    if (path && !['landing'].includes(path)) {
      return 'bio-public';
    }
    return 'landing';
  };

  const initialSlug = getSlugFromPath();
  const [view, setView] = useState<ViewType>(getInitialView());
  const [activeSlug, setActiveSlug] = useState<string>(initialSlug || 'luannguyen');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = path.split('/');
    if (segments[0] === 'article' && segments[1]) return segments[1];
    return '';
  });
  const [activeBlogSlug, setActiveBlogSlug] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = path.split('/');
    if (segments[0] === 'blog' && segments[1]) return segments[1];
    return 'platform';
  });

  // Xử lý Tiếp thị Liên kết (Affiliate Tracking)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      import('@/shared/api/supabase').then(async ({ supabase }) => {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('affiliate_code', refCode)
          .single();
        
        if (data && !error) {
          localStorage.setItem('quickbio_referrer', data.id);
          console.log('Đã ghi nhận mã giới thiệu:', refCode, 'ID:', data.id);
        }
      });
    }
  }, []);

  // Lắng nghe sự kiện click back/forward của trình duyệt để đồng bộ route
  useEffect(() => {
    const handlePopState = () => {
      const slug = getSlugFromPath();
      if (slug) {
        setActiveSlug(slug);
        setView('bio-public');
      } else {
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        const firstSegment = path.split('/')[0];
        if (firstSegment === 'dashboard' && user) {
          setView('dashboard');
        } else if (firstSegment === 'bio-builder' && user) {
          setView('bio-builder');
        } else if (firstSegment === 'kiem-tien') {
          setView('kiem-tien');
        } else if (firstSegment === 'tong-dai-ai') {
          setView('tong-dai-ai');
        } else if (firstSegment === 'admin') {
          setView('admin');
        } else if (firstSegment === 'sam-tay-nguyen') {
          setView('sam-tay-nguyen');
        } else if (firstSegment === 'blog') {
          setActiveBlogSlug(path.split('/')[1] || 'platform');
          setView('blog');
        } else if (firstSegment === 'article') {
          setActiveArticleSlug(path.split('/')[1] || '');
          setView('article');
        } else {
          setView('landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const navigateTo = (newView: ViewType, slug?: string) => {
    setView(newView);
    if (newView === 'bio-public' && slug) {
      setActiveSlug(slug);
      window.history.pushState({}, '', `/${slug}`);
    } else if (newView === 'blog') {
      const bSlug = slug || 'platform';
      setActiveBlogSlug(bSlug);
      window.history.pushState({}, '', `/blog${bSlug !== 'platform' ? `/${bSlug}` : ''}`);
    } else if (newView === 'article' && slug) {
      setActiveArticleSlug(slug);
      window.history.pushState({}, '', `/article/${slug}`);
    } else if (newView === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (newView === 'bio-builder') {
      window.history.pushState({}, '', '/bio-builder');
    } else if (newView === 'kiem-tien') {
      window.history.pushState({}, '', '/kiem-tien');
    } else if (newView === 'tong-dai-ai') {
      window.history.pushState({}, '', '/tong-dai-ai');
    } else if (newView === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (newView === 'sam-tay-nguyen') {
      window.history.pushState({}, '', '/sam-tay-nguyen');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Đang khởi tạo hệ thống...</p>
        </div>
      </div>
    );
  }

  // Render view tương ứng
  switch (view) {
    case 'landing':
      return (
        <LandingPage 
          onNavigateToDashboard={() => navigateTo('dashboard')}
          onNavigateToDemoBio={() => navigateTo('bio-public', 'luannguyen')}
          onNavigateToAIVoice={() => navigateTo('tong-dai-ai')}
        />
      );
    
    case 'dashboard':
      if (!user) {
        navigateTo('landing');
        return null;
      }
      return (
        <Dashboard 
          onNavigateToBioBuilder={() => navigateTo('bio-builder')}
          onNavigateToBioPublic={(slug) => navigateTo('bio-public', slug)}
        />
      );

    case 'bio-builder':
      if (!user) {
        navigateTo('landing');
        return null;
      }
      return (
        <BioBuilder 
          userId={user.id}
          onNavigateToDashboard={() => navigateTo('dashboard')}
        />
      );

    case 'bio-public':
      return (
        <PublicBio 
          slug={activeSlug}
          onNavigateToLanding={() => navigateTo('landing')}
          onNavigateToSam={() => navigateTo('sam-tay-nguyen')}
          onNavigateToArticle={(s) => navigateTo('article', s)}
        />
      );

    case 'kiem-tien':
      return (
        <KiemTienPage 
          onNavigateToLanding={() => navigateTo('landing')}
        />
      );
    
    case 'tong-dai-ai':
      return (
        <AIVoiceLandingPage 
          onNavigateToHome={() => navigateTo('landing')}
        />
      );

    case 'admin':
      return (
        <AdminDashboard 
          onNavigateToHome={() => navigateTo('landing')}
        />
      );

    case 'sam-tay-nguyen':
      return (
        <SamTayNguyenLanding 
          onNavigateToHome={() => navigateTo('landing')}
        />
      );
    case 'blog':
      return (
        <BlogPage 
          slug={activeBlogSlug}
          onNavigateToHome={() => navigateTo('landing')}
          onNavigateToArticle={(s) => navigateTo('article', s)}
        />
      );

    case 'article':
      return (
        <ArticleDetailPage 
          articleSlug={activeArticleSlug}
          onNavigateBack={() => window.history.back()}
          onNavigateToHome={() => navigateTo('landing')}
        />
      );
    
    default:
      return (
        <LandingPage 
          onNavigateToDashboard={() => navigateTo('dashboard')}
          onNavigateToDemoBio={() => navigateTo('bio-public', 'luannguyen')}
          onNavigateToAIVoice={() => navigateTo('tong-dai-ai')}
        />
      );
  }
}

export default App;
