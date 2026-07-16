---
id: "uiux_luan"
name: "UI/UX Production Engineering Skill"
version: "1.0.0"
description: "Phân tích, thiết kế, triển khai và kiểm tra giao diện production dựa trên design system, UX flow, accessibility, responsive, performance và kiến trúc thực tế của dự án."
---

# UI/UX Production Engineering Skill (UIUX_luan)

Đây là Skill cốt lõi và **bắt buộc** phải sử dụng đối với toàn bộ các tác vụ có liên quan đến giao diện (UI) và trải nghiệm người dùng (UX) trong dự án. Skill này không phải là lời khuyên, mà là hệ thống tiêu chuẩn kỹ thuật.

## 🎯 PURPOSE
Đảm bảo chất lượng production cho toàn bộ giao diện: tính nhất quán, khả năng tái sử dụng component, chuẩn responsive, accessibility, và xử lý triệt để các trạng thái của UI (loading, empty, error) tránh technical debt.

## ⚡ TRIGGERS
Skill này phải được kích hoạt tự động khi tác vụ liên quan đến:
`create page`, `edit page`, `create component`, `modify component`, `UI`, `UX`, `layout`, `responsive`, `form`, `table`, `dashboard`, `navigation`, `modal`, `design`, `accessibility`, `styling`, `theme`, `animation`.

## 📥 REQUIRED INPUTS
- Bối cảnh người dùng (User intent).
- Phân quyền (Role-based access).
- Dữ liệu mock/real (Data structure).
- Yêu cầu responsive, platform mục tiêu.

## 📤 EXPECTED OUTPUTS
- UX Decision Summary.
- Code UI đã được phân tách hợp lý, tái sử dụng component tối đa.
- Giao diện có đầy đủ các trạng thái (Loading, Error, Empty, Success).
- Giao diện responsive 100% trên các breakpoint yêu cầu.
- Giao diện vượt qua chuẩn Accessibility cơ bản.

## 🚧 CONSTRAINTS
- Tuân thủ thiết kế hiện tại (Design Tokens, Tailwind Config).
- KHÔNG tạo thêm primitive components nếu đã có sẵn tương đương.
- KHÔNG được phép bỏ qua luồng xử lý lỗi và loading.

## 📁 MANDATORY FILES
Khi skill này được gọi, Agent BẮT BUỘC phải tham chiếu:
- `RULES.md`
- `CHECKLIST.md`
- `ANTI-PATTERNS.md`
- `PATTERNS.md`

## ⚙️ EXECUTION WORKFLOW
1. **Task Classification**: Nhận diện phạm vi thay đổi UI/UX.
2. **Context Discovery**: Tìm kiếm component/pattern tương tự trong codebase.
3. **UX Analysis**: Viết UX Decision Summary.
4. **Option Analysis**: Nếu có nhiều cách giải quyết, liệt kê ưu/nhược và chọn 1.
5. **Implementation Plan**: Liệt kê file tạo/sửa.
6. **Implementation**: Code tuân thủ mức độ ưu tiên của RULES.
7. **Self-Review**: Chạy Post-Implementation validation.
8. **Output Report**: Báo cáo những gì đã làm, file nào đã tác động, rủi ro/debt còn lại.

## 🛑 VALIDATION PROCESS & COMPLETION CRITERIA
Task chỉ được coi là hoàn thành (DONE) khi:
- Passes type check, lint, build.
- Xử lý đủ các states (Initial, Loading, Empty, Error).
- Vượt qua kiểm tra Responsive cơ bản (Desktop, Tablet, Mobile).
- Focus state và Accessible Label đầy đủ cho form/interactive elements.

## 🔄 UPDATE POLICY
- Skill này là "Living Document" (Tài liệu sống).
- Chỉ cập nhật khi phát hiện pattern/anti-pattern có khả năng tái sử dụng hoặc quy chuẩn dự án thay đổi.
- Mọi thay đổi phải được ghi lại trong `CHANGELOG.md`. Không được tự ý hạ tiêu chuẩn (vd: đổi BLOCKER thành SHOULD) nếu không có sự đồng ý của User.
