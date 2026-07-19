import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import type { LandingPage } from '@/entities/landing/api';
import { landingService } from '@/entities/landing/api';
import { useToastStore } from '@/shared/stores/useToastStore';
import { ResponsiveModal } from '@/shared/ui/ResponsiveModal';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const footer = (
    <div className="flex gap-3 w-full">
      <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Hủy</Button>
      <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
      </Button>
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh sửa Landing Page' : 'Tạo Landing Page mới'}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-2 block">Tên Landing Page *</Label>
          <Input 
            type="text" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="VD: Khoá học TikTok"
            required
          />
        </div>

        <div>
          <Label className="mb-2 block">Đường dẫn (Slug) *</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">/landing/</span>
            <Input 
              type="text" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              placeholder="khoa-hoc-tiktok"
              className="flex-1"
              required
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Logo URL (Tuỳ chọn)</Label>
          <Input 
            type="url" 
            value={formData.logo_url}
            onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
            placeholder="https://..."
          />
          <p className="text-[10px] text-muted-foreground mt-1">Sẽ hiển thị trên thanh menu thay vì tên dạng chữ.</p>
        </div>

        <div>
          <Label className="mb-2 block">Mô tả (SEO)</Label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 rounded-xl text-sm glass-input min-h-[80px]"
            placeholder="Giới thiệu ngắn về trang này..."
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};
