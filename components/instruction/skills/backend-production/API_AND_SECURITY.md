# 🔒 API & Security (API_AND_SECURITY)

Bảo mật là ưu tiên hàng đầu, đặc biệt với kiến trúc BaaS lộ API ra Frontend. Hệ thống phải tuân thủ triết lý **Zero-Trust**: Không tin tưởng bất cứ ai, dù là Frontend của chính dự án hay Webhook từ bên thứ ba.

## 1. Bảo mật Supabase (RLS - Row Level Security)

Vì Frontend có thể gọi thẳng Supabase bằng API Key (Anon Key), bạn phải dựa vào RLS để phân quyền.
- **BLOCKER:** KHÔNG tạo bảng mới lưu thông tin User/Dữ liệu kinh doanh mà quên bật RLS (`ALTER TABLE xyz ENABLE ROW LEVEL SECURITY;`).
- **Phân quyền cơ bản:** Sử dụng `auth.uid() = user_id` cho các thao tác cá nhân.
- **Service Role Key:** Chỉ dùng `supabaseAdmin` trên Serverless API. KHI DÙNG SERVICE ROLE KEY, hệ thống sẽ BỎ QUA toàn bộ RLS. Do đó, logic code trên Serverless phải cực kỳ thận trọng kiểm tra xem "User này có quyền thay đổi row này không?" (bằng code) trước khi thực hiện update.

## 2. Xác Thực Webhook (Webhook Verification)

Các bên thứ 3 như SePay, Stripe gửi request dạng POST đến hệ thống của bạn để báo cáo kết quả (nhận tiền, thanh toán).
- **BLOCKER:** Bạn KHÔNG THỂ tin tưởng payload trong `req.body` nếu chưa xác thực người gửi.
- **Giải pháp bắt buộc:**
  1. Kiểm tra Token/API Key trong HTTP Header (ví dụ: `req.headers.authorization`).
  2. Hoặc kiểm tra chữ ký số (HMAC Signature) được băm (hash) bằng một khóa bí mật (Secret) chia sẻ giữa bạn và hệ thống kia.

*Ví dụ lỗi thực tế:* Endpoint `/api/sepay` hiện tại đọc thẳng `req.body` mà không verify header, dẫn đến nguy cơ bất kỳ ai cũng có thể giả mạo request POST để lấy sản phẩm số.

## 3. Xác Thực Internal APIs (Authentication)

Đối với các route nằm trong thư mục `/api/*` (Vercel Serverless) do Frontend tự gọi lên (như `api/admin/approve-withdrawal`):
- **Phải xác thực:** Hãy truyền Bearer Token (JWT của Supabase) từ Frontend lên.
- **Backend phải kiểm tra:** 
  ```ts
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token_from_header);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  ```
- **Kiểm tra quyền (Authorization):** Sau khi xác định được `user`, hãy kiểm tra `user.role` hoặc query xem user có phải Admin hay không trước khi thực thi lệnh nguy hiểm.

## 4. Quản lý Mật khẩu và Secret

- **BLOCKER:** Không được đẩy (commit) API Key (Resend, SePay, Supabase Service Role Key) vào trong source code hay Git.
- Sử dụng biến môi trường:
  - `VITE_*` : Chỉ dành cho các biến public (có thể lộ trên trình duyệt như Anon Key, Public URL).
  - Khác: Các biến bí mật chỉ dùng ở thư mục `/api/*` hoặc server.

## 5. Rate Limiting (Chống Spam)

Với các API Endpoint mở (không bắt buộc auth) như gửi form, verify mã giảm giá:
- Cần cài đặt cơ chế Rate Limit (ví dụ: dùng Redis/Upstash hoặc Vercel KV) để tránh bị spam phá sập hệ thống (DDoS) hoặc làm tốn chi phí.
