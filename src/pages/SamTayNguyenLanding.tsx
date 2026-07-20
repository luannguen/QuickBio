import { useState, useEffect } from 'react';
import { CheckoutModal } from "@/components/CheckoutModal";
import { bioService } from "@/entities/bio/api";
import type { Product } from "@/entities/product/api";
import { supabase, isSupabaseConfigured, mockDb } from "@/shared/api/supabase";

interface SamTayNguyenLandingProps {
  onNavigateToHome: () => void;
  landingData?: any;
}

const SAM_PRODUCT: Product = {
  id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7d',
  user_id: '', // Sẽ được gán động
  name: 'Hộp ASHWA DAILY - Sâm Ấn Độ Dạng Pha Uống (20 khẩu phần)',
  price: 299000,
  description: 'Bột sâm pha uống tiện lợi từ cao chiết Sâm Ấn Độ (Ashwagandha) nguyên chất 550mg kết hợp Linh Chi, Đinh Lăng. Hàm lượng minh bạch, chuẩn hóa và truy xuất nguồn gốc rõ ràng.',
  cover_image_url: '/assets/sam/sam_tea_packaging.png',
  file_url: 'https://quick-bio-lilac.vercel.app/downloads/huong-dan-thien-tra.pdf', // HD sử dụng
  product_type: 'physical',
  inventory_count: 100,
  is_unlimited: false,
  weight_grams: 500,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function SamTayNguyenLanding({ onNavigateToHome, landingData }: SamTayNguyenLandingProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [creatorId, setCreatorId] = useState<string>('');

  useEffect(() => {
    // Truy vấn động user_id của admin (slug luannguyen) để làm creatorId
    bioService.getBioBySlug('luannguyen').then((bio) => {
      if (bio) {
        setCreatorId(bio.user_id);

        // Đảm bảo sản phẩm Hapico Sâm tồn tại trong danh sách sản phẩm của admin
        const syncProduct = async () => {
          try {
            if (isSupabaseConfigured && supabase) {
              const { data } = await supabase
                .from('products')
                .select('id')
                .eq('id', SAM_PRODUCT.id)
                .maybeSingle();

              if (!data) {
                await supabase.from('products').insert({
                  id: SAM_PRODUCT.id,
                  user_id: bio.user_id,
                  name: SAM_PRODUCT.name,
                  description: SAM_PRODUCT.description,
                  price: SAM_PRODUCT.price,
                  cover_image_url: SAM_PRODUCT.cover_image_url,
                  file_url: SAM_PRODUCT.file_url,
                  product_type: SAM_PRODUCT.product_type,
                  inventory_count: SAM_PRODUCT.inventory_count,
                  is_unlimited: SAM_PRODUCT.is_unlimited,
                  weight_grams: SAM_PRODUCT.weight_grams,
                  status: 'active'
                });
              } else {
                await supabase.from('products').update({
                  name: SAM_PRODUCT.name,
                  description: SAM_PRODUCT.description,
                  price: SAM_PRODUCT.price
                }).eq('id', SAM_PRODUCT.id);
              }
            } else {
              const products = mockDb.get('products');
              const hasProduct = products.some((p: any) => p.id === SAM_PRODUCT.id);
              if (!hasProduct) {
                mockDb.insert('products', {
                  id: SAM_PRODUCT.id,
                  user_id: bio.user_id,
                  name: SAM_PRODUCT.name,
                  description: SAM_PRODUCT.description,
                  price: SAM_PRODUCT.price,
                  cover_image_url: SAM_PRODUCT.cover_image_url,
                  file_url: SAM_PRODUCT.file_url,
                  product_type: SAM_PRODUCT.product_type,
                  inventory_count: SAM_PRODUCT.inventory_count,
                  is_unlimited: SAM_PRODUCT.is_unlimited,
                  weight_grams: SAM_PRODUCT.weight_grams,
                  status: 'active'
                });
              } else {
                mockDb.update('products', SAM_PRODUCT.id, {
                  name: SAM_PRODUCT.name,
                  description: SAM_PRODUCT.description,
                  price: SAM_PRODUCT.price
                });
              }
            }
          } catch (error) {
            console.error('Failed to sync Hapico Sam product:', error);
          }
        };

        syncProduct();
      }
    });

    // Cấu hình các biến CSS tùy chỉnh cho giao diện tối đen ánh vàng (Dark & Gold)
    const root = document.documentElement;
    root.style.setProperty('--sw-bg', '#090B0F');
    root.style.setProperty('--sw-ink', '#FAF6EE');
    root.style.setProperty('--sw-accent', '#D4AF37');
    root.style.setProperty('--sw-ink-soft', 'rgba(250, 246, 238, 0.6)');

    // Tải động script scrub-engine
    const script = document.createElement('script');
    script.src = '/assets/sam/scrub-engine.js?v=1.4.6';
    script.async = true;
    
    let engineInstance: any = null;

    script.onload = () => {
      if ((window as any).mountScrollWorld) {
        const brandHtml = landingData?.logo_url 
          ? `<img src="${landingData.logo_url}" style="height: 32px; object-fit: contain;" alt="Logo" />`
          : 'ASHWA DAILY';
          
        engineInstance = (window as any).mountScrollWorld(document.getElementById('sam-world-container'), {
          brand: { name: brandHtml, href: '/' },
          diveScroll: 1.4,
          connScroll: 0.9,
          hint: 'Cuộn chuột để bắt đầu hành trình',
          nav: true,
          atmosphere: true,
          sections: [
            {
              id: 'khoi-nguon',
              label: 'Định vị',
              still: '/assets/sam/misty_tea_hills.png',
              stillMobile: '/assets/sam/misty_tea_hills_mobile.png',
              accent: '#D4AF37',
              eyebrow: 'ASHWA DAILY',
              title: 'Sâm Ấn Độ Cho Nhịp Sống Hiện Đại',
              body: 'Khởi nguồn từ những rễ sâm Ấn Độ (Ashwagandha) chuẩn hóa quý giá, được tinh chế bằng công nghệ cao chiết hiện đại tại Việt Nam. Không còn là trà thảo mộc thông thường, đây là giải pháp khẩu phần phục hồi thân tâm tiện lợi cho cuộc sống năng động.',
              tags: ['Cao chiết Ashwagandha', 'Nhịp sống hiện đại', 'Phục hồi sinh lực'],
              objectPosition: 'center bottom'
            },
            {
              id: 'sam-an-do',
              label: 'Ashwagandha',
              still: '/assets/sam/ashwagandha_diorama.png',
              stillMobile: '/assets/sam/ashwagandha_diorama_mobile.png',
              accent: '#E2A35D',
              eyebrow: 'Nguyên liệu trung tâm — Ashwagandha',
              title: 'Minh Bạch 550mg Cao Chiết',
              body: 'Trong mỗi khẩu phần, chúng tôi cung cấp chính xác 550mg cao chiết khô Ashwagandha (Sâm Ấn Độ), chuẩn hóa hoạt chất Withanolides. Giúp giảm cortisol căng thẳng, tái thiết lập chu kỳ giấc ngủ tự nhiên sâu sắc và xoa dịu hệ thần kinh trung ương.',
              tags: ['550mg Cao chiết/gói', 'Chuẩn hóa Withanolides', 'Hạ cortisol giảm stress'],
              objectPosition: 'center bottom'
            },
            {
              id: 'sam-bo-chinh',
              label: 'Phối hợp thảo dược',
              still: '/assets/sam/sam_bo_chinh_diorama.png',
              stillMobile: '/assets/sam/sam_bo_chinh_diorama_mobile.png',
              accent: '#FF8E7A',
              eyebrow: 'Công thức phối hợp tinh tuyển',
              title: 'Đinh Lăng & Linh Chi Đỏ',
              body: 'Công thức được tối ưu hóa sức mạnh nhờ Đinh Lăng cổ thụ hoạt huyết dưỡng não và Linh Chi Đỏ rừng sâu hỗ trợ đào thải độc tố do căng thẳng tích tụ. Các thành phần phối hợp vừa đủ, không tranh điểm nhìn với Ashwagandha.',
              tags: ['Linh Chi & Đinh Lăng', 'Hoạt huyết dưỡng não', 'Thải độc mát gan'],
              objectPosition: 'center bottom'
            },
            {
              id: 'linh-chi-do',
              label: 'Dạng khẩu phần',
              still: '/assets/sam/linh_chi_diorama.png',
              accent: '#A94444',
              eyebrow: 'Mã thị giác & Dạng bào chế',
              title: '20 Khẩu Phần Uống Tiện Lợi',
              body: 'Tránh xa hình ảnh ấm trà truyền thống rườm rà. ASHWA DAILY được chia sẵn thành 20 gói bột hòa tan tiện dụng. Không cần sắc nấu, không cần cân đong, dễ dàng pha nhanh ngay tại văn phòng hay khi di chuyển.',
              tags: ['Chia sẵn 20 gói tiện lợi', 'Hòa tan nhanh', 'Mang đi dễ dàng'],
              objectPosition: 'center bottom'
            },
            {
              id: 'dinh-lang',
              label: 'Truy xuất nguồn gốc',
              still: '/assets/sam/golden_ginseng_brew.png',
              accent: '#8CAF68',
              eyebrow: 'Quy trình & Bằng chứng',
              title: 'Cam Kết Vùng Trồng & Kiểm Nghiệm',
              body: 'Mọi lô sản phẩm đều được sơ chế sấy lạnh và chiết xuất chuẩn hóa hàm lượng. Mỗi hộp ASHWA DAILY đều tích hợp mã QR truy xuất nguồn gốc vùng trồng, quy trình chiết xuất và kết quả kiểm nghiệm minh bạch.',
              tags: ['Truy xuất nguồn gốc QR', 'Kiểm nghiệm theo lô', 'HAPICO minh bạch'],
              objectPosition: 'center bottom'
            },
            {
              id: 'thuong-tra',
              label: 'Trải nghiệm ngay',
              still: '/assets/sam/sam_tea_packaging.png',
              accent: '#D4AF37',
              eyebrow: 'HAPICO ASHWA DAILY',
              title: 'Mỗi Ngày, Dành Lại Một Khoảng Cho Chính Mình',
              body: 'Sâm Ấn Độ dạng pha uống tiện dụng. Chi phí tối ưu chỉ 14.9K cho một lần sử dụng để tái sinh giấc ngủ và xoa dịu tâm trí. Cam kết 100% thảo mộc tự nhiên, không hương liệu nhân tạo, giảm ngọt và chất mang lactose.',
              tags: ['20 Khẩu phần pha uống', 'Chi phí 14.9K / lần', 'HAPICO an yên'],
              cta: {
                primary: { label: 'Đặt mua ngay - 299K', href: '#buy' },
                secondary: { label: 'Quay lại Trang chủ', href: '/' }
              },
              objectPosition: 'center bottom'
            }
          ]
        });
      }
    };

    document.body.appendChild(script);

    // Chặn bắt sự kiện click toàn cục để xử lý điều hướng Single Page App
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '/') {
          e.preventDefault();
          onNavigateToHome();
        } else if (href === '#buy') {
          e.preventDefault();
          setShowCheckout(true);
        }
      }
    };
    
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      if (engineInstance && typeof engineInstance.destroy === 'function') {
        engineInstance.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Khôi phục lại các thuộc tính style của body khi unmount
      root.style.removeProperty('--sw-bg');
      root.style.removeProperty('--sw-ink');
      root.style.removeProperty('--sw-accent');
      root.style.removeProperty('--sw-ink-soft');
    };
  }, [onNavigateToHome]);

  const finalProduct = {
    ...SAM_PRODUCT,
    user_id: creatorId
  };

  return (
    <div className="relative w-full min-h-screen bg-[#090B0F] overflow-x-hidden">
      {/* Container nơi scroll-world sẽ mount toàn bộ giao diện */}
      <div id="sam-world-container" className="w-full min-h-screen"></div>

      {/* Tích hợp CheckoutModal */}
      {showCheckout && creatorId && (
        <CheckoutModal 
          creatorId={creatorId}
          onClose={() => setShowCheckout(false)}
          product={finalProduct}
        />
      )}
    </div>
  );
}
