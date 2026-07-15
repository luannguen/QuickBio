import React from 'react';
import { ShoppingBag, Sparkles, X, CheckCircle, Clock } from 'lucide-react';
import type { BioLink } from '../../../services/bioService';
import type { Product } from '../../../services/productService';
import { CountdownBanner } from './CountdownBanner';
import { ProfileHeader } from './ProfileHeader';
import { SocialLinks } from './SocialLinks';
import { ProductHero } from './ProductHero';
import { ProductGrid } from './ProductGrid';
import { CheckoutModal } from '../../../components/CheckoutModal';

interface PublicBioLayoutProps {
  bio: BioLink;
  products: Product[];
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
  formattedTime: string;
  showToast: boolean;
  toastData: { name: string; product: string; time: string };
  onNavigateToLanding?: () => void;
  onNavigateToSam?: () => void;
}

export const PublicBioLayout: React.FC<PublicBioLayoutProps> = ({
  bio,
  products,
  activeProduct,
  setActiveProduct,
  formattedTime,
  showToast,
  toastData,
  onNavigateToLanding,
  onNavigateToSam,
}) => {
  const themeStyle = {
    background: bio.theme?.background || 'linear-gradient(135deg, #0b0f19 0%, #161f30 100%)',
    color: bio.theme?.textColor || '#ffffff',
  };

  return (
    <div className="min-h-screen pb-20 flex justify-center relative overflow-hidden" style={themeStyle}>
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {/* Background Mesh Blurs for Premium Visuals */}
      <div className="absolute top-[10%] left-[-20%] w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-20%] w-[350px] h-[350px] bg-brand-coral/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sticky Countdown Banner (FOMO) */}
      <CountdownBanner formattedTime={formattedTime} />

      <div className="w-full max-w-lg px-4 pt-24 space-y-8 relative z-10">
        {/* Profile Card */}
        <ProfileHeader avatarUrl={bio.avatar_url} title={bio.title} bioText={bio.bio_text} />

        {/* Social Links */}
        <SocialLinks socialLinks={bio.social_links} />

        {/* DigiStore Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold tracking-widest uppercase opacity-55 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-orange animate-bounce-slow" />
              Cửa hàng Sản phẩm số
            </h3>
            <span className="text-[10px] bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Giao file tự động qua Email
            </span>
          </div>

          {products.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center border border-white/5 space-y-2">
              <p className="text-sm opacity-50">Hiện chưa có sản phẩm nào được đăng bán.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured Product Hero Banner */}
              {products[0] && (
                <ProductHero
                  product={products[0]}
                  onSelectProduct={setActiveProduct}
                  onNavigateToSam={onNavigateToSam}
                />
              )}

              {/* Remaining products list */}
              {products.length > 1 && (
                <ProductGrid
                  products={products.slice(1)}
                  onSelectProduct={setActiveProduct}
                  onNavigateToSam={onNavigateToSam}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer (Nút quảng cáo QuickBio) */}
        <div className="text-center pt-10">
          <button
            onClick={() => {
              if (bio?.user_id) {
                localStorage.setItem('quickbio_referrer', bio.user_id);
              }
              onNavigateToLanding?.();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-xs text-white/70 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Tạo Bio Link & DigiStore miễn phí</span>
          </button>
        </div>

        {/* Checkout Modal */}
        {activeProduct && (
          <CheckoutModal
            product={activeProduct}
            creatorId={bio.user_id}
            onClose={() => setActiveProduct(null)}
          />
        )}

        {/* Social Proof Toast */}
        <div
          className={`fixed top-20 left-4 right-4 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 glass-panel border border-white/10 rounded-xl p-4 shadow-2xl transition-all duration-700 z-50 ${
            showToast ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] sm:translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-start gap-3 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Ta ẩn toast trực tiếp bằng cách click
              }}
              className="absolute -top-2 -right-2 p-2.5 text-white/40 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-bold text-white">
                {toastData.name} <span className="font-normal text-white/70">vừa chốt sale</span>
              </p>
              <p className="text-xs text-brand-orange font-medium line-clamp-1">{toastData.product}</p>
              <p className="text-[10px] text-white/40 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {toastData.time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
