---
id: "project-memory"
name: "Project Memory & Continuity Engineering Skill"
version: "2.0.0"
description: "Bộ quy tắc quản trị tri thức và trí nhớ của dự án."
---

# 🧠 Project Memory & Continuity Engineering Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Low

## 🎯 PURPOSE (MỤC ĐÍCH)
Kỹ năng này hoạt động như Hệ điều hành Bộ nhớ Dự án (Project Memory OS). Nó giải quyết tình trạng "mất trí nhớ" của AI khi phiên làm việc bị xóa hoặc cắt bớt (truncated context).
Mọi kiến trúc, quyết định, bug, và nợ kỹ thuật phải được lưu cứng vào ổ đĩa.

## ⚡ TRIGGERS (KÍCH HOẠT)
- **KÍCH HOẠT ĐẦU TIÊN:** Bắt buộc được gọi *trước* mọi kỹ năng khác (UI/UX, Backend) trong mọi Task.
- **Khi kết thúc Task:** Bắt buộc được gọi lại để ghi nhận quyết định (Post-Task Write-back).

## 📥 REQUIRED INPUTS
- Task request từ người dùng.

## 📤 EXPECTED OUTPUTS
- Bối cảnh được nạp chính xác vào AI trước khi viết code.
- Hồ sơ dự án (INDEX, ADRs, DEBT) được cập nhật nếu có thay đổi trong quá trình code.

## 📁 MANDATORY KNOWLEDGE BANKS
Thư mục gốc của bộ nhớ: `components/instruction/project-memory/`
- `INDEX.md` (Điểm bắt đầu)
- `CONTEXT.md`
- `ARCHITECTURE_DECISIONS.md`
- `TECHNICAL_DEBT.md`

## ⚙️ EXECUTION WORKFLOW (Quy trình)

### Giai đoạn 1: Pre-Task Retrieval (Nạp bối cảnh)
1. Đọc `components/instruction/project-memory/INDEX.md`.
2. Truy xuất các file liên quan đến mục tiêu task (Ví dụ: Đọc `CONTEXT.md` để biết tech stack, `TECHNICAL_DEBT.md` để xem bug hiện tại có liên quan không).
3. Đọc `RULES.md` của Skill này.

### Giai đoạn 2: Execution (Thực thi)
- Chuyển quyền điều khiển sang các Skill chuyên môn (Ví dụ: `UI/UX Production` hoặc `Backend Production`).
- Ghi chú tạm thời vào bộ nhớ ngắn hạn bất kỳ quyết định quan trọng nào phát sinh.

### Giai đoạn 3: Post-Task Write-Back (Ghi nhớ)
- Trước khi đóng task, tự hỏi: "Task này có thêm component mới, đổi kiến trúc, hay phát sinh workaround nào không?"
- Nếu CÓ: Sử dụng Tool chỉnh sửa file để cập nhật `ARCHITECTURE_DECISIONS.md` hoặc `TECHNICAL_DEBT.md`.
- Sử dụng `CHECKLIST.md` của skill này để verify trước khi báo cáo User.

---
*Skill này ngăn chặn vĩnh viễn hiện tượng "Code xong mai AI quên hết".*
