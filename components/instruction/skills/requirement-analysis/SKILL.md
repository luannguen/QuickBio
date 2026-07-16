---
id: "requirement-analysis"
name: "Requirement Analysis Skill"
version: "1.0.0"
description: "Kỹ năng phân tích yêu cầu. Có nhiệm vụ làm rõ (clarify) các yêu cầu của user, phát hiện các edge cases, edge conditions và chuyển đổi chúng thành specs kỹ thuật rõ ràng trước khi code."
---

# 📝 Requirement Analysis Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Medium

## 1. Purpose
Mọi task do User đưa ra thường ở dạng ngôn ngữ tự nhiên (vague, underspecified). Kỹ năng này ép Agent phải dừng lại để đặt câu hỏi "What if" (Điều gì xảy ra nếu...) nhằm lấp đầy các khoảng trống logic, trước khi thiết kế kiến trúc hoặc viết code.

## 2. Triggers
- Các từ khóa: `requirement`, `spec`, `feature`, `logic`, `add`, `create`.
- Khi Orchestrator phân loại task là **Feature** hoặc **Enhancement**.

## 3. Required Inputs
- Original User Prompt.
- `CONTEXT.md` (Để biết Product Vision).

## 4. Expected Outputs
- Một danh sách **Clarifications** (Điều làm rõ) hoặc **Assumptions** (Giả định).
- **Acceptance Criteria (AC)** (Tiêu chí nghiệm thu).
- Các **Edge Cases** (Trường hợp ngoại lệ) đã được vạch ra và hướng xử lý.

## 5. Execution Workflow
1. Đọc và phân tích yêu cầu.
2. Áp dụng kỹ thuật 5 Whys (Tại sao) để đào sâu mục đích thực sự.
3. Nếu yêu cầu quá mù mờ, **PHẢI** tạo danh sách các câu hỏi mở và đưa ra đề xuất mặc định (Default assumptions) để User xác nhận thay vì bắt User tự nghĩ câu trả lời.
4. Ghi nhận các rào cản (Constraints) về mặt Business hoặc Tech.
5. Cập nhật `task.md` với các tiêu chí nghiệm thu (AC) rõ ràng.

## 6. Anti-Patterns (Cấm Kỵ)
- ❌ KHÔNG tự ý giả định một luồng nghiệp vụ lớn mà không thông báo cho User.
- ❌ KHÔNG bỏ qua việc xử lý các Edge Cases cơ bản (vd: User nhập sai, Network lỗi, Không có dữ liệu).
