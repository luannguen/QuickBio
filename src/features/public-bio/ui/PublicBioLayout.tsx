import React, { useState } from 'react';
import { ShoppingBag, Sparkles, X, CheckCircle, Clock, FileText, Calendar, Home, LayoutDashboard } from 'lucide-react';
import type { BioLink } from "@/entities/bio/api";
import type { Product } from "@/entities/product/api";
import { CountdownBanner } from './CountdownBanner';
import { ProfileHeader } from './ProfileHeader';
import { SocialLinks } from './SocialLinks';
import { ProductHero } from './ProductHero';
import { ProductGrid } from './ProductGrid';
import { BioBlocksRenderer } from './BioBlocksRenderer';
import { CheckoutModal } from '../../../components/CheckoutModal';
import { Button } from "@/shared/ui/Button";
import { BIO_THEMES } from "../config/themes";

interface PublicBioLayoutProps {
  bio: BioLink;
  products: Product[];
  articles?: any[];
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
  formattedTime: string;
  showToast: boolean;
  toastData: { name: string; product: string; time: string };
  currentUserId?: string;
  onNavigateToDashboard?: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToSam?: () => void;
  onNavigateToArticle?: (slug: string) => void;
}

export const PublicBioLayout: React.FC<PublicBioLayoutProps> = ({
  bio,
  products,
  articles,
  activeProduct,
  setActiveProduct,
  formattedTime,
  showToast,
  toastData,
  currentUserId,
  onNavigateToDashboard,
  onNavigateToLanding,
  onNavigateToSam,
  onNavigateToArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'blog'>('store');
  const isOwner = currentUserId === bio.user_id;

  const currentThemeId = bio.theme_id || 'glassmorphism';
  const themeConfig = BIO_THEMES[currentThemeId] || BIO_THEMES['glassmorphism'];

  // Bio background explicitly set takes precedence over theme background
  const themeStyle = {
    background: bio.theme?.background || themeConfig.styles.backgroundImage || themeConfig.colors.background,
    color: themeConfig.colors.text,
    fontFamily: themeConfig.styles.fontFamily,
    '--theme-accent': bio.theme?.accentColor || themeConfig.colors.accent,
    '--theme-card-bg': themeConfig.colors.cardBg,
    '--theme-card-border': themeConfig.colors.cardBorder,
    '--theme-card-text': themeConfig.colors.cardText,
  } as React.CSSProperties;

  const glassmorphism = bio.theme?.glassmorphism ?? themeConfig.styles.glassmorphism;

  return (
    <div className="min-h-screen pb-20 flex justify-center relative overflow-hidden" style={themeStyle}>
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {/* Background Mesh Blurs for Premium Visuals */}
      <div className="absolute top-[10%] left-[-20%] w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-20%] w-[350px] h-[350px] bg-brand-coral/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sticky Countdown Banner (FOMO) */}
      <CountdownBanner formattedTime={formattedTime} />

      {/* Fixed Home Button */}
      <button
        onClick={onNavigateToLanding}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors shadow-lg flex items-center justify-center min-w-[44px] min-h-[44px]"
        aria-label="Về trang chủ QuickBio"
      >
        <Home className="w-5 h-5" />
      </button>

      <div className="w-full max-w-lg px-4 pt-24 space-y-8 relative z-10">
        {/* Profile Card */}
        <ProfileHeader avatarUrl={bio.avatar_url} title={bio.title} bioText={bio.bio_text} />

        {/* Social Links */}
        <SocialLinks socialLinks={bio.social_links} userId={bio.user_id} />

        {/* Custom Drag & Drop Blocks */}
        {bio.blocks && bio.blocks.length > 0 && (
          <div className="py-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <BioBlocksRenderer 
              userId={bio.user_id}
              blocks={bio.blocks} 
              products={products} 
              onSelectProduct={setActiveProduct}
              accentColor={bio.theme?.accentColor || themeConfig.colors.accent}
              glassmorphism={glassmorphism}
              themeConfig={themeConfig}
            />
          </div>
        )}

        {/* Unified Storefront Tabs */}
        <div className="flex bg-black/20 backdrop-blur-md rounded-2xl p-1 border border-border/50">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'store'
                ? 'bg-brand-orange/20 text-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Cửa hàng
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'blog'
                ? 'bg-brand-orange/20 text-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            Bài viết
          </button>
        </div>

        {/* DigiStore Section */}
        {activeTab === 'store' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              <div className="glass-card rounded-3xl p-10 text-center border border-border space-y-2">
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
        )}

        {/* Blog Section */}
        {activeTab === 'blog' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(!articles || articles.length === 0) ? (
              <div className="glass-card rounded-3xl p-10 text-center border border-border space-y-2">
                <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm opacity-50">Hiện chưa có bài viết nào.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onNavigateToArticle?.(article.slug)}
                    className="glass-card rounded-2xl border border-border p-3 flex gap-4 cursor-pointer hover:border-brand-orange/50 transition-all hover:bg-white/5 active:scale-[0.98]"
                  >
                    {article.cover_image_url ? (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-border/50 bg-black/20">
                        <img 
                          src={article.cover_image_url} 
                          alt={article.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl bg-black/20 flex items-center justify-center border border-border/50">
                        <FileText className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    <div className="flex flex-col py-1 flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 mb-1 group-hover:text-brand-orange transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt || "Đang cập nhật nội dung bài viết..."}
                      </p>
                      
                      <div className="mt-auto flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-orange font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer (Nút quảng cáo QuickBio - Ẩn đi nếu là Pro/Premium) */}
        {(bio.subscription_tier === 'free' || !bio.hide_watermark) && (
          <div className="text-center pt-10">
            <Button
              onClick={() => {
                if (bio?.user_id) {
                  localStorage.setItem('quickbio_referrer', bio.user_id);
                }
                onNavigateToLanding?.();
              }}
              variant="ghost"
              className="rounded-full glass-panel border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-orange mr-2" />
              <span>⚡ Powered by QuickBio</span>
            </Button>
          </div>
        )}

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
          className={`fixed top-20 left-4 right-4 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 glass-panel border border-border rounded-xl p-4 shadow-2xl transition-all duration-700 z-50 ${
            showToast ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] sm:translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-start gap-3 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Ta ẩn toast trực tiếp bằng cách click
              }}
              className="absolute -top-2 -right-2 p-2.5 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-bold text-foreground">
                {toastData.name} <span className="font-normal text-muted-foreground">vừa chốt sale</span>
              </p>
              <p className="text-xs text-brand-orange font-medium line-clamp-1">{toastData.product}</p>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {toastData.time}
              </p>
            </div>
          </div>
        </div>
        </div>
      
      {/* Floating Management Button for Owner */}
      {isOwner && (
        <button
          onClick={onNavigateToDashboard}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-brand-orange text-white font-bold rounded-full shadow-[0_4px_20px_rgba(255,107,0,0.4)] hover:bg-brand-orange/90 transition-all hover:scale-105 min-h-[44px]"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="hidden sm:inline">Quản lý trang Bio</span>
        </button>
      )}
    </div>
  );
};
