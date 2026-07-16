---
id: "migration-compatibility"
name: "Migration & Backward Compatibility Skill"
version: "1.0.0"
description: "Kỹ năng chuyên biệt để chuyển đổi dữ liệu lớn, đổi kiến trúc hạ tầng và duy trì tính tương thích ngược (Backward Compatibility)."
---

# 🔄 Migration & Compatibility Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Critical (BLOCKER)

## 1. Purpose
Xử lý các tình huống chuyển đổi hệ thống (ví dụ: từ Firebase sang Supabase, từ REST sang GraphQL, hoặc cấu trúc lại một bảng lớn) mà không làm sập (downtime) ứng dụng của khách hàng đang dùng.

## 2. Triggers
- Task liên quan đến `migrate`, `breaking change`, `v1 to v2`.
- Khi Orchestrator đánh giá Risk Level là CRITICAL.

## 3. Rules & Execution

### Nguyên Tắc Tương Thích Ngược (Backward Compatibility)
Khi thay đổi logic hoặc cấu trúc dữ liệu của một API (VD: `api/v1/orders`):
1. Tuyệt đối KHÔNG xóa trường cũ ngay lập tức.
2. Phải dùng mô hình **Expand & Contract**:
   - *Phase 1 (Expand):* Thêm trường mới, code đọc/ghi hỗ trợ cả 2 trường.
   - *Phase 2 (Migrate):* Chạy script chuyển dữ liệu từ cũ sang mới.
   - *Phase 3 (Contract):* Sau một thời gian, mới xóa bỏ trường cũ (Yêu cầu Approval).

### Zero-Downtime Migration
Mọi kế hoạch migration phải được thiết kế sao cho không cần bảo trì toàn bộ hệ thống quá vài giây.

## 4. Anti-Patterns
- ❌ Đổi tên một cột (Rename column) trực tiếp trong production (vì sẽ lập tức làm sập các code cũ đang trỏ tới tên cột cũ). Đổi tên = (Tạo mới + Copy data + Xóa cũ).
