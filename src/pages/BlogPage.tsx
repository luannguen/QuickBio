import React, { useEffect, useState } from 'react';
import { GlobalHeader } from '@/shared/components/layout/GlobalHeader';
import { articleService } from '@/entities/article/api';
import { bioService } from '@/entities/bio/api';
import { Loader2, FileText, Calendar } from 'lucide-react';

interface BlogPageProps {
  slug: string; // 'platform' or tenant slug
  onNavigateToHome: () => void;
  onNavigateToArticle: (articleSlug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ slug, onNavigateToHome, onNavigateToArticle }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug === 'platform') {
          // Fetch platform articles (where user_id is the super admin, or we can just fetch all without tenant constraint if we had a platform flag. For now, fetch public articles)
          const data = await articleService.getPublicArticles(null); // Assuming null means platform or we need a specific platform ID. We'll just fetch recent public articles for now.
          setArticles(data || []);
        } else {
          // Fetch tenant bio first to get user_id
          const bioData = await bioService.getBioBySlug(slug);
          if (bioData) {
            setBio(bioData);
            const data = await articleService.getPublicArticles(bioData.user_id);
            setArticles(data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader onNavigateToHome={onNavigateToHome} />
      
      <main className="container max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {slug === 'platform' ? 'Tin tức & Cập nhật' : (bio ? `Blog của ${bio.display_name || slug}` : 'Blog')}
          </h1>
          <p className="text-semantic-muted text-lg">
            {slug === 'platform' ? 'Những thông tin mới nhất từ QuickBio.' : 'Chia sẻ kiến thức, kinh nghiệm và cập nhật mới.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border">
            <FileText className="w-12 h-12 text-semantic-muted mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa có bài viết nào</h2>
            <p className="text-semantic-muted">Quay lại sau nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map(article => (
              <div 
                key={article.id} 
                onClick={() => onNavigateToArticle(article.slug)}
                className="group cursor-pointer bg-brand-card rounded-2xl border border-border overflow-hidden hover:border-brand-orange/50 transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.1)] flex flex-col"
              >
                {article.cover_image_url ? (
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img 
                      src={article.cover_image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                    <FileText className="w-12 h-12 text-semantic-muted/50" />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-semantic-muted text-sm mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-semantic-muted pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
