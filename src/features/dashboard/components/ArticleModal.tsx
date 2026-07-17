import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { MediaPicker } from "@/shared/components/media/MediaPicker";
import { useAuth } from "@/shared/hooks/useAuth";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  status: 'draft' | 'published';
  setStatus: (v: 'draft' | 'published') => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isEditing: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  title, setTitle,
  slug, setSlug,
  excerpt, setExcerpt,
  content, setContent,
  coverImage, setCoverImage,
  status, setStatus,
  onSubmit,
  loading,
  isEditing
}) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-brand-card w-full sm:max-w-2xl rounded-t-3xl rounded-b-none sm:rounded-2xl border-t sm:border border-border shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 sm:hidden flex-shrink-0" />

        <div className="p-5 sm:p-6 border-b border-border flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold">{isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="w-5 h-5 text-semantic-muted" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="article-form" onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tiêu đề bài viết</Label>
              <Input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Đường dẫn tĩnh (Slug)</Label>
              <Input
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="tieu-de-bai-viet"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Mô tả ngắn gọn (Excerpt)</Label>
              <Input
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="Mô tả..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nội dung (HTML/Text)</Label>
              <textarea
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết..."
                className="w-full h-40 bg-brand-black border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <MediaPicker 
                userId={user?.id || ''}
                value={coverImage} 
                onChange={setCoverImage} 
                label="Ảnh đại diện"
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-brand-black border border-border rounded-xl px-4 h-12 text-sm focus:outline-none focus:border-brand-orange"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 flex-shrink-0">
          <Button variant="secondary" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" form="article-form" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu lại'}
          </Button>
        </div>
      </div>
    </div>
  );
};
