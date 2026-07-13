import { useState, useEffect } from 'react';
import { CheckoutModal } from '../../components/CheckoutModal';
import { bioService } from '../../services/bioService';
import type { Product } from '../../services/productService';

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
              eyebrow: 'Món quà sức khỏe từ đại ngàn',
              title: 'Thân Tâm Hợp Nhất',
              body: 'Trà sâm thảo dược kết hợp 4 loại danh sâm quý hiếm của vùng núi Tây Nguyên và Ấn Độ, mang lại giấc ngủ sâu, tinh thần thư giãn và nguồn sinh lực căng tràn.',
              tags: ['100% Tự Nhiên', 'Không Chất Bảo Quản', 'Đất đỏ Bazan']
            },
            {
              id: 'sam-an-do',
              label: 'Sâm Ấn Độ',
              still: '/assets/sam/ashwagandha_diorama.png',
              accent: '#E2A35D',
              eyebrow: 'Thảo dược thần kỳ (Ashwagandha)',
              title: 'Giải Phóng Căng Thẳng',
              body: 'Ashwagandha giúp xoa dịu hệ thần kinh trung ương, điều hòa hormone stress cortisol hiệu quả, đem lại giấc ngủ ngon và phục hồi năng lượng tinh thần nhanh chóng.',
              tags: ['Giảm lo âu', 'Giúp ngủ sâu', 'Thư giãn tâm trí']
            },
            {
              id: 'sam-bo-chinh',
              label: 'Sâm Bố Chính',
              still: '/assets/sam/sam_bo_chinh_diorama.png',
              accent: '#FF8E7A',
              eyebrow: 'Sâm Tiến Vua thượng hạng',
              title: 'Hồi Sinh Đề Kháng',
              body: 'Tích lũy trọn vẹn tinh túy saponin và chất nhầy quý giá từ lòng đất đỏ bazan Tây Nguyên, giúp bồi bổ khí huyết, kiện tỳ vị và gia cố hệ miễn dịch vững vàng.',
              tags: ['Tăng miễn dịch', 'Bồi bổ khí huyết', 'Nâng cao thể lực']
            },
            {
              id: 'linh-chi-do',
              label: 'Linh Chi Đỏ',
              still: '/assets/sam/linh_chi_diorama.png',
              accent: '#A94444',
              eyebrow: 'Nấm Trường Thọ rừng sâu',
              title: 'Thanh Lọc Thải Độc',
              body: 'Linh Chi đỏ hỗ trợ tăng cường tế bào gan đào thải độc tố, điều hòa huyết áp, dọn sạch gốc tự do và ngăn ngừa quá trình lão hóa tự nhiên.',
              tags: ['Đào thải độc tố', 'Mát gan lợi mật', 'Chống oxy hóa']
            },
            {
              id: 'dinh-lang',
              label: 'Đinh Lăng',
              still: '/assets/sam/golden_ginseng_brew.png',
              accent: '#8CAF68',
              eyebrow: 'Hoạt huyết dưỡng não',
              title: 'Tuần Hoàn Sinh Lực',
              body: 'Đinh Lăng cổ thụ lâu năm hỗ trợ kích thích lưu thông tuần hoàn máu não, đẩy lùi các triệu chứng đau đầu, mất tập trung và duy trì cơ thể dẻo dai.',
              tags: ['Hoạt huyết dưỡng não', 'Tăng tuần hoàn', 'Tập trung trí óc']
            },
            {
              id: 'thuong-tra',
              label: 'Đặt Mua',
              still: '/assets/sam/sam_tea_packaging.png',
              accent: '#D4AF37',
              eyebrow: 'Hộp quà sức khỏe thượng hạng',
              title: 'Thưởng Trà An Yên',
              body: 'Tinh tế từ hương vị đến quy cách đóng gói. Hapico Sâm cam kết mang lại trải nghiệm thiền trà đích thực với 100% thảo dược thiên nhiên.',
              tags: ['Hộp 20 túi lọc', 'Dễ uống nóng/lạnh', 'Hương vị thảo mộc tự nhiên'],
              cta: {
                primary: { label: 'Đặt mua ngay - 189K', href: '#buy' },
                secondary: { label: 'Quay lại Trang chủ', href: '/' }
              }
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
