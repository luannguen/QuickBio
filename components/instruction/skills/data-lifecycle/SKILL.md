---
id: "data-lifecycle"
name: "Data Lifecycle Skill"
version: "1.0.0"
description: "Quy chuẩn thiết kế schema, thay đổi cấu trúc database (migrations), truy vấn dữ liệu (query optimization), lưu trữ cache và xóa dữ liệu an toàn."
---

# 🗄️ Data Lifecycle Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Critical

## 1. Purpose
Đảm bảo mọi thay đổi liên quan đến dữ liệu vật lý (Database) đều tuyệt đối an toàn, có khả năng roll-back, không làm mất mát (Data Loss) và không làm treo hệ thống (Lock timeout).

## 2. Triggers
- Các yêu cầu thay đổi bảng (`schema`, `migration`, `column`, `table`).
- Tối ưu hóa Database, sửa câu lệnh SQL.
- Xóa bỏ dữ liệu.

## 3. Rules & Execution

### Thiết Kế Schema
1. **Naming Convention:** Bảng và cột dùng `snake_case`. Tên bảng số nhiều (vd: `users`).
2. **Types:** Dùng đúng data types. (Tiền dùng `decimal` hoặc `numeric`, không dùng `float`).
3. **Foreign Keys (Khóa ngoại):** Bắt buộc phải có để giữ Toàn vẹn Dữ liệu (Data Integrity). Quy định rõ hành vi khi xóa (ON DELETE CASCADE, RESTRICT, hoặc SET NULL).

### Migrations (Approval Gate)
1. Bất kỳ sự thay đổi cấu trúc DB nào cũng phải được mô tả thành file Migration SQL rõ ràng.
2. **Destructive Changes (Thay đổi phá hủy):** Đổi kiểu dữ liệu cột, xóa cột, xóa bảng bắt buộc phải hỏi User duyệt.
3. Không lock bảng lâu trong môi trường production khi migrate.

### Truy Vấn & Transactions (Queries)
1. **Transaction:** Nếu một logic cần cập nhật nhiều hơn 1 bảng, BẮT BUỘC dùng Database Transaction để đảo ngược (Rollback) toàn bộ nếu một lệnh bị lỗi.
2. **N+1 Queries:** Hạn chế lấy dữ liệu trong vòng lặp. Dùng `JOIN` hoặc gộp mảng IDs.

### Xóa Dữ Liệu
1. **Soft Delete mặc định:** Trừ khi User yêu cầu rõ "Hard Delete", nếu không phải thêm cột `deleted_at` hoặc trạng thái `status='deleted'`. KHÔNG BAO GIỜ xóa vĩnh viễn dữ liệu tài chính (Orders, Payments, Commissions).

## 4. Anti-Patterns
- ❌ Thực thi thay đổi Schema trực tiếp mà không lưu lại vào code (không có file migration).
- ❌ Cập nhật số dư tài khoản người dùng bằng lệnh SET (Vd: `balance = 50`) thay vì tính toán nguyên tử (Vd: `balance = balance + 50`).
