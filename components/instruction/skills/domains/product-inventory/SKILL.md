---
id: "domain-product-inventory"
name: "Product & Inventory Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ về Quản lý sản phẩm, tồn kho và file số (Digital Products)."
---

# 📦 Product & Inventory Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `products`, `inventory`, `digital_file`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **Product Types:** Hỗ trợ 2 loại chính: Sản phẩm Vật lý (Physical) và Sản phẩm Số (Digital).
   - Sản phẩm Vật lý: BẮT BUỘC có hệ thống quản lý tồn kho (Inventory) và Phí giao hàng (Shipping).
   - Sản phẩm Số: Tồn kho vô hạn, BẮT BUỘC có cơ chế phân phối File/Link bảo mật (Presigned URL) sau khi thanh toán.
2. **Price Immutability trong Order:** Giá của Product có thể đổi, nhưng giá trị `price` đã lưu vào bảng `order_items` trong quá khứ KHÔNG ĐƯỢC PHÉP đổi theo (Historical Integrity).
3. **Soft Delete:** Xóa sản phẩm phải là Soft Delete, để không làm vỡ (break) lịch sử đơn hàng.

## 2. Relationships
- Bio 1-n Product.
- Product 1-n OrderItem.

## 3. Triggers
- Quản lý sản phẩm, tạo sản phẩm số/vật lý, trừ kho, tính giá.
