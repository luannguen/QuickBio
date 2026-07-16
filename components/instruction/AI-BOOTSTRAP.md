# AI BOOTSTRAP - Hệ Thống Điều Phối Agent

Tệp này là entry point (điểm khởi đầu) bắt buộc cho mọi hoạt động của Agent trong dự án. Bạn **KHÔNG ĐƯỢC PHÉP** bỏ qua bước đọc file này khi nhận task mới.

## MỤC TIÊU
- Đảm bảo Agent luôn tuân thủ quy trình chuẩn trước khi bắt đầu viết code.
- Phân luồng task về đúng Skill/Instruction cần thiết.
- Tránh tình trạng Agent làm việc dựa trên trí nhớ mơ hồ hoặc giả định sai lệch về kiến trúc.

---

## 🚦 ROUTING RULES (BẮT BUỘC)

Khi nhận một task, Agent phải phân tích yêu cầu để kích hoạt các Skill tương ứng.

### 1. Luồng UI/UX & Giao diện (The UI/UX Pipeline)

**[TRIGGER] Nếu task chứa hoặc tác động đến bất kỳ yếu tố nào sau đây:**
`UI`, `UX`, `page`, `layout`, `component`, `form`, `table`, `dashboard`, `navigation`, `responsive`, `styling`, `theme`, `typography`, `modal`, `dialog`, `drawer`, `accessibility`, `animation`, `visual`, `interaction`, `loading state`, `empty state`, `error state`.

**[ACTION] BẮT BUỘC THỰC HIỆN CÁC BƯỚC SAU (BLOCKER):**
1. **Đọc UI/UX Production Skill**: Đọc toàn bộ các file trong `components/instruction/skills/uiux_luan/` (bao gồm `SKILL.md`, `RULES.md`, `CHECKLIST.md`, `ANTI-PATTERNS.md`, `PATTERNS.md`).
2. **Tìm kiếm Pattern/Component**: Tìm kiếm trong codebase các component/pattern hiện có tương tự với yêu cầu.
3. **Tạo UX Decision Summary**: Lập một bản tóm tắt quyết định UX (ngắn gọn) trước khi code.
4. **Pre-Implementation Checklist**: Đánh giá theo checklist trước khi code.
5. **Thực thi Code**: Code tuân thủ nghiêm ngặt các RULES (đặc biệt là mức BLOCKER và MUST).
6. **Post-Implementation Validation**: Chạy checklist sau khi code (responsive, accessibility, states).
7. **Ngoại lệ (nếu có)**: Ghi lại bất kỳ ngoại lệ nào vi phạm MUST/BLOCKER kèm theo lý do.
8. **Tự cập nhật (Self-Correction)**: Đề xuất cập nhật Skill/Patterns nếu phát hiện logic có thể tái sử dụng.

> 🛑 **CHẶN (ENFORCEMENT)**: Tuyệt đối **KHÔNG ĐƯỢC** output code liên quan đến giao diện (UI/UX) nếu chưa hoàn thành bước đọc UIUX_luan Skill và phân tích tái sử dụng (reuse analysis).

---

## 🛠 QUY TRÌNH TASK CLASSIFICATION (Dành cho mọi task)

1. **Nhận Task**: Đọc kỹ yêu cầu từ người dùng.
2. **Phân loại**:
   - Đây là task tạo mới hay sửa đổi?
   - Thuộc tầng nào (UI, Logic, Service, Database)?
   - Có thay đổi luồng người dùng (UX flow) không?
3. **Route**: Dựa vào phân loại, tìm đến các thư mục instruction tương ứng (VD: `skills/uiux_luan` cho giao diện).
4. **Discovery**: Đọc các file liên quan (như Tailwind config, Base components).
5. **Plan & Execute**: Phải có kế hoạch rõ ràng trước khi viết dòng code đầu tiên.

---

## 🔄 CƠ CHẾ TỰ CẬP NHẬT (EVOLUTION)

Agent có trách nhiệm theo dõi và cập nhật file trong thư mục `instruction` (đặc biệt là các Skill) khi phát hiện:
- Các Shared Component mới hình thành.
- Lỗi lặp lại nhiều lần (cần đưa vào Anti-patterns).
- Quy chuẩn mới trong dự án.

Việc cập nhật phải được ghi chú rõ trong `CHANGELOG.md` của từng Skill.
