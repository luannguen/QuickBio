import React, { useEffect, useState } from 'react';
import { GlobalHeader } from '@/shared/components/layout/GlobalHeader';
import { articleService } from '@/entities/article/api';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface ArticleDetailPageProps {
  articleSlug: string;
  onNavigateBack: () => void;
  onNavigateToHome: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ articleSlug, onNavigateBack, onNavigateToHome }) => {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await articleService.getPublicArticleBySlug(articleSlug);
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (articleSlug) {
      fetchArticle();
    }
  }, [articleSlug]);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader onNavigateToHome={onNavigateToHome} />
      
      <main className="container max-w-3xl mx-auto px-4 py-24">
        <Button 
          variant="ghost" 
          onClick={onNavigateBack}
          className="mb-8 text-semantic-muted hover:text-foreground pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        ) : !article ? (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h1>
            <p className="text-semantic-muted mb-6">Bài viết này có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
            <Button onClick={onNavigateToHome}>Về trang chủ</Button>
          </div>
        ) : (
          <article className="animate-fade-in">
            {article.cover_image_url && (
              <div className="w-full aspect-[2/1] rounded-3xl overflow-hidden mb-8 border border-border">
                <img 
                  src={article.cover_image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-semantic-muted mb-12 pb-8 border-b border-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div 
              className="prose prose-invert prose-brand max-w-none prose-headings:text-foreground prose-p:text-semantic-muted prose-a:text-brand-orange hover:prose-a:text-brand-orange/80 prose-img:rounded-2xl prose-img:border prose-img:border-border"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        )}
      </main>
    </div>
  );
};
