# 🛡️ Độ Tin Cậy & Khả Năng Quan Sát (Reliability & Observability)

## 1. Xử Lý Các Sự Cố (Failure Modes)

### 1.1 Khả năng chịu lỗi từng phần (Graceful Degradation)
Nếu hệ thống phụ thuộc bị sập (như dịch vụ gửi Email Resend), hệ thống chính vẫn phải hoạt động.
- **Giải pháp:** Bọc API gửi email trong `try...catch` và KHÔNG throw error ra ngoài làm hỏng luồng thanh toán chính. Ghi log lại lỗi để gửi lại sau.
- **Code sai (Hiện tại trong sepay.ts):** Dù đang bọc catch nhưng nếu quá trình fetch chậm (chưa quăng lỗi), nó sẽ chặn toàn bộ tiến trình.

### 1.2 Bất đồng bộ hóa (Asynchronous processing)
Các tác vụ mất nhiều thời gian, I/O bound (Gửi email, Tạo ảnh PDF, AI Generation) **không nên** đặt cản đường trong một HTTP Request Synchronous.
- Chuyển sang dùng Queue (như Inngest, Upstash QStash, Supabase pg_net) hoặc bắn sự kiện (Event-driven).
- Theo cách tối giản ở Next/Vercel: Cố gắng trả về status `200 OK` trước, sau đó mới `await` các tác vụ (Lưu ý: trên Vercel function, trả về response có thể terminate instance, nên cần config `waitUntil`).

## 2. Format Response & Error Handling

Mọi API route trả về cho Frontend phải tuân thủ cấu trúc thống nhất.

```typescript
// Chuẩn Response Thành Công
{
  "success": true,
  "data": { ... },
  "message": "Giao dịch thành công"
}

// Chuẩn Response Lỗi
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Số dư không đủ",
    "details": "..." // (Chỉ hiện trong môi trường dev)
  }
}
```

## 3. Khả Năng Quan Sát (Observability / Logging)

- **Đừng im lặng khi có lỗi (Fail silently):** `console.error` là chưa đủ khi lên môi trường Production.
- **Log có ngữ cảnh (Contextual Logging):** Khi in log, hãy kèm theo `order_id`, `user_id` và `transaction_id`.
  - Tốt: `console.error('[SePay Webhook] Lỗi khi tạo commission', { orderId: order.id, error: err.message })`
  - Tệ: `console.error('Lỗi', err)`
- Đối với các lỗi ảnh hưởng doanh thu (ví dụ Webhook xử lý tiền bị fail), cần cân nhắc bắn thẳng notification vào Slack/Telegram của Admin (sử dụng một helper function).
