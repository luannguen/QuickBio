# 🌌 A.A.P v3.0 - AGENT OPERATIONAL PROTOCOL

## 1. Các Phase Kích hoạt (Triggers)
- **Phase 1: TIẾP NHẬN & TƯ DUY** -> Kích hoạt khi nhận Task mới. Đọc `AGENTIC-BEHAVIOR.md` & `GOALS.md`.
- **Phase 2: QUẢN TRỊ & QUY TRÌNH** -> Kích hoạt khi lập Plan/Task. Cập nhật `PROJECT-CONTEXT.md` & `DECISION-LOG.md`.
- **Phase 3: THỰC THI & CODING** -> Kích hoạt trước khi viết code (`write_to_file`, `replace_file_content`). Bắt buộc đọc `AI-CODING-RULES.md`.

## 2. Tiêu chuẩn Artifacts
- **Implementation Plan**: Phải có mục *User Review Required* để user duyệt trước khi làm.
- **Task List**: Theo dõi tiến độ chi tiết `[ ]`, `[/]`, `[x]`. Cập nhật liên tục.
- **Walkthrough**: Tóm tắt kết quả sau khi hoàn thành.
- **Vị trí**: Lưu trong thư mục artifacts của Gemini.

## 3. Xử lý Lỗi & Khắc phục
- Nếu Code sinh ra vi phạm Rule -> Làm lại ngay lập tức.
- Nếu Build lỗi -> KHÔNG ĐƯỢC đoán mù. Đọc Log, view file gây lỗi, sau đó mới sửa.
