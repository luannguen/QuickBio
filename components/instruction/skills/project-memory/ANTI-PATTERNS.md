# 🚫 Project Memory Anti-Patterns

Tuyệt đối tránh những hành vi sau đây khi làm việc. Vi phạm các quy tắc này sẽ dẫn đến hệ thống bị "Alzheimer" (Mất trí nhớ) sau mỗi session.

## 1. Mắc kẹt trong "Chat Context" (Chat History Addiction)
- ❌ **Anti-pattern:** Dựa hoàn toàn vào các tin nhắn trước đó để nhớ rằng dự án đang dùng thư viện gì, kiến trúc ra sao.
- ✅ **Chuẩn:** Chat history sẽ bị xóa hoặc cắt bớt. Luôn đọc từ `project-memory/CONTEXT.md`.

## 2. Lười ghi chép Quyết Định (The "Silent Architect")
- ❌ **Anti-pattern:** Sửa logic của một module quan trọng, đổi cách kết nối Database, nhưng chỉ comment ở Code hoặc chát với User "Em sửa rồi nhé".
- ✅ **Chuẩn:** Ghi ngay vào `ARCHITECTURE_DECISIONS.md`. "Code chỉ mô tả CÁCH LÀM (How), ADR mô tả LÝ DO (Why)".

## 3. "Để Mai Tính" với Lỗi (The Sweeper)
- ❌ **Anti-pattern:** Thấy một cảnh báo lúc build (warning), tặc lưỡi bỏ qua vì ứng dụng vẫn chạy, không ghi chú lại ở đâu. Hôm sau Agent khác vào không biết lỗi này từ đâu ra.
- ✅ **Chuẩn:** Thêm ngay một dòng vào `TECHNICAL_DEBT.md`. 

## 4. Quá tải file Memory (The Hoarder)
- ❌ **Anti-pattern:** Copy/paste toàn bộ raw text log dài 1000 dòng vào `TECHNICAL_DEBT.md` hoặc `ADR`.
- ✅ **Chuẩn:** Memory phải ngắn gọn, súc tích (Human & AI Readable). Chỉ lưu ý chính, bối cảnh, quyết định, hệ quả.
