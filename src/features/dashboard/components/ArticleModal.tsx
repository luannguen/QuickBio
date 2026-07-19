import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { MediaPicker } from "@/shared/components/media/MediaPicker";
import { useAuth } from "@/shared/hooks/useAuth";
import { ResponsiveModal } from "@/shared/ui/ResponsiveModal";

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

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}
      className="max-w-2xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" form="article-form" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu lại'}
          </Button>
        </div>
      }
    >
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
    </ResponsiveModal>
  );
};
