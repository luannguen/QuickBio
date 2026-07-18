import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { LandingPage } from '@/entities/landing/api';
import { landingService } from '@/entities/landing/api';
import { useToastStore } from '@/shared/stores/useToastStore';

interface LandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: LandingPage;
  userId: string;
  onSuccess: () => void;
}

export const LandingPageModal: React.FC<LandingPageModalProps> = ({ isOpen, onClose, page, userId, onSuccess }) => {
  const isEditing = !!page;
  const [loading, setLoading] = useState(false);
  const toast = useToastStore();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    logo_url: ''
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        description: page.description || '',
        logo_url: page.logo_url || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        logo_url: ''
      });
    }
  }, [page, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && page) {
        await landingService.updateLandingPage(page.id, {
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          logo_url: formData.logo_url
        });
        toast.success('Cập nhật thành công!');
      } else {
        await landingService.createLandingPage({
          user_id: userId,
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          logo_url: formData.logo_url,
          template_id: 'default',
          status: 'draft',
          config: {}
        });
        toast.success('Tạo landing page thành công!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-brand-card w-full max-w-md rounded-2xl border border-border shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-lg font-bold">{isEditing ? 'Chỉnh sửa Landing Page' : 'Tạo Landing Page mới'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold mb-2">Tên Landing Page *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 rounded-xl text-sm glass-input"
              placeholder="VD: Khoá học TikTok"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Đường dẫn (Slug) *</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">/landing/</span>
              <input 
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="flex-1 px-4 py-3 rounded-xl text-sm glass-input"
                placeholder="khoa-hoc-tiktok"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Logo URL (Tuỳ chọn)</label>
            <input 
              type="url" 
              value={formData.logo_url}
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
              className="w-full px-4 py-3 rounded-xl text-sm glass-input"
              placeholder="https://..."
            />
            <p className="text-[10px] text-muted-foreground mt-1">Sẽ hiển thị trên thanh menu thay vì tên dạng chữ.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mô tả (SEO)</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl text-sm glass-input min-h-[80px]"
              placeholder="Giới thiệu ngắn về trang này..."
            />
          </div>
        </form>

        <div className="p-4 sm:p-6 border-t border-border bg-black/20 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Hủy</Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </div>
    </div>
  );
};
