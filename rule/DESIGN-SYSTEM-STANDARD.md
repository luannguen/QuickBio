# 🌌 A.A.P v3.0 - DESIGN SYSTEM STANDARD

## 1. Công nghệ
- Framework: React (Vite) + Tailwind CSS v3.
- Component Library: Shadcn UI (Radix Primitives).
- Icons: `lucide-react`.

## 2. Design Tokens (Tailwind)
- **Colors**: Sử dụng CSS Variables (HLS) trong `index.css`. Gọi thông qua Tailwind classes: `bg-background`, `text-foreground`, `bg-brand-orange`, v.v.
- **Typography**: Inter (hoặc font sans-serif hiện tại). `text-sm`, `text-base`, `font-bold`, `tracking-tight`.
- **Spacing/Radius**: Tuân thủ hệ thống spacing gốc của Tailwind (p-4, m-2). Radius dùng `rounded-lg`, `rounded-xl`, `rounded-2xl`.

## 3. Quy tắc Component
- Không inline CSS. Mọi style phải dùng class Tailwind.
- Phân tách Component: Các UI dùng chung đặt ở `src/shared/ui/`.
