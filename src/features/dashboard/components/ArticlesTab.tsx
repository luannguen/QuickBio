import React from 'react';
import { Plus, Edit2, Trash2, FileText, AlertCircle, EyeOff } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { useConfirm } from "@/shared/stores/useModalStore";

interface ArticlesTabProps {
  articles: any[];
  onAddArticleClick: () => void;
  onEditArticleClick: (article: any) => void;
  onDeleteArticle: (id: string) => void;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  onAddArticleClick,
  onEditArticleClick,
  onDeleteArticle
}) => {
  const confirm = useConfirm();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            Quản lý Bài viết (Blog)
          </h2>
          <p className="text-sm text-semantic-muted mt-1">Viết và quản lý các bài viết trên trang cá nhân của bạn.</p>
        </div>
        <Button onClick={onAddArticleClick} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Viết bài mới
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-semantic-muted" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Chưa có bài viết nào</h3>
          <p className="text-semantic-muted text-sm max-w-sm mx-auto mb-6">Bạn chưa viết bài nào. Hãy bắt đầu chia sẻ kiến thức hoặc giới thiệu sản phẩm của bạn qua các bài viết.</p>
          <Button onClick={onAddArticleClick}>Viết bài đầu tiên</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((a) => (
            <div key={a.id} className="bg-brand-card/50 border border-border p-4 rounded-xl space-y-4 hover:border-brand-orange/30 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base line-clamp-2">{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      {a.status === 'published' ? (
                        <span className="text-semantic-success flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-semantic-success"></div> Đã xuất bản</span>
                      ) : (
                        <span className="text-semantic-muted flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-semantic-muted"></div> Bản nháp</span>
                      )}
                      
                      {a.moderation_status === 'warned' && (
                        <span className="text-brand-orange flex items-center gap-1 px-1.5 py-0.5 bg-brand-orange/10 rounded-md border border-brand-orange/20">
                          <AlertCircle className="w-3 h-3" /> Bị cảnh cáo
                        </span>
                      )}
                      {a.moderation_status === 'suspended' && (
                        <span className="text-semantic-danger flex items-center gap-1 px-1.5 py-0.5 bg-semantic-danger/10 rounded-md border border-semantic-danger/20">
                          <EyeOff className="w-3 h-3" /> Đã ẩn
                        </span>
                      )}
                    </div>
                  </div>
                  {a.cover_image_url ? (
                    <img src={a.cover_image_url} alt="Cover" className="w-16 h-16 rounded-lg object-cover border border-border flex-shrink-0 ml-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex flex-shrink-0 ml-4 items-center justify-center border border-border">
                      <FileText className="w-6 h-6 text-semantic-muted" />
                    </div>
                  )}
                </div>
                
                {a.warning_message && (
                  <div className="text-xs p-2 bg-red-500/10 text-red-500 rounded-md border border-red-500/20">
                    <strong>Admin nhắn:</strong> {a.warning_message}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button 
                  onClick={() => onEditArticleClick(a)}
                  variant="secondary" 
                  className="flex-1 py-1.5 h-auto text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Sửa
                </Button>
                <Button 
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: 'Xoá bài viết',
                      message: 'Bạn có chắc chắn muốn xoá bài viết này?'
                    });
                    if (confirmed) {
                      onDeleteArticle(a.id);
                    }
                  }}
                  variant="ghost" 
                  className="px-3 py-1.5 h-auto text-xs text-semantic-danger hover:text-semantic-danger hover:bg-semantic-danger/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
