---
id: "domain-marketing-affiliate"
name: "Marketing & Affiliate Domain Skill"
version: "1.0.0"
description: "Quy tắc nghiệp vụ về tiếp thị liên kết (Affiliate), chia sẻ doanh thu và hoa hồng."
---

# 📢 Marketing & Affiliate Domain Skill

**Layer:** 3 - Domain Skills  
**Status:** Active  
**Associated Entities:** `affiliates`, `commissions`, `referrals`

## 1. Domain Invariants (Bất biến nghiệp vụ)
1. **Commission Source of Truth:** Tiền hoa hồng (Commission) PHẢI được tính dựa trên số tiền thực tế khách hàng đã thanh toán (`paid_amount`), KHÔNG tính trên `expected_amount`.
2. **Attribution Window:** Phải tuân thủ thời hạn lưu trữ cookie/session của người giới thiệu (Referrer) trước khi gán đơn hàng cho một Affiliate (Vd: Cookie tồn tại 30 ngày).
3. **No Self-Referral:** User không được tự click link affiliate của chính mình để mua hàng và hưởng hoa hồng (Cần logic chặn hoặc cảnh báo).
4. **Wallet Isolation:** Tiền hoa hồng được cộng vào "Ví" (Wallet) của người bán/affiliate. Các giao dịch Rút tiền (Payout) phải là transaction bảo mật tuyệt đối.

## 2. Relationships
- Affiliate liên kết với User (Người giới thiệu) và Bio (Cửa hàng được giới thiệu).
- Commission sinh ra từ 1 Order.

## 3. Triggers
- Tính toán chia tiền hoa hồng.
- Xử lý link Affiliate (`?ref=...`).
- Quản lý ví (Wallet) và Rút tiền.
