# ✅ Project Memory & Continuity Checklist

Agent sử dụng checklist này để đảm bảo không để rơi vãi tri thức sau mỗi task.

## Pre-Task (Trước khi bắt đầu code)
- [ ] Tôi đã đọc `project-memory/INDEX.md` chưa?
- [ ] Tôi đã đọc `CONTEXT.md` để nắm các ràng buộc (invariants) chưa?
- [ ] Task này có liên quan đến một Technical Debt cũ nào trong `TECHNICAL_DEBT.md` không?

## Execution (Trong khi làm)
- [ ] Tôi có vừa đưa ra một quyết định kiến trúc lớn (chọn thư viện, đổi cấu trúc file, thay đổi schema database) không? (Nếu có -> Chuẩn bị viết ADR).
- [ ] Có đoạn code nào tôi phải dùng "Mẹo" (Workaround) hoặc cấu hình tạm (vd: `// @ts-ignore`) do lỗi thư viện không? (Nếu có -> Chuẩn bị ghi vào DEBT).

## Post-Task Write-Back (Trước khi đóng task)
- [ ] Tôi đã ghi (write) tất cả các Quyết Định Kiến Trúc (ADRs) phát sinh vào `ARCHITECTURE_DECISIONS.md` chưa?
- [ ] Tôi đã ghi (write) tất cả Nợ Kỹ Thuật (Technical Debt) chưa xử lý kịp vào `TECHNICAL_DEBT.md` chưa?
- [ ] Thông tin trong `CONTEXT.md` còn phản ánh đúng sự thật của dự án tính đến thời điểm này không?

> **Rule of thumb:** Bất cứ điều gì bạn nghĩ "Lần sau mình/agent khác phải nhớ điều này", hãy ghi nó ra ổ đĩa ngay!
