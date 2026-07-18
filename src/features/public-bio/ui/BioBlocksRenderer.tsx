import React, { useState, useEffect } from 'react';
import type { BioBlock } from '@/entities/bio/api';
import type { Product } from '@/entities/product/api';
import { ExternalLink, ShoppingBag, Timer, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { analyticsService } from '@/entities/analytics/api';
import { leadService } from '@/entities/lead/api';
import type { ThemeConfig } from '../config/themes';

interface BioBlocksRendererProps {
  userId?: string;
  blocks: BioBlock[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  accentColor?: string;
  glassmorphism?: boolean;
  themeConfig?: ThemeConfig;
}

const CountdownRenderer: React.FC<{ block: BioBlock; style: any; accentColor: string }> = ({ block, style, accentColor }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    if (!block.expires_at) return;
    const target = new Date(block.expires_at).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(null);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [block.expires_at]);

  if (!timeLeft) return null; // Hoặc render chữ "Đã hết hạn"

  return (
    <div 
      className="w-full flex flex-col p-4 rounded-2xl relative overflow-hidden group shadow-lg border-2"
      style={{ ...style, borderColor: `${accentColor}80` }}
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: accentColor, opacity: 0.8 }} />
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5" style={{ color: accentColor }} />
        <span className="font-bold text-sm">{block.title || 'Ưu đãi đặc biệt!'}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{block.discount_text}</p>
      
      <div className="flex justify-center gap-3 w-full">
        {[
          { label: 'Ngày', value: timeLeft.d },
          { label: 'Giờ', value: timeLeft.h },
          { label: 'Phút', value: timeLeft.m },
          { label: 'Giây', value: timeLeft.s },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-xl text-lg font-black shadow-inner"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: accentColor }}
            >
              {item.value.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] mt-1 text-muted-foreground uppercase font-bold tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadFormRenderer: React.FC<{ block: BioBlock; style: any; accentColor: string; userId?: string }> = ({ block, style, accentColor, userId }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    if (userId) {
      analyticsService.logEvent({
        user_id: userId,
        event_type: 'LEAD',
        block_id: block.id,
        metadata: { email }
      });

      // Submit lead to DB
      const success = await leadService.submitLead(userId, email, block.id);
      if (success) {
        setSubmitted(true);
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="w-full flex flex-col p-4 rounded-2xl relative shadow-lg"
      style={style}
    >
      <h3 className="font-bold text-sm mb-2">{block.title || 'Đăng ký nhận quà'}</h3>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-xs font-bold text-green-400">Đăng ký thành công!</p>
          <p className="text-[10px] text-muted-foreground mt-1">Kiểm tra email của bạn nhé.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full mt-2">
          <input 
            type="email" 
            placeholder="Nhập email của bạn..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl glass-input border border-border bg-black/20 focus:border-brand-orange outline-none transition-colors"
            required
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-xl px-4 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? '...' : (block.button_text || <Send className="w-4 h-4" />)}
          </Button>
        </form>
      )}
    </div>
  );
};

export const BioBlocksRenderer: React.FC<BioBlocksRendererProps> = ({ 
  userId,
  blocks, 
  products, 
  onSelectProduct,
  accentColor = '#FF4500',
  glassmorphism = true,
  themeConfig
}) => {
  if (!blocks || blocks.length === 0) return null;

  const visibleBlocks = blocks.filter(b => b.is_visible !== false);

  const blockStyle = {
    backgroundColor: themeConfig ? themeConfig.colors.cardBg : (glassmorphism ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'),
    backdropFilter: glassmorphism ? 'blur(10px)' : 'none',
    border: `1px solid ${themeConfig ? themeConfig.colors.cardBorder : (glassmorphism ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb')}`,
    color: themeConfig ? themeConfig.colors.cardText : 'inherit'
  };

  const handleTrackClick = (blockId: string) => {
    if (userId) {
      analyticsService.logEvent({
        user_id: userId,
        event_type: 'CLICK',
        block_id: blockId
      });
    }
  };

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      {visibleBlocks.map(block => {
        if (block.type === 'LINK') {
          return (
            <a 
              key={block.id}
              href={block.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleTrackClick(block.id)}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group shadow-lg"
              style={blockStyle}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <ExternalLink className="w-5 h-5 text-white/80" />
              </div>
              <span className="flex-1 px-4 font-bold text-center text-sm">{block.title || 'Liên kết'}</span>
              <div className="w-10 flex justify-end">
                {/* placeholder for symmetry */}
              </div>
            </a>
          );
        }

        if (block.type === 'PRODUCT') {
          const matchedProduct = products.find(p => p.id === block.product_id);
          return (
            <button
              key={block.id}
              onClick={() => {
                handleTrackClick(block.id);
                if (matchedProduct) onSelectProduct(matchedProduct);
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group shadow-lg"
              style={{...blockStyle, borderColor: `${accentColor}40`}}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-black/40">
                {matchedProduct?.cover_image_url ? (
                  <img src={matchedProduct.cover_image_url} alt={matchedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-6 h-6" style={{ color: accentColor }} />
                )}
              </div>
              <div className="flex-1 px-4 text-left">
                <h4 className="font-bold text-sm line-clamp-1">{matchedProduct?.name || block.title || 'Sản phẩm nổi bật'}</h4>
                {matchedProduct && (
                   <div className="text-xs font-bold mt-1" style={{ color: accentColor }}>
                     {matchedProduct.price.toLocaleString('vi-VN')}đ
                   </div>
                )}
              </div>
              <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md" style={{ backgroundColor: accentColor }}>
                Mua
              </div>
            </button>
          );
        }

        if (block.type === 'COUNTDOWN') {
          return <CountdownRenderer key={block.id} block={block} style={blockStyle} accentColor={accentColor} />;
        }

        if (block.type === 'LEAD_FORM') {
          return <LeadFormRenderer key={block.id} block={block} style={blockStyle} accentColor={accentColor} userId={userId} />;
        }

        return null;
      })}
    </div>
  );
};
