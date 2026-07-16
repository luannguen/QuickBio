# 🏗️ Kiến Trúc Hệ Thống (Architecture Boundaries)

Dự án QuickBio áp dụng một sự pha trộn giữa **Thick-Client (BaaS)** và **Serverless Backend**. Agent cần hiểu rõ Boundary (Giới hạn) của từng phần để quyết định đặt logic ở đâu.

## 1. Các Tầng (Layers) của Kiến Trúc

### A. Tầng Client (Frontend + Services)
- Nơi chứa code UI, React Hooks và các `src/services/*`.
- **Vai trò:** Gọi Supabase (PostgREST) trực tiếp để fetch data hoặc gọi Vercel API.
- **Giới hạn (Boundary):**
  - Tuyệt đối **KHÔNG** chứa logic tính toán tiền bạc nhạy cảm.
  - Tuyệt đối **KHÔNG** được thực hiện các tác vụ cần quyền cao (Bypass RLS) ở tầng này. Dùng token của user đăng nhập.

### B. Tầng Data (Supabase PostgreSQL & RLS)
- Trái tim của hệ thống lưu trữ và phân quyền.
- **Vai trò:** Lưu trữ, bảo vệ data bằng Row Level Security (RLS), xử lý các Constraint (Ràng buộc), Trigger và RPC (Stored Procedures).
- **Quy định thiết kế:**
  - Logic phân quyền phải nằm ở RLS, không nằm ở UI.
  - Các giao dịch quan trọng (như Thanh toán) nên được đóng gói vào PL/pgSQL function (RPC) thay vì nhiều query gọi từ Client/API.

### C. Tầng Integration & Automations (Vercel Serverless / `/api/*`)
- Nơi xử lý Webhooks (SePay), tích hợp bên thứ ba (Resend), logic quản trị cao cấp (Admin Approve).
- **Vai trò:** Đóng vai trò là một "Backend-for-Frontend" lai, chạy bằng `supabaseAdmin` (Service Role Key).
- **Giới hạn:** Do bản chất Serverless (Stateless, Timeout ngắn), không nên chạy các tiến trình dài (Long-polling). Cẩn thận với trạng thái lạnh (Cold-start).

## 2. Guideline Đặt Logic (Where to put your code?)

Khi có một tính năng mới, Agent hãy tự hỏi:
- **Câu hỏi 1:** Tính năng này chỉ đơn thuần là Đọc/Ghi dữ liệu của User hiện tại?
  👉 **Đáp án:** Viết ở `src/services/` và gọi thẳng Supabase. Dùng RLS để bảo mật.
- **Câu hỏi 2:** Tính năng này có thực hiện thao tác vượt quyền User (ví dụ: cộng tiền cho User khác, nâng cấp trạng thái)?
  👉 **Đáp án:** Viết một API Route trong `/api/` sử dụng `supabaseAdmin` HOẶC viết một Postgres RPC (với cấu hình Security Definer).
- **Câu hỏi 3:** Tính năng này phụ thuộc vào bên thứ 3 gọi vào hệ thống (Webhooks)?
  👉 **Đáp án:** Viết ở `/api/*`. Bắt buộc phải Verify Signature.
- **Câu hỏi 4:** Tính năng này cập nhật cùng lúc 3-4 bảng (Tables) có quan hệ với nhau?
  👉 **Đáp án:** Đẩy xuống Database bằng cách viết 1 function PL/pgSQL, gọi từ API qua `rpc()`. Không gửi 4 requests liên tiếp từ Serverless/Client.
