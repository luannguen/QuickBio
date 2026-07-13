import { useState, useEffect } from 'react';
import { CheckoutModal } from '../../components/CheckoutModal';
import { bioService } from '../../services/bioService';
import type { Product } from '../../services/productService';
import { supabase, isSupabaseConfigured, mockDb } from '../../services/supabase';

interface SamTayNguyenLandingProps {
  onNavigateToHome: () => void;
}

const SAM_PRODUCT: Product = {
  id: 'sam-tay-nguyen-pro',
  user_id: '', // Sẽ được gán động
  name: 'Hộp Trà Sâm Tây Nguyên Thượng Hạng (20 gói x 5g)',
  price: 189000,
  description: 'Sự kết hợp hoàn hảo giữa Sâm Ấn Độ, Sâm Bố Chính, Đinh Lăng & Linh Chi. Hỗ trợ giảm stress, bồi bổ đề kháng và giúp giấc ngủ sâu tự nhiên.',
  cover_image_url: '/assets/sam/sam_tea_packaging.png',
  file_url: 'https://quick-bio-lilac.vercel.app/downloads/huong-dan-thien-tra.pdf', // HD sử dụng & thiền trà
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function SamTayNguyenLanding({ onNavigateToHome }: SamTayNguyenLandingProps) {
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
                  status: 'active'
                });
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
                  status: 'active'
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
    script.src = '/assets/sam/scrub-engine.js';
    script.async = true;
    
    let engineInstance: any = null;

    script.onload = () => {
      if ((window as any).mountScrollWorld) {
        engineInstance = (window as any).mountScrollWorld(document.getElementById('sam-world-container'), {
          brand: { name: 'Hapico Sâm', href: '/' },
          diveScroll: 1.4,
          connScroll: 0.9,
          hint: 'Cuộn chuột để bắt đầu hành trình',
          nav: true,
          atmosphere: true,
          sections: [
            {
              id: 'khoi-nguon',
              label: 'Khởi nguồn',
              still: '/assets/sam/misty_tea_hills.png',
              accent: '#D4AF37',
              eyebrow: 'Câu chuyện Hapico Sâm',
              title: 'Tỉnh Giấc Giữa Đại Ngàn',
              body: 'Từ ngàn đời xưa, bazan đỏ rực nung mình dưới nắng gió Tây Nguyên đã nuôi dưỡng những mạch ngầm thảo dược vô giá. Mỗi búp trà sâm Hapico là sự giao hòa đất trời, đánh thức nguồn sinh lực nguyên bản ẩn sâu trong cơ thể bạn.',
              tags: ['Đất đỏ Bazan', 'Tinh hoa đại ngàn', 'Sức sống nguyên bản'],
              objectPosition: 'center 45%'
            },
            {
              id: 'sam-an-do',
              label: 'Sâm Ấn Độ',
              still: '/assets/sam/ashwagandha_diorama.png',
              accent: '#E2A35D',
              eyebrow: 'Sâm Ấn Độ — Ashwagandha',
              title: 'Tĩnh Lặng Giữa Giông Bão',
              body: 'Áp lực cuộc sống hiện đại liên tục bòn rút năng lượng tinh thần mỗi ngày. Ashwagandha đóng vai trò như một chiếc khiên cổ xưa giúp xoa dịu hệ thần kinh trung ương, điều hòa hormone stress cortisol và khôi phục nhịp ngủ tự nhiên sâu sắc.',
              tags: ['Hạ cortisol stress', 'Tái sinh giấc ngủ', 'Chữa lành cảm xúc'],
              objectPosition: 'center 58%'
            },
            {
              id: 'sam-bo-chinh',
              label: 'Sâm Bố Chính',
              still: '/assets/sam/sam_bo_chinh_diorama.png',
              accent: '#FF8E7A',
              eyebrow: 'Sâm Tiến Vua — Sâm Bố Chính',
              title: 'Vương Dược Tiến Vua',
              body: 'Từng được các vương triều phong kiến coi là quốc bảo bồi bổ sức khỏe cho các bậc quân vương, Sâm Bố Chính dồi dào chất nhầy quý và hoạt tính Saponin, giúp củng cố vững chắc hàng rào đề kháng và hồi sinh thể trạng.',
              tags: ['Saponin hoạt tính', 'Củng cố đề kháng', 'Bồi bổ khí huyết'],
              objectPosition: 'center 56%'
            },
            {
              id: 'linh-chi-do',
              label: 'Linh Chi Đỏ',
              still: '/assets/sam/linh_chi_diorama.png',
              accent: '#A94444',
              eyebrow: 'Nấm Trường Thọ — Linh Chi Đỏ',
              title: 'Thanh Lọc Lại Tâm Hồn',
              body: 'Một cơ thể khỏe mạnh đích thực bắt đầu từ sự thanh sạch sâu bên trong. Linh Chi Đỏ rừng sâu hỗ trợ đào thải mọi độc tố tích tụ lâu ngày do căng thẳng và thực phẩm bẩn, mang lại sự nhẹ nhõm nhẹ nhàng.',
              tags: ['Đào thải độc tố gan', 'Mát gan thanh nhiệt', 'Ngăn gốc tự do'],
              objectPosition: 'center 54%'
            },
            {
              id: 'dinh-lang',
              label: 'Đinh Lăng',
              still: '/assets/sam/golden_ginseng_brew.png',
              accent: '#8CAF68',
              eyebrow: 'Sâm của người Việt — Đinh Lăng',
              title: 'Thông Suốt Mạch Khí Huyết',
              body: 'Khi dòng chảy máu huyết không thông suốt, trí óc sẽ rơi vào sương mù mệt mỏi. Đinh Lăng cổ thụ hoạt huyết dưỡng não vượt trội, đẩy oxy đến từng tế bào thần kinh, khơi dậy tinh thần minh mẫn, sắc bén.',
              tags: ['Hoạt huyết dưỡng não', 'Xua tan mệt mỏi', 'Tăng thể lực dẻo dai'],
              objectPosition: 'center 62%'
            },
            {
              id: 'thuong-tra',
              label: 'Đặt Mua',
              still: '/assets/sam/sam_tea_packaging.png',
              accent: '#D4AF37',
              eyebrow: 'Hapico Sâm — Trà Sâm Thượng Hạng',
              title: 'Thưởng Trà An Yên',
              body: 'Đón nhận hương vị đượm ngọt sâu lắng của đại ngàn Tây Nguyên trong từng túi lọc Hapico Sâm cao cấp. 100% thảo mộc tự nhiên, cam kết không sử dụng hương liệu nhân tạo hay chất bảo quản. Một món quà vàng bảo vệ sức khỏe vàng.',
              tags: ['Hộp 20 túi lọc', '100% tự nhiên', 'Đánh thức thân tâm'],
              cta: {
                primary: { label: 'Đặt mua ngay - 189K', href: '#buy' },
                secondary: { label: 'Quay lại Trang chủ', href: '/' }
              },
              objectPosition: 'center 50%'
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
