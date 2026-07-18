import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Kiểm tra xem có đầy đủ cấu hình Supabase thật hay không
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Khởi tạo Supabase client nếu có cấu hình
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Giao diện dữ liệu mô phỏng sử dụng LocalStorage khi chạy ở chế độ Offline/Demo
const mockStorage = {
  getItem: (key: string) => {
    const val = localStorage.getItem(`quickbio_${key}`);
    return val ? JSON.parse(val) : null;
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(`quickbio_${key}`, JSON.stringify(value));
  }
};

// Khởi tạo dữ liệu mẫu nếu LocalStorage trống
const initMockData = () => {
  if (!mockStorage.getItem('profiles')) {
    mockStorage.setItem('profiles', [
      {
        id: 'user-demo-123',
        email: 'luan.nguyenthien@gmail.com', // Đổi email để khớp yêu cầu của tenant
        full_name: 'Luân Nguyễn',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        created_at: new Date().toISOString(),
        role: 'admin',
        plan_tier: 'premium',
        plan_purchased_at: new Date().toISOString(),
        plan_expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() // 1 năm
      }
    ]);
  }
  
  if (!mockStorage.getItem('bio_links')) {
    mockStorage.setItem('bio_links', [
      {
        id: 'bio-demo-123',
        user_id: 'user-demo-123',
        slug: 'alexnguyen',
        title: 'Alex Nguyễn | Digital Designer & Dev',
        bio_text: 'Chào mừng các bạn ghé thăm góc nhỏ của mình. Nơi mình chia sẻ các premium templates và tài liệu lập trình hữu ích.',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        theme: {
          background: 'linear-gradient(135deg, #0b0f19 0%, #161f30 100%)',
          textColor: '#ffffff',
          glassmorphism: true,
          accentColor: '#FF6B35'
        },
        social_links: {
          facebook: 'https://facebook.com',
          tiktok: 'https://tiktok.com',
          youtube: 'https://youtube.com',
          github: 'https://github.com'
        },
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }

  if (!mockStorage.getItem('landing_pages')) {
    mockStorage.setItem('landing_pages', [
      {
        id: 'landing-demo-123',
        user_id: 'user-demo-123',
        slug: 'sam-tay-nguyen',
        title: 'Trà Sâm Tây Nguyên',
        template_id: 'sam-scroll-world',
        config: {},
        product_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7d',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }

  if (!mockStorage.getItem('products')) {
    mockStorage.setItem('products', [
      {
        id: 'prod-1',
        user_id: 'user-demo-123',
        name: '🚀 Premium Next.js Starter Kit (SaaS Boilerplate)',
        description: 'Bộ starter kit đầy đủ tính năng: Supabase Auth, Tailwind CSS, Stripe/VietQR Integration, Email template, Landing page chuẩn SEO giúp bạn launch dự án SaaS trong 24 giờ. Tiết kiệm 50 giờ code.',
        price: 150000, // 150,000đ
        cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80',
        file_url: 'https://github.com/example/saas-boilerplate/archive/refs/heads/main.zip',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod-2',
        user_id: 'user-demo-123',
        name: '🎨 Modern Glassmorphism Portfolio Template (React/Vite)',
        description: 'Template portfolio cá nhân thiết kế theo phong cách Glassmorphism siêu mượt. Tích hợp sẵn Framer Motion, responsive mobile, chuẩn SEO, tối ưu tốc độ load.',
        price: 79000, // 79,000đ
        cover_image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=400&q=80',
        file_url: 'https://github.com/example/react-portfolio/archive/refs/heads/main.zip',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod-3',
        user_id: 'user-demo-123',
        name: '📚 Ebook: Bí quyết kiếm 1000$ đầu tiên từ Sản phẩm số',
        description: 'Tài liệu hướng dẫn chi tiết từ A-Z cách tìm ý tưởng, thiết kế sản phẩm số, đóng gói và quảng bá để tạo nguồn thu nhập thụ động bền vững cho Developer và Designer.',
        price: 49000, // 49,000đ
        cover_image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&h=400&q=80',
        file_url: 'https://example.com/ebook-mmo-guide.pdf',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }

  if (!mockStorage.getItem('orders')) {
    mockStorage.setItem('orders', []);
  }

  if (!mockStorage.getItem('transactions')) {
    mockStorage.setItem('transactions', []);
  }

  if (!mockStorage.getItem('sepay_configs')) {
    mockStorage.setItem('sepay_configs', [
      {
        id: 'sepay-demo-123',
        user_id: 'user-demo-123',
        api_key: 'demo_sepay_api_key_123',
        bank_account: '9999999999',
        bank_code: 'MBBank',
        account_name: 'NGUYEN VAN A',
        created_at: new Date().toISOString()
      }
    ]);
  }
};

// Khởi chạy dữ liệu mô phỏng ban đầu
initMockData();

// Mock database helper
export const mockDb = {
  get: (table: string) => mockStorage.getItem(table) || [],
  save: (table: string, data: any) => mockStorage.setItem(table, data),
  
  insert: (table: string, item: any) => {
    const list = mockDb.get(table);
    const newItem = { ...item, id: item.id || crypto.randomUUID(), created_at: new Date().toISOString() };
    list.push(newItem);
    mockDb.save(table, list);
    return newItem;
  },
  
  update: (table: string, id: string, updates: any) => {
    const list = mockDb.get(table);
    const index = list.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updated_at: new Date().toISOString() };
      mockDb.save(table, list);
      return list[index];
    }
    return null;
  },

  delete: (table: string, id: string) => {
    const list = mockDb.get(table);
    const filtered = list.filter((item: any) => item.id !== id);
    mockDb.save(table, filtered);
    return true;
  }
};
