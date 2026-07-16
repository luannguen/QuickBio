# 🏗️ Bối Cảnh Dự Án (Project Context)

Tài liệu này cung cấp bức tranh toàn cảnh về dự án. Hãy đọc kỹ để đảm bảo bạn (Agent) đang "cùng một trang" với toàn bộ hệ thống.

## 1. Mục Tiêu Dự Án (Project Goals)
- Nền tảng QuickBio, phục vụ xây dựng Link-in-bio kết hợp các mô hình kiếm tiền online (Affiliate, v.v.).
- Tối ưu cực độ cho Mobile-First, Tốc độ tải trang, và UX mượt mà.
- Backend Zero-Trust: Validate mọi dữ liệu từ người dùng.

## 2. Tech Stack (Công Nghệ Sử Dụng)
- **Frontend Framework**: React 18 / Vite
- **Architecture**: Feature-Sliced Design (FSD) với các lớp `app`, `pages`, `features`, `entities`, `shared`.
- **Styling**: Tailwind CSS (Với Design System chuẩn `components/ui`).
- **Language**: TypeScript (`@/*` path mapping).
- **Backend / Database**: Supabase (PostgreSQL), Row Level Security (RLS).
- **Deployment**: Vercel.

## 3. Các Nguyên Tắc Bất Biến (Invariants)
> 🚨 **Đây là các ranh giới KHÔNG ĐƯỢC PHÉP vi phạm.**

1. **Định dạng tiếng Việt**: Mọi giao tiếp với User và tài liệu kỹ thuật ưu tiên sử dụng Tiếng Việt.
2. **Kiến trúc FSD**: Luôn giữ cấu trúc FSD, không phá vỡ ranh giới (dependencies) giữa các layer. (VD: `shared` không được import từ `features`).
3. **Zero-Trust Input**: Mọi input gửi lên DB/API phải được validate ở frontend và verify bảo mật ở RLS/Backend. 
4. **Agentic Process**: Không được phép vội vã sinh code nếu chưa lập kế hoạch (Plan) và đọc Skill (Bootstrap).

## 4. Hiện Trạng (Current State)
- Đã hoàn tất di chuyển dự án sang FSD Architecture.
- Lỗi TypeScript `baseUrl` và Dynamic Import Supabase đã được kiểm soát và ghi nhận.

---
*Cập nhật lần cuối: Qua quá trình Refactor FSD & Project Memory Skill Injection.*
