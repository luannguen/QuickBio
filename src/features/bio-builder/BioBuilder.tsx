import React, { useState, useEffect } from 'react';
import { useBioBuilder } from '../../hooks/useBioBuilder';
import { bioService } from '../../services/bioService';
import { 
  Sparkles, 
  Save, 
  Layout, 
  Share2, 
  Settings, 
  Smartphone, 
  Check, 
  Loader2, 
  Link as LinkIcon 
} from 'lucide-react';
import { ImageUploader } from '../../components/ImageUploader';

interface BioBuilderProps {
  userId: string;
  onNavigateToDashboard: () => void;
}

export const BioBuilder: React.FC<BioBuilderProps> = ({ userId, onNavigateToDashboard }) => {
  const { 
    bio, 
    loading, 
    saving, 
    loadBio, 
    updateBioFields, 
    updateTheme, 
    updateSocialLinks, 
    saveBio 
  } = useBioBuilder();

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [slugInput, setSlugInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Bio khi render
  useEffect(() => {
    loadBio(userId);
  }, [userId, loadBio]);

  // Đồng bộ slug input khi bio load xong
  useEffect(() => {
    if (bio) {
      setSlugInput(bio.slug);
    }
  }, [bio]);

  // Kiểm tra trùng slug (Debounce 500ms)
  useEffect(() => {
    if (!bio || slugInput === bio.slug) {
      setSlugStatus('idle');
      return;
    }

    const cleanSlug = slugInput.trim().replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    if (cleanSlug.length < 3) {
      setSlugStatus('idle');
      return;
    }

    setSlugStatus('checking');
    const timer = setTimeout(async () => {
      const isAvailable = await bioService.checkSlugAvailable(cleanSlug, bio.id);
      if (isAvailable) {
        setSlugStatus('available');
        updateBioFields({ slug: cleanSlug });
      } else {
        setSlugStatus('taken');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slugInput, bio, updateBioFields]);

  if (loading || !bio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange mx-auto" />
          <p className="text-sm text-muted-foreground">Đang tải cấu hình Bio...</p>
        </div>
      </div>
    );
  }

  // Danh sách các template background gợi ý
  const backgrounds = [
    { name: 'Dark Nebula', value: 'linear-gradient(135deg, #0b0f19 0%, #161f30 100%)' },
    { name: 'Warm Sunset', value: 'linear-gradient(135deg, #1e1b4b 0%, #31102f 50%, #450a0a 100%)' },
    { name: 'Cyberpunk Purple', value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)' },
    { name: 'Green Commerce', value: 'linear-gradient(135deg, #062f17 0%, #0d1e15 100%)' },
    { name: 'Pure Midnight', value: '#080B11' },
    { name: 'Cool Slate', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }
  ];

  // Danh sách các màu accent gợi ý
  const accents = ['#FF6B35', '#F7C59F', '#7CB342', '#38BDF8', '#EC4899', '#10B981'];

  const handleSave = async () => {
    setErrorMessage('');
    setSaveSuccess(false);

    if (slugStatus === 'taken') {
      setErrorMessage('Đường dẫn (slug) đã bị người khác sử dụng!');
      return;
    }

    const success = await saveBio();
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setErrorMessage('Không thể lưu thay đổi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sub Header */}
      <header className="border-b border-border bg-brand-dark/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateToDashboard}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Quay lại Dashboard
          </button>
          <span className="text-muted-foreground">|</span>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-brand-orange" />
            Trình thiết kế Bio-Link
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-green-400 font-semibold animate-pulse">
              ✓ Đã lưu thành công
            </span>
          )}
          {errorMessage && (
            <span className="text-xs text-red-400 font-semibold">
              ⚠ {errorMessage}
            </span>
          )}
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 touch-target"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Lưu thay đổi
          </button>
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Editor Form */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-70px)] border-r border-border">
          
          {/* Section 1: Thông tin chung */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Settings className="w-4 h-4 text-brand-orange" />
              1. Thông tin chung
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Slug link */}
              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2">Đường dẫn trang Bio (Slug)</label>
                <div className="flex rounded-xl overflow-hidden border border-border glass-input focus-within:border-brand-orange/40">
                  <span className="bg-muted/50 px-3 py-3 text-xs text-muted-foreground border-r border-border flex items-center select-none">
                    quickbio.vercel.app/
                  </span>
                  <input 
                    type="text" 
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="ten-cua-ban"
                    className="flex-1 bg-transparent px-3 py-3 text-xs text-foreground outline-none"
                  />
                  {slugStatus === 'checking' && (
                    <span className="p-3 flex items-center"><Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" /></span>
                  )}
                  {slugStatus === 'available' && (
                    <span className="p-3 flex items-center text-green-400 text-xs font-semibold">✓ Khả dụng</span>
                  )}
                  {slugStatus === 'taken' && (
                    <span className="p-3 flex items-center text-red-400 text-xs font-semibold">✗ Đã dùng</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">Chỉ dùng chữ, số, gạch ngang (-) và gạch dưới (_).</span>
              </div>

              {/* Title & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground font-semibold mb-2">Tiêu đề hiển thị (Họ tên)</label>
                  <input 
                    type="text" 
                    value={bio.title}
                    onChange={(e) => updateBioFields({ title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
                    placeholder="Nhập tên hiển thị"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground font-semibold mb-2">Ảnh đại diện trang cá nhân (Avatar)</label>
                  <ImageUploader 
                    value={bio.avatar_url || ''} 
                    onChange={(val) => updateBioFields({ avatar_url: val })}
                    label="Tải ảnh đại diện lên"
                    aspectRatio="square"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2">Giới thiệu bản thân (Bio text)</label>
                <textarea 
                  value={bio.bio_text}
                  onChange={(e) => updateBioFields({ bio_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input resize-none"
                  placeholder="Mô tả ngắn gọn về bạn, công việc hoặc định hướng của bạn."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Giao diện (Theme) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Layout className="w-4 h-4 text-brand-orange" />
              2. Thiết kế Giao diện (Theme)
            </h3>

            <div className="space-y-4">
              {/* Background gradient selection */}
              <div>
                <label className="block text-xs text-muted-foreground font-semibold mb-2.5">Hình nền (Background)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => updateTheme({ background: bg.value })}
                      className={`h-16 rounded-xl border p-2 text-left relative overflow-hidden transition-all transform active:scale-95 ${
                        bio.theme.background === bg.value 
                          ? 'border-brand-orange shadow-lg shadow-brand-orange/10' 
                          : 'border-border hover:border-border'
                      }`}
                      style={{ background: bg.value }}
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                        <span className="text-[10px] font-bold text-muted-foreground">{bg.name}</span>
                      </div>
                      {bio.theme.background === bg.value && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-orange flex items-center justify-center">
                          <Check className="w-3 h-3 text-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground font-semibold mb-2.5">Màu điểm nhấn (Accent Color)</label>
                  <div className="flex gap-2">
                    {accents.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateTheme({ accentColor: color })}
                        className={`w-8 h-8 rounded-full border relative transition-transform transform active:scale-90 ${
                          bio.theme.accentColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {bio.theme.accentColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center text-foreground font-bold">
                            <Check className="w-4 h-4 shadow-sm" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glassmorphic card toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-card/40 border border-border mt-5 sm:mt-0">
                  <div>
                    <span className="text-xs font-semibold block text-foreground">Hiệu ứng Kính (Glassmorphism)</span>
                    <span className="text-[10px] text-muted-foreground block">Tạo chiều sâu mờ ảo cho thẻ</span>
                  </div>
                  <button
                    onClick={() => updateTheme({ glassmorphism: !bio.theme.glassmorphism })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                      bio.theme.glassmorphism ? 'bg-brand-orange' : 'bg-muted/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 absolute ${
                      bio.theme.glassmorphism ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Liên kết mạng xã hội */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
              <Share2 className="w-4 h-4 text-brand-orange" />
              3. Liên kết Mạng xã hội
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Facebook', key: 'facebook' },
                { name: 'TikTok', key: 'tiktok' },
                { name: 'YouTube', key: 'youtube' },
                { name: 'Instagram', key: 'instagram' },
                { name: 'GitHub', key: 'github' },
                { name: 'Twitter', key: 'twitter' }
              ].map((social) => (
                <div key={social.key}>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-2">
                    <LinkIcon className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{social.name} URL</span>
                  </label>
                  <input 
                    type="text"
                    value={bio.social_links[social.key as keyof typeof bio.social_links] || ''}
                    onChange={(e) => updateSocialLinks({ [social.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-xs text-foreground glass-input"
                    placeholder={`https://${social.key}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Trạng thái xuất bản */}
          <div className="p-4 rounded-xl bg-brand-orange/5 border border-brand-orange/15 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground block">Trạng thái Trang Bio</span>
              <p className="text-[10px] text-muted-foreground">Đặt thành Công khai để hiển thị cho mọi người thấy và mua sản phẩm.</p>
            </div>
            <select
              value={bio.status}
              onChange={(e) => updateBioFields({ status: e.target.value as 'draft' | 'published' })}
              className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground outline-none focus:border-brand-orange"
            >
              <option value="draft">Nháp (Ẩn)</option>
              <option value="published">Công khai (Published)</option>
            </select>
          </div>

        </div>

        {/* Right Side: Live Preview (Mobile Mockup) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-brand-dark/30 max-h-[calc(100vh-70px)] select-none">
          <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-brand-orange animate-bounce" />
            XEM TRƯỚC TRÊN MOBILE (LIVE PREVIEW)
          </div>

          {/* Mobile frame container */}
          <div className="relative w-[340px] h-[640px] rounded-[48px] border-[10px] border-slate-800 bg-background shadow-2xl overflow-hidden flex flex-col">
            
            {/* Camera notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-30"></div>
            
            {/* Scrollable screen content */}
            <div 
              className="flex-1 overflow-y-auto px-5 pt-12 pb-10 flex flex-col items-center space-y-6"
              style={{ background: bio.theme.background, color: bio.theme.textColor }}
            >
              {/* Profile */}
              <div className="text-center space-y-3 pt-2">
                <img 
                  src={bio.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'} 
                  alt={bio.title} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-border mx-auto"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm tracking-tight">{bio.title || 'Họ và Tên'}</h4>
                  <p className="text-[10px] opacity-70 max-w-[200px] mx-auto line-clamp-2">{bio.bio_text || 'Giới thiệu ngắn gọn...'}</p>
                </div>
              </div>

              {/* Social Link preview */}
              <div className="flex gap-2 justify-center flex-wrap">
                {Object.entries(bio.social_links).map(([key, url]) => {
                  if (!url) return null;
                  return (
                    <div 
                      key={key}
                      className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-[10px]"
                    >
                      <LinkIcon className="w-3.5 h-3.5 opacity-80" />
                    </div>
                  );
                })}
              </div>

              {/* Shop Mockup title */}
              <div className="w-full space-y-3 pt-2">
                <div className="text-[10px] font-bold uppercase opacity-60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" style={{ color: bio.theme.accentColor }} />
                  Cửa hàng Sản phẩm số
                </div>

                {/* Mock product card */}
                <div 
                  className="rounded-xl p-3 flex gap-3 text-left"
                  style={{
                    backgroundColor: bio.theme.glassmorphism ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    border: bio.theme.glassmorphism ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}
                >
                  <div className="w-16 h-16 bg-muted/50 rounded-lg border border-border flex-shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                    Product
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs truncate">Tên Sản phẩm Số mẫu</div>
                      <div className="text-[9px] opacity-50 line-clamp-1 mt-0.5">Mô tả sản phẩm số ngắn gọn...</div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-xs" style={{ color: bio.theme.accentColor }}>150.000đ</span>
                      <button 
                        className="px-2.5 py-1 text-[9px] font-bold rounded-lg text-foreground"
                        style={{ backgroundColor: bio.theme.accentColor }}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default BioBuilder;
