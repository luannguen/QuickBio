---
id: "domain-admin-rbac"
name: "Admin & RBAC Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ về Phân quyền (Role-Based Access Control) cho Admin tổng và Sub-admin của từng Tenant."
---

# 👑 Admin & RBAC Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `admin_roles`, `permissions`, `dashboard`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **Two-Tier Admin System:** 
   - **Super Admin (Platform):** Quản lý toàn bộ hệ thống SaaS, nhìn thấy mọi Tenant. Dành cho chủ sở hữu phần mềm.
   - **Tenant Admin (Bio Admin):** Chỉ quản lý cửa hàng (Bio) của riêng mình. Tuyệt đối bị chặn truy cập dữ liệu cửa hàng khác (bằng RLS).
2. **Least Privilege:** Các sub-users (nhân viên của cửa hàng) chỉ được cấp quyền tối thiểu cần thiết để làm việc (VD: Chỉ xem đơn hàng, không được sửa cấu hình thanh toán).
3. **Audit Logging Bắt Buộc:** Bất kỳ thao tác Xóa/Sửa dữ liệu quan trọng nào từ Super Admin đều phải được ghi log lại (Ai làm, làm lúc nào, sửa gì).

## 2. Relationships
- SuperAdmin độc lập.
- Tenant Admin sở hữu Bio.

## 3. Triggers
- Xây dựng luồng đăng nhập cho Admin Dashboard.
- Cấp quyền, chia role cho nhân viên cửa hàng.
- Xây dựng báo cáo tổng quát (Global Analytics).
