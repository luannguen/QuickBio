---
id: "code-review-refactoring"
name: "Code Review & Refactoring Skill"
version: "1.0.0"
description: "Quy chuẩn đọc hiểu code cũ, đánh giá chất lượng (Code Review) và kỹ thuật Refactoring không làm thay đổi hành vi."
---

# 🔎 Code Review & Refactoring Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Medium

## 1. Purpose
Nâng cao chất lượng mã nguồn bằng cách loại bỏ nợ kỹ thuật (Technical Debt), giảm độ phức tạp Cyclomatic, và đảm bảo code dễ đọc dễ bảo trì (Maintainable) mà không làm hỏng logic hiện tại.

## 2. Triggers
- Các yêu cầu: `refactor`, `clean up`, `review`, `optimize code`.
- Khi Agent phát hiện "Code Smell" trong lúc đang làm Feature.

## 3. Rules & Execution

### Code Review
1. Đánh giá tính đọc được (Readability): Tên biến/hàm có diễn giải đúng nghiệp vụ không?
2. Đánh giá hiệu năng (Performance): Có O(N^2) không cần thiết không? Có memory leak không?
3. Tránh God Object: File quá dài (>500 dòng) nên được chia nhỏ.

### Refactoring
1. **Rule of Thumb:** KHÔNG bao giờ thêm feature mới trong một commit refactoring. Chỉ cấu trúc lại code.
2. **Behavior Preservation:** BẮT BUỘC giữ nguyên hành vi (input/output) của hàm/component.
3. Nếu phát hiện rủi ro lớn (vd: refactor hàm dùng ở 20 nơi khác nhau), phải xin ý kiến User (Approval Gate) trước khi làm.

## 4. Anti-Patterns
- ❌ Sửa lỗi (Fix bug) và Refactor trong cùng một lần thay đổi mà không báo cáo rõ ràng.
- ❌ Refactor bằng cách xóa bỏ hoàn toàn code cũ thay vì dùng phương pháp Migration/Deprecation.
