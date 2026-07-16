---
id: "analytics-telemetry"
name: "Analytics & Telemetry Skill"
version: "1.0.0"
description: "Quy chuẩn tích hợp tracking events (Google Analytics, Mixpanel, Pixel) đảm bảo không làm chậm UI và không rò rỉ dữ liệu nhạy cảm."
---

# 📊 Analytics & Telemetry Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Low

## 1. Purpose
Theo dõi hành vi người dùng (User Behavior) và Conversion Rate một cách an toàn, không ảnh hưởng đến Performance (Core Web Vitals).

## 2. Triggers
- Task yêu cầu `track`, `event`, `analytics`, `pixel`, `conversion`.

## 3. Rules & Execution
1. **Async & Non-Blocking:** Mọi lệnh gửi Event (Tracking) đều phải chạy bất đồng bộ (Fire-and-forget) và không được block luồng chính (Main thread) của UI.
2. **Privacy First (PII):** Tuyệt đối KHÔNG gửi dữ liệu định danh nhạy cảm (Mật khẩu, Số thẻ tín dụng, API Keys) vào các hệ thống Analytics. Chỉ gửi User ID hoặc Masked Data.
3. **Naming Convention:** Tên event phải chuẩn hóa. (Vd: `snake_case` như `button_clicked_checkout`).

## 4. Anti-Patterns
- ❌ Dùng `await trackEvent()` làm chậm quá trình redirect trang hoặc submit form của người dùng.
