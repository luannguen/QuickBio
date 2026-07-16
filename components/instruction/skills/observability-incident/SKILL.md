---
id: "observability-incident"
name: "Observability & Incident Skill"
version: "1.0.0"
description: "Kỹ năng giám sát, log lỗi, và quy trình xử lý sự cố (Incident Response) khi hệ thống gặp lỗi nghiêm trọng (Crash/Down)."
---

# 🚨 Observability & Incident Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** High

## 1. Purpose
Đảm bảo hệ thống có khả năng tự báo lỗi (Logging) đủ chi tiết để debug, và đưa ra quy trình phản ứng nhanh khi có lỗi xảy ra trên production.

## 2. Triggers
- Xử lý các task báo cáo bug, hệ thống treo (`crash`, `down`, `error 500`).
- Thêm cơ chế log cho các luồng xử lý phức tạp (Payment, Webhook).

## 3. Rules & Execution

### Observability (Tính Quan Sát)
1. **Meaningful Logging:** Không dùng `console.log("here")`. Bắt buộc log có ngữ cảnh. Vd: `console.error("[PaymentWebhook] Invalid signature received", { orderId: 123 })`.
2. **Error Boundary (Frontend):** Ứng dụng UI (React) BẮT BUỘC phải có Error Boundary bọc ở các cấp độ (App, Page, Widget) để không làm trắng toàn bộ trang khi một component con crash.
3. **Graceful Degradation:** Nếu một dịch vụ bên thứ 3 (Vd: API gợi ý sản phẩm) bị chết, hệ thống vẫn phải hoạt động với chức năng cơ bản, không được crash theo.

### Incident Response (Xử lý sự cố)
Khi được User giao task Fix Bug khẩn cấp (Hotfix):
1. **Triage:** Đọc log, tái hiện (reproduce) lỗi ngay lập tức.
2. **Containment:** Tìm cách khoanh vùng lỗi (Ngăn chặn lan rộng). Vd: Nếu lỗi chức năng rút tiền, tạm thời disable nút đó thay vì đợi code xong luồng sửa.
3. **Root Cause Analysis (RCA):** Tìm hiểu nguyên nhân gốc (VD: Do null pointer, do sai kiểu dữ liệu).
4. **Resolution:** Sửa lỗi và test kỹ càng.

## 4. Anti-Patterns
- ❌ Dùng `try { ... } catch (e) {}` (Nuốt lỗi/Swallow error) mà không log ra báo cho hệ thống biết.
