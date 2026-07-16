---
id: "api-integration"
name: "API & Integration Skill"
version: "1.0.0"
description: "Quy chuẩn thiết kế API, kết nối bên thứ 3 (3rd-party services) và xử lý Webhook."
---

# 🔌 API & Integration Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** High

## 1. Purpose
Đảm bảo các giao tiếp qua mạng (Network Calls) giữa Client-Server hoặc Server-Server đều an toàn, chuẩn xác (RESTful), và có khả năng phục hồi (Resilient) khi gặp lỗi kết nối.

## 2. Triggers
- Task tạo/sửa file trong thư mục `api/` hoặc `routes/`.
- Kết nối tới dịch vụ bên ngoài (Stripe, Resend, Vercel Blob...).
- Xử lý Webhook.
- Gọi API từ Frontend.

## 3. Rules & Execution

### Thiết Kế API (API Design)
1. Tuân thủ RESTful: Dùng đúng HTTP Methods (GET, POST, PUT, PATCH, DELETE).
2. Status Codes: Trả về đúng mã HTTP (200, 201, 400, 401, 403, 404, 500).
3. Payload Validation: MỌI DỮ LIỆU TỪ CLIENT đều bị coi là độc hại. BẮT BUỘC dùng thư viện (Zod, Joi) để validate `body`, `query`, `params` trước khi xử lý.

### Webhook
1. Idempotency: Webhook có thể bị gửi trùng (duplicate). Xử lý phải có Idempotency Key (vd: Event ID) để không trừ tiền hoặc cộng điểm 2 lần.
2. Signature Verification: Mọi webhook nhận được đều phải xác thực (Verify Signature) để tránh bị làm giả.

### Integration (Gọi ra ngoài)
1. **Timeout & Retry:** Mọi lời gọi HTTP ra bên ngoài phải có Timeout. Khuyến khích có cơ chế Retry (Exponential Backoff) nếu là tác vụ quan trọng.
2. **Secret Management:** Mọi API Key phải lấy từ Biến môi trường (`process.env`), KHÔNG hardcode.

## 4. Anti-Patterns
- ❌ Trả về HTTP 200 OK nhưng body chứa `{"error": "Lỗi hệ thống"}`.
- ❌ Lưu API keys, Secrets vào Client Code (Frontend).
- ❌ Thực thi logic dài quá thời gian (Timeout) của Serverless Function mà không dùng Background Queue.
