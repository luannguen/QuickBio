# ⚖️ Phân Loại Quy Tắc (Rules)

Mọi quy định trong Backend Production Engineering Skill được chia làm 4 cấp độ. Các Agent **KHÔNG ĐƯỢC PHÉP** vi phạm các điều khoản BLOCKER và MUST.

## ⛔ 1. BLOCKER (Nghiêm Cấm Tuyệt Đối)
*Vi phạm sẽ khiến hệ thống sập, mất tiền, lộ dữ liệu hoặc phá hỏng tính toàn vẹn.*

- **B1:** KHÔNG ĐƯỢC tin tưởng (trust) bất kỳ input nào từ phía Client (Frontend) hoặc từ các Webhook bên ngoài nếu chưa qua bước xác thực chữ ký (Signature Validation) hoặc verify JWT.
- **B2:** KHÔNG ĐƯỢC phép cập nhật nhiều bảng (multi-table mutation) trong môi trường phân tán (Serverless API / Next.js API) bằng các await query riêng rẽ nếu chúng có tính phụ thuộc. **PHẢI** đóng gói thành một Database Transaction (thông qua Supabase RPC).
- **B3:** KHÔNG ĐƯỢC bypass RLS bằng Service Role Key (`supabaseAdmin`) trừ khi thực sự cần thiết ở môi trường Backend (Server). Tuyệt đối không dùng Service Role Key trên Client.
- **B4:** KHÔNG ĐƯỢC hard-code API Keys, Secrets vào trong Source code. Phải dùng Environment Variables (`process.env`).

## 🚨 2. MUST (Bắt Buộc Phải Làm)
*Vi phạm sẽ gây nợ kỹ thuật (Technical Debt) trầm trọng.*

- **M1:** Mọi thao tác Insert/Update quan trọng (như Thanh toán) PHẢI có cơ chế **Idempotency** cứng ở tầng Database (bằng Constraint UNIQUE hoặc Upsert rules) để chống Race Condition khi bị gọi nhiều lần đồng thời.
- **M2:** Mọi thay đổi về Schema (thêm bảng, thêm cột) PHẢI có file SQL script tương ứng (ví dụ: `schema.sql` hoặc migrations folder).
- **M3:** Khi tạo bảng mới chứa dữ liệu User, PHẢI kích hoạt RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) và viết ít nhất một Policy cơ bản.
- **M4:** Tất cả các lỗi (Error) catch được ở API/Service PHẢI được format thành một chuẩn response thống nhất trước khi trả về client.

## ⚠️ 3. SHOULD (Nên Làm)
*Khuyến khích thực hiện để tối ưu Performance và UX.*

- **S1:** Nên tách các tác vụ tốn thời gian (như gửi Email giao hàng) ra khỏi Request/Response cycle chính của Webhook bằng cách đẩy vào Queue, hoặc dùng Edge Functions để không block response quá 2-3 giây.
- **S2:** Tránh viết logic Business phức tạp vào Client Code (`src/services`). Nên đẩy logic phức tạp xuống Database (Postgres Functions/Triggers) hoặc Serverless Functions (APIs) để dễ tái sử dụng và bảo mật.
- **S3:** Nên thiết lập timeout cho các API call ra bên thứ 3 (như Resend API, SePay API).

## 💡 4. MAY (Có Thể Làm)
*Tuỳ chọn theo tình hình.*

- **Y1:** Có thể giữ chế độ Mock DB (`mockDb`) nếu mục đích là phục vụ Demo/Local nhanh, nhưng phải cô lập (Isolate) file mock rõ ràng (ví dụ qua interface/DI) chứ không nên if/else nhằng nhịt trong từng hàm service.
- **Y2:** Có thể gộp các Policy RLS phức tạp thành Database View để kiểm tra quyền dễ dàng hơn.
