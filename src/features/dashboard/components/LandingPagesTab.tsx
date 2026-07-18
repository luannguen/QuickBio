import React, { useEffect, useState } from 'react';
import { landingService } from '@/entities/landing/api';
import type { LandingPage } from '@/entities/landing/api';
import { Button } from '@/shared/ui/Button';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Plus, LayoutTemplate, Globe, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { useConfirm } from '@/shared/stores/useModalStore';
import { LandingPageModal } from './LandingPageModal';

interface LandingPagesTabProps {
  userId: string;
  userPlan: 'free' | 'pro' | 'premium';
  userSlug: string;
  onProUpgradeClick: () => void;
}

export const LandingPagesTab: React.FC<LandingPagesTabProps> = ({ userId, userPlan, userSlug, onProUpgradeClick }) => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | undefined>(undefined);
  const toast = useToastStore();
  const confirm = useConfirm();

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await landingService.getLandingPagesByUserId(userId);
      setPages(data);
    } catch (e) {
      toast.error('Lỗi khi tải dữ liệu landing page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, [userId]);

  const maxPages = userPlan === 'premium' ? 9999 : userPlan === 'pro' ? 5 : 1;
  const canCreate = pages.length < maxPages;

  const handleCreate = () => {
    if (!canCreate) {
      toast.error(`Gói ${userPlan.toUpperCase()} chỉ cho phép tạo tối đa ${maxPages} trang.`);
      if (userPlan !== 'premium') {
        onProUpgradeClick();
      }
      return;
    }
    setEditingPage(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (page: LandingPage) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    const isConfirmed = await confirm({
      title: 'Xóa Landing Page',
      message: `Bạn có chắc chắn muốn xóa "${title}" không? Hành động này không thể hoàn tác.`,
      confirmText: 'Xóa',
      variant: 'danger'
    });
    if (!isConfirmed) return;

    try {
      await landingService.deleteLandingPage(id);
      toast.success('Đã xóa thành công!');
      loadPages();
    } catch (e) {
      toast.error('Lỗi khi xóa landing page.');
    }
  };

  const handleToggleStatus = async (page: LandingPage) => {
    const newStatus = page.status === 'active' ? 'archived' : 'active';
    
    // Kiểm tra giới hạn nếu muốn active
    if (newStatus === 'active') {
      const activeCount = pages.filter(p => p.status === 'active').length;
      if (activeCount >= maxPages) {
        toast.error(`Gói ${userPlan.toUpperCase()} chỉ cho phép tối đa ${maxPages} trang hoạt động.`);
        if (userPlan !== 'premium') {
          onProUpgradeClick();
        }
        return;
      }
    }

    try {
      await landingService.updateLandingPage(page.id, { status: newStatus });
      toast.success(newStatus === 'active' ? 'Đã kích hoạt trang!' : 'Đã lưu trữ trang!');
      loadPages();
    } catch (e) {
      toast.error('Lỗi khi cập nhật trạng thái.');
    }
  };

  if (loading) return <div className="p-8 text-center text-semantic-muted">Đang tải...</div>;

  const activePagesCount = pages.filter(p => p.status === 'active').length;
  const isOverLimit = activePagesCount > maxPages;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-orange" />
            Landing Pages
          </h2>
          <p className="text-xs text-semantic-muted mt-1">
            Quản lý các trang đích. Gói <strong>{userPlan.toUpperCase()}</strong>: Hoạt động {activePagesCount}/{maxPages === 9999 ? '∞' : maxPages}.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Mới
        </Button>
      </div>

      {isOverLimit && (
        <div className="bg-semantic-error/10 border border-semantic-error/20 p-4 rounded-xl flex items-start gap-3 text-semantic-error text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Vượt quá giới hạn!</strong> Gói của bạn hiện tại chỉ hỗ trợ {maxPages} trang hoạt động, nhưng bạn đang có {activePagesCount} trang. Vui lòng tắt bớt các trang (Chuyển sang "Lưu trữ") để tuân thủ quy định gói, hoặc nâng cấp tài khoản.
            {userPlan !== 'premium' && (
              <div className="mt-2">
                <Button size="sm" variant="secondary" onClick={onProUpgradeClick}>Nâng cấp ngay</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {!canCreate && !isOverLimit && (
        <div className="bg-semantic-warning/10 border border-semantic-warning/20 p-4 rounded-xl flex items-start gap-3 text-semantic-warning text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Đã đạt giới hạn.</strong> Bạn không thể tạo thêm Landing Page. Vui lòng nâng cấp tài khoản để tạo thêm nhiều trang đích chuyên nghiệp hơn.
            {userPlan !== 'premium' && (
              <div className="mt-2">
                <Button size="sm" variant="secondary" onClick={onProUpgradeClick}>Nâng cấp ngay</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {pages.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <LayoutTemplate className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-semibold mb-1">Chưa có Landing Page</h3>
          <p className="text-xs text-semantic-muted mb-4 max-w-sm mx-auto">
            Tạo landing page đầu tiên của bạn để giới thiệu sản phẩm và tăng tỷ lệ chuyển đổi.
          </p>
          <Button onClick={handleCreate} variant="secondary" size="sm">
            Tạo ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((p) => (
            <div key={p.id} className={`border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group transition-colors ${
              p.status === 'active' ? 'border-border hover:border-brand-orange/30' : 'border-dashed border-muted bg-muted/10'
            }`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className={`font-bold text-sm ${p.status === 'active' ? 'text-foreground' : 'text-semantic-muted'}`}>{p.title}</h3>
                  <div className="text-xs font-mono text-semantic-muted flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    /{userSlug}/landing/{p.slug}
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleStatus(p)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-colors hover:opacity-80 ${
                  p.status === 'active' ? 'bg-semantic-success/20 text-semantic-success' : 
                  p.status === 'archived' ? 'bg-semantic-warning/20 text-semantic-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {p.status === 'active' ? 'Đang hoạt động' : 'Lưu trữ'}
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-xs" 
                  onClick={() => window.open(`/${userSlug}/landing/${p.slug}`, '_blank')}
                  disabled={p.status !== 'active'}
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Xem
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => handleEdit(p)}>
                  <Edit className="w-3 h-3 mr-1" />
                  Sửa
                </Button>
                <Button variant="ghost" size="sm" className="text-semantic-error hover:bg-semantic-error/10 hover:text-semantic-error" onClick={() => handleDelete(p.id, p.title)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <LandingPageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        page={editingPage}
        userId={userId}
        onSuccess={() => {
          setIsModalOpen(false);
          loadPages();
        }}
      />
    </div>
  );
};
