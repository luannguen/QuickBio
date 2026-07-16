# 🚫 Chống Chỉ Định Backend (Anti-Patterns)

Các mẫu thiết kế (Anti-patterns) dưới đây tuyệt đối **KHÔNG ĐƯỢC** xuất hiện trong Codebase. Nếu phát hiện trong quá trình Audit hoặc Review, Agent có trách nhiệm phải sửa ngay hoặc đánh dấu CẢNH BÁO.

## 1. 🧨 Distributed Monolith Transactions (Giao Dịch Bị Xé Lẻ)
**Mô tả:** Code thực hiện Insert/Update qua 3-4 lệnh `await supabase...` nối tiếp nhau trong một hàm API serverless.
**Lý do cấm:** Nếu lệnh thứ 2 fail, lệnh thứ 1 đã commit, gây bất đồng bộ dữ liệu nghiêm trọng.
**Giải pháp:** Viết một function PL/pgSQL trong database chứa tất cả logic đó và gọi 1 lần duy nhất bằng `supabase.rpc()`.

## 2. 🕳️ Bypass RLS Mù Quáng (Blind Admin Role)
**Mô tả:** Sử dụng `supabaseAdmin` (Service Role Key) mọi nơi trong `/api/` để query dữ liệu dễ dàng, nhưng lại quên check quyền người đang gọi API.
**Lý do cấm:** Phá vỡ toàn bộ cấu trúc bảo mật.
**Giải pháp:** Chỉ dùng Anon Key trong Frontend. Trong API, lấy token của user gửi lên, parse ra ID, và tự thân API kiểm tra điều kiện bảo mật trước khi dùng Admin key để update.

## 3. 🤡 Frontend Tính Tiền (Client-Side Math)
**Mô tả:** Giảm giá, số tiền thanh toán, giá sản phẩm được tính toán bằng Javascript ở frontend rồi gửi lên API (ví dụ: `post('/api/pay', { amount: 150000 })`).
**Lý do cấm:** Hacker có thể sửa request thành `amount: 1` và thanh toán thành công.
**Giải pháp:** Frontend chỉ gửi `product_id` (hoặc `order_id`). Backend (hoặc Database Trigger) tự lấy giá từ DB ra để tính toán và lưu hóa đơn.

## 4. 🪃 Webhook Không Chữ Ký (Naked Webhook)
**Mô tả:** Tạo endpoint nhận data POST (ví dụ Webhook thanh toán) nhưng không xác minh nguồn gửi (Signature, API Key).
**Lý do cấm:** Tấn công giả mạo (Spoofing). Ai cũng có thể fake request nạp tiền.
**Giải pháp:** Kiểm tra HMAC hoặc API Header.

## 5. 🧟‍♀️ Silent Failures (Nuốt Lỗi)
**Mô tả:** Bọc logic bằng `try...catch` nhưng trong block catch chỉ có `console.log(e)` và luồng code vẫn tiếp tục chạy hoặc trả về báo thành công.
**Lý do cấm:** Khiến việc debug khi có lỗi Prod cực kỳ khó khăn.
**Giải pháp:** Ghi log chi tiết và trả về HTTP Status Code hợp lý (VD: `500 Internal Server Error`).

## 6. 🗄️ Magic Strings và Hard-Coded Config
**Mô tả:** Ghi thẳng tên ngân hàng, giá cố định, phí hoa hồng (vd: `amount * 0.5`) vào trong file code.
**Lý do cấm:** Khó bảo trì, khi chính sách thay đổi phải update code và deploy lại.
**Giải pháp:** Đưa các cấu hình này vào bảng `settings` trong Database hoặc Environment Variables.
