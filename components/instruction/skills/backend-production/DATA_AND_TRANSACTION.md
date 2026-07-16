# 💾 Dữ liệu & Giao dịch (Data Modeling & Transactions)

## 1. Nguyên Tắc Mô Hình Hóa Dữ Liệu (Data Modeling)

- **Chuẩn hoá (Normalization):** Đảm bảo thiết kế bảng tối thiểu đạt chuẩn 3NF. Hạn chế lặp lại dữ liệu trừ phi tối ưu cho đọc cực nhanh (Denormalization - cần có trigger đồng bộ).
- **Khóa ngoại (Foreign Keys):** Luôn phải thiết lập Khóa Ngoại và hành vi ON DELETE (ví dụ: `ON DELETE CASCADE` khi xóa Profile thì xóa Bio, `ON DELETE SET NULL` đối với những liên kết yếu).
- **UUIDs:** Sử dụng UUID cho các Primary Keys bảng chính (`id UUID DEFAULT gen_random_uuid() PRIMARY KEY`) để tránh bị dò quét (ID enumeration) và an toàn hơn cho distributed systems.
- **Soft Deletion vs Hard Deletion:** Với các dữ liệu nhạy cảm liên quan đến tài chính (Orders, Transactions, Commissions), KHÔNG XÓA cứng (Hard delete). Sử dụng Soft delete (thêm cột `deleted_at`) hoặc thay đổi trạng thái (status = 'cancelled').

## 2. Quản Lý Giao Dịch (ACID Transactions)

Giao dịch tài chính (như Webhook nhận tiền) yêu cầu cập nhật nhiều bảng.
**Vấn đề hiện tại (Anti-Pattern):** API gọi liên tiếp 3 hàm `supabase.update()...`, `supabase.insert()...`, `supabase.insert()...`. Nếu mạng đứt ở giữa, hệ thống bị Partial Failure (Thành công một nửa).

**Quy Tắc Bắt Buộc (BLOCKER):**
- Mọi logic có tính chất "Tất cả thành công hoặc Tất cả thất bại" (All or Nothing) PHẢI đưa vào một Transaction của PostgreSQL.
- Vì Supabase Client không hỗ trợ Transactions trực tiếp qua PostgREST REST API, bạn PHẢI tạo một PostgreSQL Function (Stored Procedure) và gọi nó bằng `.rpc()`.

*Ví dụ minh hoạ RPC Function cho Thanh toán:*
```sql
CREATE OR REPLACE FUNCTION process_payment_transaction(p_order_id UUID, p_amount NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Bước 1: Lock order để tránh Race Condition
  -- Bước 2: Cập nhật order
  -- Bước 3: Insert Transaction
  -- Bước 4: Nếu order có affliate, Insert Commission
  -- Nếu có bất kỳ lỗi nào, PostgreSQL sẽ tự động ROLLBACK.
END;
$$;
```

## 3. Tính Độc Lập Kịch Bản (Idempotency) & Chống Race Condition

Webhook của các Payment Gateway (như SePay) có thể gửi lại (Retry) nhiều lần nếu timeout, hoặc do lỗi mạng tạo ra 2 request cùng lúc.

**Quy Tắc (MUST):**
- Đảm bảo cơ sở dữ liệu có Unique Constraints (Ràng buộc duy nhất) cho các tác vụ quan trọng.
- Ví dụ: Bảng `transactions` phải có `transaction_id TEXT UNIQUE`. Khi API cố insert lần 2, Database sẽ báo lỗi trùng lặp (Duplicate Key). Bắt lỗi này và trả về `200 OK` cho Webhook để nó ngừng retry.
- Sử dụng `FOR UPDATE` (Row Level Lock) trong PL/pgSQL nếu bạn cần đọc dữ liệu, tính toán rồi mới cập nhật, để tránh 2 request cùng đọc 1 số liệu cũ.
