# Danh sách công việc (Taskflow): QuickBio & DigiStore

## Lộ trình triển khai

### Bước 1: Khởi tạo và thiết lập hạ tầng
- [x] Khởi tạo dự án Vite React + Tailwind CSS tại `f:/code duan/kiem tien online`
- [x] Cấu hình các thư mục chuẩn 3-Layer (`src/features`, `src/services`, `src/hooks`, `src/components`)
- [x] Thiết kế và lập tài liệu Schema DB Supabase (SQL file)

### Bước 2: Thiết lập Service & Hooks (Backend & Logic)
- [x] Thiết lập `SupabaseService` tương tác với DB & Storage
- [x] Phát triển webhook handler giả lập thanh toán (SePay simulator)
- [x] Xây dựng các hooks quan trọng (`useAuth`, `useCart`, `useBioBuilder`)

### Bước 3: Phát triển Giao diện UI/UX Premium (Mobile-First)
- [x] Trang Landing Page giới thiệu dịch vụ
- [x] Trình biên tập Bio-Link trực quan (Bio-Link Builder)
- [x] Trang cá nhân Bio-Link công khai tích hợp Cửa hàng sản phẩm số + Popup thanh toán VietQR
- [x] Trang Dashboard Admin (Quản lý đơn hàng, Doanh thu, Cấu hình API SePay)

### Bước 4: Thiết kế & Đóng gói Templates
- [/] Agent thiết kế và đóng gói 3 mẫu Landing Page đẹp mắt làm sản phẩm bán đầu tiên

### Bước 5: Deploy & Kiểm thử E2E
- [ ] Deploy sản phẩm lên Vercel
- [ ] Kiểm thử luồng quét mã chuyển khoản thật (2,000đ)
