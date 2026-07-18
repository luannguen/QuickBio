# 🌌 A.A.P v3.0 - AI CODING RULES

## 1. Kiến trúc (Architecture)
- **Strict 3-Layer**: UI (View) -> Hook (State/Logic) -> Service/Data (API/Supabase). Tuyệt đối không gọi Supabase DB query trực tiếp trong file UI (`.tsx`).
- **Phân tách**: Mọi truy xuất DB phải nằm trong `src/entities/` hoặc `src/shared/api/`.

## 2. Tiêu chuẩn Code (Coding Standards)
- **Ngôn ngữ**: Typescript. Dùng Interface rõ ràng cho mọi Models.
- **Naming**: Biến/Hàm dùng `camelCase`, Component dùng `PascalCase`. Hook luôn bắt đầu bằng `use`.
- **Dry**: Không lặp lại Code. Tái sử dụng `Button`, `Card`, `Input` từ `src/shared/ui/`.
- **No ts-ignore**: Tuyệt đối không dùng `//@ts-ignore`. Phải giải quyết tận gốc lỗi Type.

## 3. Bảo mật (Security)
- **Zero-Trust Backend**: Luôn validate inputs kể cả từ phía Client lẫn Database.
- **Row Level Security (RLS)**: Bắt buộc cấu hình RLS trong Supabase cho các bảng có dữ liệu Tenant.
- Không bao giờ hardcode API Keys, Supabase URL vào source code, dùng Environment Variables (`import.meta.env`).

## 4. Giao diện & Trải nghiệm (UI/UX) - Bắt buộc
- **Tuân thủ tuyệt đối**: Mọi đoạn code sinh ra có dính đến View/Giao diện đều phải tuân thủ nghiêm ngặt `rule/UI-UX-DESIGN-RULESET.md`.
- **Tư duy Component Pattern**: Không code cứng Layout. Phải nhận diện UI đó thuộc Component Pattern nào (Modal, Bottom Sheet, Drawer, Sticky ActionBar) để bóc tách thành UI components (hoặc tái sử dụng các components trong thư mục `src/shared/ui`).
- **Ưu tiên Mobile (Mobile-first)**: Default base classes dành cho Mobile, breakpoints (`md:`, `lg:`) dành cho PC. Kích thước tương tác tối thiểu 44px.
- **Chỉn chu từng chi tiết**: Mọi khoảng cách (gap, padding, margin) phải dùng token chuẩn của Tailwind, các hiệu ứng click/hover/focus phải đầy đủ và mượt mà (`active:scale-95`, v.v.).

