import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Product } from "@/entities/product/api";
import { Button } from "@/shared/ui/Button";

interface ProductHeroProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onNavigateToSam?: () => void;
  landingPages?: any[];
  onNavigateToLandingPublic?: (bioSlug: string, landingSlug: string) => void;
  bioSlug?: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ 
  product, 
  onSelectProduct, 
  onNavigateToSam,
  landingPages,
  onNavigateToLandingPublic,
  bioSlug
}) => {
  const handleClick = () => {
    const matchedLanding = landingPages?.find(lp => lp.product_id === product.id);
    if (matchedLanding && onNavigateToLandingPublic && bioSlug) {
      onNavigateToLandingPublic(bioSlug, matchedLanding.slug);
    } else if (product.id === '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7d' && onNavigateToSam) {
      onNavigateToSam();
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left"
      style={{
        backgroundColor: 'var(--theme-card-bg)',
        borderColor: 'var(--theme-card-border)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <div className="absolute -inset-px bg-gradient-to-tr from-brand-orange/5 via-transparent to-brand-coral/10 rounded-3xl opacity-100 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

      {product.cover_image_url && (
        <div className="relative w-full md:w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden border border-border shadow-lg">
          <img 
            src={product.cover_image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 bg-brand-orange/95 backdrop-blur-sm text-foreground text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-md border border-brand-orange/30 tracking-wider">
            ⭐ Nổi bật
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
        <div className="space-y-2">
          <h4 className="text-lg font-black transition-colors leading-tight line-clamp-2 pt-2 md:pt-0" style={{ color: 'var(--theme-card-text)' }}>
            {product.name}
          </h4>
          <p className="text-xs opacity-70 line-clamp-3 leading-relaxed" style={{ color: 'var(--theme-card-text)' }}>
            {product.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>Đã bán: 94% (Giới hạn 100 slot giá tốt)</span>
            <span className="text-brand-orange font-bold font-mono">Chỉ còn 6 slot</span>
          </div>
          <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden border border-border">
            <div className="h-full bg-gradient-to-r from-brand-orange to-brand-coral rounded-full w-[94%] shadow-sm shadow-brand-orange/50 animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-brand-orange font-mono">
              {Number(product.price).toLocaleString('vi-VN')}đ
            </span>
            <span className="text-[10px] text-muted-foreground line-through font-mono">
              {(Number(product.price) * 2).toLocaleString('vi-VN')}đ
            </span>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-5 min-h-[44px]"
          >
            Sở hữu ngay
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
