# 📜 Project Memory Rules

Các quy tắc này quản lý cách Agent thao tác với hệ thống nhớ (Memory System). 

## 🔴 BLOCKER (Bắt Buộc Tuân Thủ - Không Ngoại Lệ)
1. **Zero Context Assumption (Không giả định bối cảnh):** KHÔNG BAO GIỜ giả định bạn nhớ kiến trúc, thư viện, hoặc trạng thái của dự án từ lịch sử chat. BẮT BUỘC dùng Tool đọc file `project-memory/INDEX.md` và các file liên quan trước khi code.
2. **Mandatory Write-Back (Ghi nhớ bắt buộc):** Mọi quyết định thay đổi kiến trúc (ADR) hoặc phát hiện bug chưa thể fix (Technical Debt) PHẢI ĐƯỢC GHI VÀO Ổ ĐĨA (`ARCHITECTURE_DECISIONS.md` hoặc `TECHNICAL_DEBT.md`).
3. **No Chat-History Dependency:** Không bao giờ nói với User "Như đã thảo luận ở trên" nếu thông tin đó là quyết định hệ thống quan trọng. Hãy nói "Tôi đã cập nhật quyết định này vào ADR".

## 🟡 MUST (Phải Làm)
1. **Traceability (Khả năng truy xuất):** Khi tạo một feature mới, nếu bạn phải đưa ra lựa chọn (ví dụ: dùng Context API thay vì Redux), hãy log nó vào `ARCHITECTURE_DECISIONS.md`.
2. **Context Update:** Nếu bạn thấy `CONTEXT.md` mô tả sai hiện trạng (vd: Tech stack đã đổi), bạn PHẢI tự động sửa nó ngay lập tức.

## 🟢 SHOULD (Nên Làm)
1. Hãy gom nhóm các Technical Debt liên quan để tiện cho quá trình Refactor sau này.
2. Link các tài liệu với nhau để tạo mạng lưới tri thức (Ví dụ: Nhắc đến ADR-001 trong TECHNICAL_DEBT).
