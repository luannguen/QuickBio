import React, { useEffect, useState } from 'react';
import { bioService } from '../../services/bioService';
import type { BioLink } from '../../services/bioService';
import { productService } from '../../services/productService';
import type { Product } from '../../services/productService';
import { CheckoutModal } from '../../components/CheckoutModal';
import { 
  ShoppingBag, 
  Sparkles, 
  Loader2, 
  Compass,
  Link as LinkIcon,
  Clock,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';

interface PublicBioProps {
  slug: string;
  onNavigateToLanding?: () => void;
  onNavigateToSam?: () => void;
}

export const PublicBio: React.FC<PublicBioProps> = ({ slug, onNavigateToLanding, onNavigateToSam }) => {
  const [bio, setBio] = useState<BioLink | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // CRO States
  const [timeLeft, setTimeLeft] = useState(3600 * 2 + 45 * 60); // 2h 45m
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ name: '', product: '', time: '' });

  // Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Social Proof Effect
  useEffect(() => {
    if (products.length === 0) return;
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const triggerToast = () => {
      const names = ['Tuấn***', 'Lê Hương***', 'Nguyễn***', 'Tran***', 'Phạm Hoàng***', 'Vũ***', 'Bùi Ngọc***'];
      const times = ['vừa xong', '1 phút trước', '2 phút trước', '4 phút trước'];
      
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)].name;
      
      setToastData({ name: randomName, product: randomProduct, time: randomTime });
      setShowToast(true);
      
      // Auto hide
      setTimeout(() => setShowToast(false), 4500);
      
      // Schedule next toast (between 20s and 45s)
      const nextTime = Math.floor(Math.random() * (45000 - 20000 + 1) + 20000);
      timeoutId = setTimeout(triggerToast, nextTime);
    };

    // Initial trigger after 3s
    timeoutId = setTimeout(triggerToast, 3000);
    return () => clearTimeout(timeoutId);
  }, [products]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG cho các Icon MXH thay thế cho Lucide
  const FacebookIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.95z"/>
    </svg>
  );

  const YoutubeIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  const GithubIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const TikTokIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2 3.85 2.26v3.83c-1.39-.08-2.74-.61-3.85-1.5-.72-.58-1.28-1.3-1.68-2.12-.04 1.77-.04 3.55-.03 5.33 0 1.28-.21 2.56-.7 3.73-.83 1.95-2.5 3.52-4.57 4.13-1.63.47-3.39.42-4.98-.24-2.14-.88-3.79-2.85-4.32-5.11-.47-2.02-.08-4.22 1.05-5.9 1.28-1.92 3.4-3.15 5.72-3.32.12.02.11.19.11.29-.02 1.23.01 2.45-.02 3.68-.88.08-1.77.41-2.45 1-.95.83-1.42 2.12-1.25 3.37.15 1.13.82 2.15 1.79 2.73.91.54 2 .63 3.01.32 1.09-.33 1.99-1.18 2.37-2.22.33-.89.37-1.87.37-2.81V.02Z"/>
    </svg>
  );

  useEffect(() => {
    // Lưu mã giới thiệu CTV nếu có trên URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('quickbio_referrer', ref.trim());
    }
  }, []);

  useEffect(() => {
    const loadBioData = async () => {
      setLoading(true);
      try {
        const bioData = await bioService.getBioBySlug(slug);
        if (bioData) {
          setBio(bioData);
          const productsData = await productService.getActiveProductsByUserId(bioData.user_id);
          setProducts(productsData);
        }
      } catch (err) {
        console.error('Failed to load public bio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBioData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange mx-auto" />
          <p className="text-sm text-white/50">Đang tải trang cá nhân...</p>
        </div>
      </div>
    );
  }

  // Màn hình 404 nếu không tìm thấy slug
  if (!bio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B11] p-4 text-center">
        <div className="max-w-sm glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto text-brand-orange">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Không tìm thấy trang</h2>
            <p className="text-sm text-white/50">
              Trang Bio Link này chưa được khởi tạo hoặc đã bị ẩn. Hãy tự tạo một trang cho riêng bạn!
            </p>
          </div>
          <button 
            onClick={onNavigateToLanding}
            className="w-full py-3 bg-gradient-to-r from-brand-orange to-brand-coral text-white font-bold rounded-xl text-sm"
          >
            Tạo Bio Link miễn phí
          </button>
        </div>
      </div>
    );
  }

  // Tùy biến background và text theo theme cấu hình
  const themeStyle = {
    background: bio.theme?.background || 'linear-gradient(135deg, #0b0f19 0%, #161f30 100%)',
    color: bio.theme?.textColor || '#ffffff'
  };

  // Ánh xạ social icon
  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'facebook': return <FacebookIcon />;
      case 'tiktok': return <TikTokIcon />;
      case 'youtube': return <YoutubeIcon />;
      case 'github': return <GithubIcon />;
      case 'instagram': return <InstagramIcon />;
      case 'twitter': return <TwitterIcon />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 flex justify-center relative overflow-hidden" style={themeStyle}>
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {/* Background Mesh Blurs for Premium Visuals */}
      <div className="absolute top-[10%] left-[-20%] w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-20%] w-[350px] h-[350px] bg-brand-coral/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sticky Countdown Banner (FOMO) */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-brand-orange via-brand-coral to-brand-orange text-white text-xs sm:text-sm font-bold text-center py-3 px-4 shadow-lg flex items-center justify-center gap-2.5 z-50 border-b border-white/10 backdrop-blur-md">
        <Clock className="w-4 h-4 animate-pulse text-yellow-300" />
        <span className="tracking-wider">GIẢM GIÁ ĐỘC QUYỀN 50% KẾT THÚC SAU:</span>
        <span className="bg-black/35 px-3 py-1 rounded-md font-mono text-yellow-300 shadow-inner tracking-wider border border-white/10">{formatTime(timeLeft)}</span>
      </div>

      <div className="w-full max-w-lg px-4 pt-24 space-y-8 relative z-10">
        
        {/* Profile Card */}
        <div className="text-center space-y-4 animate-float-slow">
          <div className="relative inline-block group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-orange via-brand-coral to-yellow-500 rounded-full blur-[10px] opacity-60 group-hover:opacity-85 transition-opacity duration-500"></div>
            <img 
              src={bio.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'} 
              alt={bio.title} 
              className="relative w-24 h-24 rounded-full object-cover border-4 border-[#080B11] mx-auto shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center border-2 border-[#080B11] text-white shadow-lg shadow-brand-orange/30">
              <Sparkles className="w-3 h-3 animate-spin-slow" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">{bio.title}</h1>
            <p className="text-sm opacity-70 max-w-sm mx-auto leading-relaxed">{bio.bio_text}</p>
          </div>
        </div>

        {/* Social Links */}
        {Object.keys(bio.social_links).length > 0 && (
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(bio.social_links).map(([key, url]) => {
              if (!url) return null;
              return (
                <a 
                  key={key} 
                  href={url as string} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:bg-gradient-to-tr hover:from-brand-orange/20 hover:to-brand-coral/20 border border-white/5 hover:border-brand-orange/30 text-white/70 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-brand-orange/5"
                >
                  {getSocialIcon(key)}
                </a>
              );
            })}
          </div>
        )}

        {/* Cửa hàng sản phẩm số (DigiStore) */}
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
                <div 
                  onClick={() => {
                    if (products[0].id === 'sam-tay-nguyen-pro' && onNavigateToSam) {
                      onNavigateToSam();
                    } else {
                      setActiveProduct(products[0]);
                    }
                  }}
                  className="cursor-pointer bg-[#0f1422]/60 rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-orange/5 text-left"
                >
                  {/* Glowing pulsing border shadow */}
                  <div className="absolute -inset-px bg-gradient-to-tr from-brand-orange/5 via-transparent to-brand-coral/10 rounded-3xl opacity-100 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

                  {/* Ảnh bìa nổi bật */}
                  {products[0].cover_image_url && (
                    <div className="relative w-full md:w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img 
                        src={products[0].cover_image_url} 
                        alt={products[0].name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-brand-orange/95 backdrop-blur-sm text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-lg shadow-md border border-brand-orange/30 tracking-wider">
                        ⭐ Nổi bật
                      </div>
                    </div>
                  )}

                  {/* Thông tin nổi bật */}
                  <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-white group-hover:text-brand-orange transition-colors leading-tight line-clamp-2 pt-2 md:pt-0">
                        {products[0].name}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {products[0].description}
                      </p>
                    </div>

                    {/* Stock level pressure (CRO Scarcity) for Featured */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-white/40">
                        <span>Đã bán: 94% (Giới hạn 100 slot giá tốt)</span>
                        <span className="text-brand-orange font-bold font-mono">Chỉ còn 6 slot</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-brand-orange to-brand-coral rounded-full w-[94%] shadow-sm shadow-brand-orange/50 animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-brand-orange font-mono">
                          {Number(products[0].price).toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-white/30 line-through font-mono">
                          {(Number(products[0].price) * 2).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <button 
                        type="button"
                        className="px-5 bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-coral hover:to-brand-orange text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        Sở hữu ngay
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining products list */}
              {products.slice(1).map((product) => (
                <div 
                  key={product.id} 
                  className="glass-card rounded-3xl p-5 border border-white/5 hover:border-brand-orange/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col sm:flex-row gap-5 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 relative overflow-hidden group text-left"
                  onClick={() => {
                    if (product.id === 'sam-tay-nguyen-pro' && onNavigateToSam) {
                      onNavigateToSam();
                    } else {
                      setActiveProduct(product);
                    }
                  }}
                >
                  {/* Glowing background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/0 via-white/0 to-brand-coral/0 group-hover:from-brand-orange/[0.02] group-hover:to-brand-coral/[0.02] transition-colors duration-500 pointer-events-none"></div>

                  {/* Bán chạy / Độc quyền Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-1 rounded-lg border bg-brand-orange/20 text-brand-orange border-brand-orange/30 shadow-md">
                      ⚡ Yêu Thích
                    </span>
                  </div>

                  {/* Ảnh bìa sản phẩm */}
                  {product.cover_image_url && (
                    <div className="relative w-full sm:w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-white/5">
                      <img 
                        src={product.cover_image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                    <div className="space-y-1.5 text-left pt-2 sm:pt-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Stock level pressure (CRO Scarcity) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-white/40">
                        <span>Đã bán: 91%</span>
                        <span className="text-brand-orange font-bold font-mono">Còn 9 slot</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-orange to-brand-coral rounded-full w-[91%]"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-brand-orange font-mono">
                          {Number(product.price).toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-white/30 line-through font-mono">
                          {(Number(product.price) * 2).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-4 bg-white/5 hover:bg-brand-orange hover:text-white text-white text-xs font-bold rounded-xl border border-white/10 hover:border-brand-orange/20 transition-all active:scale-95 flex items-center justify-center gap-1 min-h-[44px]"
                      >
                        Mua ngay
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
            <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-spin-slow" />
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
        <div className={`fixed top-20 left-4 right-4 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 glass-panel border border-white/10 rounded-xl p-4 shadow-2xl transition-all duration-700 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] sm:translate-y-10 opacity-0 pointer-events-none'}`}>
          <div className="flex items-start gap-3 relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowToast(false); }} 
              className="absolute -top-2 -right-2 p-2.5 text-white/40 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
export default PublicBio;
