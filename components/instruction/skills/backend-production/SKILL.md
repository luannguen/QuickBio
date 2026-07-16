# ⚙️ Backend Production Engineering Skill (QuickBio)

**Mô tả:** Bộ quy tắc và hướng dẫn tối cao dành cho kiến trúc Backend của QuickBio (dựa trên Supabase, PostgreSQL và Vercel Serverless Functions).
**Phiên bản:** 1.0.0
**Mức độ áp dụng:** **BẮT BUỘC (MANDATORY)** cho mọi Agent hoặc Engineer thao tác với Backend.

---

## 🎯 1. Mục Tiêu (Goal)

Skill này đảm bảo hệ thống Backend:
- Đạt chuẩn **Production-Ready** (Sẵn sàng phục vụ thực tế).
- Đảm bảo **Data Integrity** (Toàn vẹn dữ liệu) tuyệt đối trong các giao dịch tài chính (Đơn hàng, Hoa hồng, Thanh toán).
- Bảo mật **Zero-Trust** (Không tin tưởng input từ client hoặc webhook nếu chưa verify).
- Khả năng **Observability & Fault Tolerance** (Phục hồi khi có lỗi mạng, lỗi database).

## 🚀 2. Khi Nào Phải Kích Hoạt (Triggers)

**Agent phải nạp Skill này nếu task yêu cầu một trong các hành động sau:**
1. Tạo bảng (table), chỉnh sửa schema, hoặc viết migration SQL.
2. Cập nhật Row Level Security (RLS) policies.
3. Viết hoặc sửa đổi Serverless Functions (`/api/*`), đặc biệt là Webhooks.
4. Thao tác với Database (Insert, Update, Delete) nhiều bảng cùng lúc.
5. Viết các Business Logic liên quan đến: Thanh toán (Payment), Đơn hàng (Order), Hoa hồng (Commission), Xác thực (Auth).

## 📚 3. Cấu Trúc Tài Liệu Skill

Agent có trách nhiệm đọc các file sau theo thứ tự nếu chưa nắm rõ domain cụ thể:
1. `RULES.md` - (Core) Phân loại mức độ nghiêm ngặt của các quy định.
2. `ARCHITECTURE.md` - (High Level) Giới hạn Boundary, Data vs API layer.
3. `DATA_AND_TRANSACTION.md` - (Database) Kỹ năng xử lý giao dịch ACID, Idempotency.
4. `API_AND_SECURITY.md` - (Security) Bảo mật API, Webhook, RLS.
5. `RELIABILITY_AND_OBSERVABILITY.md` - (Resilience) Xử lý lỗi, timeout, logging.
6. `ANTI-PATTERNS.md` - Những hành vi **NGHIÊM CẤM**.
7. `CHECKLIST.md` - Danh sách kiểm tra cuối cùng trước khi commit code.

## 🛠 4. Workflow Bắt Buộc (Execution Protocol)

Khi nhận một task về Backend, Agent **PHẢI** tuân thủ quy trình sau:
- **Bước 1 (Discovery):** Phân tích `schema.sql` hiện hành và các file API/Service liên quan. Đọc `CHECKLIST.md` của Backend.
- **Bước 2 (Design & Transaction Analysis):** Phải xác định xem tác vụ có cập nhật nhiều bảng không. Nếu có, phải đề xuất sử dụng Transaction (PL/pgSQL RPC) thay vì gọi nhiều query từ Client/Serverless.
- **Bước 3 (Security Check):** Nếu viết API/Webhook, phải có bước xác minh (Authentication/Signature). Nếu viết Service gọi từ Client, phải kiểm tra RLS ở Database.
- **Bước 4 (Execution):** Viết code.
- **Bước 5 (Validation):** Áp dụng `CHECKLIST.md` để tự kiểm tra lỗi (Race Condition, Partial Failure, Hard-coded secrets).
