import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../../services/productService';
import { Button } from '../../../components/ui/Button';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToSam?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectProduct, onNavigateToSam }) => {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const handleClick = () => {
          if (product.id === '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7d' && onNavigateToSam) {
            onNavigateToSam();
          } else {
            onSelectProduct(product);
          }
        };

        return (
          <div 
            key={product.id} 
            className="glass-card rounded-3xl p-5 border border-border hover:border-brand-orange/20 hover:bg-muted/50.04] transition-all duration-300 flex flex-col sm:flex-row gap-5 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden group text-left cursor-pointer"
            onClick={handleClick}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/0 via-white/0 to-brand-coral/0 group-hover:from-brand-orange/[0.02] group-hover:to-brand-coral/[0.02] transition-colors duration-500 pointer-events-none"></div>

            <div className="absolute top-3 left-3 z-10">
              <span className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-lg border bg-brand-orange/20 text-brand-orange border-brand-orange/30 shadow-md">
                ⚡ Yêu Thích
              </span>
            </div>

            {product.cover_image_url && (
              <div className="relative w-full sm:w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-border">
                <img 
                  src={product.cover_image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
              <div className="space-y-1.5 text-left pt-2 sm:pt-0">
                <h4 className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>Đã bán: 91%</span>
                  <span className="text-brand-orange font-bold font-mono">Còn 9 slot</span>
                </div>
                <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-orange to-brand-coral rounded-full w-[91%]"></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-brand-orange font-mono">
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
                  variant="outline"
                  className="px-4 hover:bg-brand-orange hover:text-foreground hover:border-brand-orange/20 min-h-[44px]"
                >
                  Mua ngay
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
