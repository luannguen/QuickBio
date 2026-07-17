# 🌌 A.A.P v3.0 - UI/UX DESIGN RULESET

## 1. Mobile-First & Accessibility
- Thiết kế mặc định ưu tiên giao diện Mobile. 
- **Touch Targets**: Các nút bấm, icon tương tác phải có kích thước tối thiểu **44px x 44px**.
- **Responsive**: Sử dụng utility classes của Tailwind như `sm:`, `md:`, `lg:` để mở rộng layout.

## 2. Dual Brand Identity (Đặc trưng thương hiệu)
- **Brand A (Warm Gradient/Glassmorphism)**: Dành cho trải nghiệm Mobile, mượt mà, nhiều micro-interactions, gradient nhẹ nhàng, bo góc lớn.
- **Brand B (Green Commerce)**: Dành cho Desktop/SaaS Panel, góc cạnh, chuyên nghiệp, tông màu xanh tin cậy.

## 3. Micro-Animations
- Mọi thao tác Hover, Click, Modal Open đều phải có transition mượt mà (dùng `animate-in fade-in`, `duration-300`, `transition-all`).
- Skeleton Loading bắt buộc có khi chờ fetch data.

## 4. Mobile Modal Patterns (Bottom Sheet)
- **Tuyệt đối không dùng Center Modal** trên màn hình Mobile (`max-md:`).
- Mọi hộp thoại (Login, Checkout, Edit) trên Mobile phải chuyển thành dạng **Bottom Sheet**:
  - Dính sát lề dưới (`mt-auto` hoặc `items-end`).
  - Bo tròn 2 góc trên (`rounded-t-2xl rounded-b-none`).
  - Hiệu ứng trượt từ dưới lên (`animate-in slide-in-from-bottom`).
  - Có khoảng cách đệm (Padding) lớn hơn để dễ bấm.
- Trên Desktop (`md:`) thì vẫn giữ Center Modal.

## 5. Z-Index Architecture
Để tránh các thành phần đè lộn xộn, hệ thống phân cấp z-index như sau:
- `z-0` -> `z-30`: Nội dung trang (Cards, Images, Sections).
- `z-40`: Header cố định (Sticky Nav).
- `z-50`: Bottom Navigation (Mobile) và Nút Floating Action (VD: Nút gọi AI).
- `z-[60]` -> `z-[90]`: Overlays, Menus Mở rộng, Modals, Bottom Sheets.
- `z-[100]`: Toasts, Cảnh báo khẩn cấp.
