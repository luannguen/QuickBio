# ✅ Danh Sách Kiểm Tra Backend (Checklist)

Bất cứ khi nào Agent thực hiện một thay đổi vào hệ thống Backend (API, Services, Database Schema), phải chạy Checklist này trước khi Output Code.

## Khởi Tạo Data (Schema / RLS)
- [ ] Bảng mới đã được khai báo Primary Key là UUID (`DEFAULT gen_random_uuid()`) chưa?
- [ ] Bảng đã bật RLS (`ENABLE ROW LEVEL SECURITY`) chưa?
- [ ] Các policy cơ bản (SELECT, INSERT, UPDATE, DELETE) đã được định nghĩa rõ ràng chưa? (Chỉ user nào có quyền mới được thấy/sửa).
- [ ] Bảng có cần Foreign Key không? Nếu có, `ON DELETE` behavior (CASCADE / SET NULL) đã đúng logic business chưa?

## API / Serverless (Vercel API)
- [ ] Tham số đầu vào (req.body, req.query) đã được validate (kiểm tra rỗng, type string/number) trước khi xử lý chưa?
- [ ] API này có cần xác thực không? Nếu có, JWT của user đã được verify chưa?
- [ ] Nếu API gọi ra bên thứ 3 (Email, SMS), logic này đã được bọc trong `try..catch` để không sập toàn bộ request chưa?

## Transaction & Toàn Vẹn Dữ Liệu
- [ ] Hành động này có cần update/insert nhiều hơn 1 bảng không? Nếu có, ĐÃ ĐƯA XUỐNG RPC (PL/pgSQL) chưa?
- [ ] Có khả năng nhiều request cùng gọi API này trong 1 giây không (Race condition)? Idempotency key (cột UNIQUE) đã được thiết lập chưa?
- [ ] Lượng tiền/Giá trị giao dịch có được Backend tự tính toán thay vì tin tưởng Frontend truyền lên không?

## Observability & Error
- [ ] API trả về HTTP Status codes đúng chuẩn chưa (200 OK, 400 Bad Request, 401 Unauthorized, 500 Error)?
- [ ] Các logic thất bại đã được log đầy đủ thông tin (ID đơn hàng, user email, v.v...) chưa?

> ⚠️ **Agent Action:** Trong quá trình implement, Agent phải tự ghi chú vào `task.md` (hoặc tạo một Decision Summary) nếu phát hiện bất kỳ điểm nào không pass qua checklist này và đề xuất phương án sửa lỗi.
