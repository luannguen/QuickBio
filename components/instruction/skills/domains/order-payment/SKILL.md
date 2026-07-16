---
id: "domain-order-payment"
name: "Order & Payment Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ về luồng thanh toán, xử lý đơn hàng và an toàn giao dịch tài chính."
---

# 💳 Order & Payment Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `orders`, `transactions`, `qr_code`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **Financial Immutability:** Đơn hàng đã chuyển sang trạng thái `paid` (đã thanh toán) tuyệt đối KHÔNG ĐƯỢC PHÉP sửa đổi giá trị (`total_amount`), danh sách sản phẩm hay chiết khấu.
2. **State Machine Bắt Buộc:** Luồng đơn hàng phải đi theo chiều: `pending` -> `processing`/`paid` -> `completed` / `cancelled`. Không được nhảy ngược từ `completed` về `pending`.
3. **Transaction Safety:** Bất kỳ thao tác Cập nhật đơn hàng thành `paid` + Trừ tồn kho (Inventory) + Cộng hoa hồng (Commission) ĐỀU PHẢI nằm trong 1 Database Transaction duy nhất. Không được làm rải rác trên API.

## 2. Relationships
- Order thuộc về 1 Bio (Tenant).
- Order thuộc về 1 User (Người mua).
- Order chứa nhiều OrderItems (Sản phẩm).

## 3. Triggers
- Xử lý Webhook thanh toán (SePay, Stripe).
- Xử lý logic tính tổng tiền, mã giảm giá.
- Tạo đơn hàng mới.
