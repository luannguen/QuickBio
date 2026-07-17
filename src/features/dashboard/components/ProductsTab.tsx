import type { Product } from "@/entities/product/api";
import { ShoppingBag, Plus, Eye, Trash2 } from 'lucide-react';

interface ProductsTabProps {
  products: Product[];
  onAddProductClick: () => void;
  onEditProductClick: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onAddProductClick,
  onEditProductClick,
  onDeleteProduct,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-orange" />
          Danh sách sản phẩm
        </h3>
        <button 
          onClick={onAddProductClick}
          className="px-3.5 py-2 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 touch-target"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </button>
      </div>

      {products.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl border border-border text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-foreground text-sm">Chưa có sản phẩm nào</h4>
            <p className="text-xs text-muted-foreground">Hãy tạo sản phẩm (số hoặc vật lý) đầu tiên để bán lấy doanh thu.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="glass-card rounded-2xl p-5 border border-border hover:border-border transition-all flex flex-col justify-between space-y-4">
              <div className="flex gap-4">
                <img 
                  src={p.cover_image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&h=100&q=80'} 
                  alt={p.name} 
                  className="w-16 h-16 object-cover rounded-xl border border-white/15"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-foreground truncate">{p.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">{p.description}</p>
                  <span className="text-[10px] mt-2 inline-block font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                    {p.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${p.product_type === 'physical' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {p.product_type === 'physical' ? 'Vật lý' : 'SP Số'}
                  </span>
                  {p.product_type === 'physical' && (
                    <span className="text-[10px] text-muted-foreground">
                      Kho: {p.is_unlimited ? '∞' : p.inventory_count}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {p.product_type === 'digital' && p.file_url && (
                    <button
                      onClick={() => window.open(p.file_url || '', '_blank')}
                      className="px-2.5 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 hover:border-brand-orange/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      title="Xem trước File Sản phẩm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Xem File
                    </button>
                  )}
                  <button
                    onClick={() => onEditProductClick(p)}
                    className="px-2.5 py-1.5 hover:bg-muted/50 border border-border hover:border-border text-xs font-semibold rounded-lg transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-1.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
