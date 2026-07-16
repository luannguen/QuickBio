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
