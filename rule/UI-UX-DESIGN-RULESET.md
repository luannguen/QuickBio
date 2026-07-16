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
