---
id: "domain-user-identity"
name: "User & Identity Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ cốt lõi (Business Invariants) về người dùng và xác thực."
---

# 👤 User & Identity Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `users`, `auth`, `profiles`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **SSOT (Single Source of Truth):** Quản lý định danh phải lấy `auth.users` của hệ thống Auth (Vd: Supabase Auth) làm chuẩn. Bảng `public.users` (hoặc `profiles`) chỉ lưu thông tin mở rộng.
2. **Email Uniqueness:** Email của User phải là duy nhất trên toàn hệ thống (System-wide), không phân biệt Tenant.
3. **Password Security:** Agent tuyệt đối KHÔNG bao giờ được select, in ra log, hoặc xử lý raw password. Mọi nghiệp vụ đăng nhập/đăng ký phải dùng SDK của Auth Provider.

## 2. Relationships
- User 1-n Bio (Một User có thể tạo nhiều Bio/Tenant).
- User 1-n Order (Một User có thể tạo nhiều đơn hàng).

## 3. Triggers
- Các task liên quan đến login, register, profile, user management.
