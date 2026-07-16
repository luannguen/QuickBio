---
id: "domain-bio-tenant"
name: "Bio & Tenant Isolation Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ cốt lõi về Tenant (Bio page), cách ly dữ liệu đa người dùng (Multi-tenant) và Custom Domain."
---

# 🌐 Bio & Tenant Isolation Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `bios`, `tenant_id`, `custom_domain`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **Strict Isolation (Cách ly nghiêm ngặt):** Mọi truy vấn đọc/ghi dữ liệu (Sản phẩm, Đơn hàng, Sub-users) ĐỀU PHẢI được filter theo `bio_id` (hoặc `tenant_id`). Nếu thiếu, đây là lỗi Critical Data Leak.
2. **Slug Uniqueness:** `bio_slug` phải là duy nhất trên toàn hệ thống (Global Unique). Cần kiểm tra kỹ khi tạo mới hoặc đổi slug.
3. **Custom Domain:** Việc cấu hình tên miền riêng yêu cầu gọi API của hạ tầng (VD: Vercel API). KHÔNG được thao tác thẳng DB mà bỏ qua bước cấu hình hạ tầng.

## 2. Relationships
- Bio 1-n Product (Mỗi Bio sở hữu nhiều sản phẩm độc lập).
- Bio 1-n Order (Mỗi Bio sở hữu danh sách đơn hàng độc lập).
- User 1-n Bio.

## 3. Triggers
- Các task liên quan đến Bio, Tenant, cấu hình cửa hàng, thiết kế theme trang Bio.
