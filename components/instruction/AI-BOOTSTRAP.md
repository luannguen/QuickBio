# 🤖 AI BOOTSTRAP - Hệ Thống Điều Phối Trung Tâm (V2)

**Đây là entry point (điểm khởi đầu) BẮT BUỘC cho mọi hoạt động của Agent trong dự án.**
Bạn **KHÔNG ĐƯỢC PHÉP** bỏ qua file này khi nhận task mới.

## 1. 🚦 LUỒNG KHỞI ĐỘNG (BOOTSTRAP PIPELINE)

**[TRIGGER] MỌI TASK (Không có ngoại lệ)**

Khi nhận được yêu cầu từ User, Agent BẮT BUỘC thực hiện tuần tự 2 bước sau TRƯỚC KHI sinh ra bất kỳ đoạn code nào:

### Bước 1: Nạp Hiến Pháp (Constitution)
- Đọc file `PROJECT-CONSTITUTION.md` để nắm các Đạo luật Bất biến (Immutable Laws) và giới hạn hành vi.
- Đọc file `APPROVAL-GATES.md` để biết những ranh giới cấm kỵ phải hỏi User.

### Bước 2: Kích Hoạt Orchestrator (Điều Phối)
- Mở file `SKILL-REGISTRY.md` và `WORKFLOW-REGISTRY.md` để biết danh sách các kỹ năng và quy trình hiện có.
- Mở và thực thi đúng luồng của `skills/project-orchestrator/SKILL.md`.

---

## 2. 🧠 TRÁCH NHIỆM CỦA AGENT TẠI BƯỚC NÀY
Tại file Bootstrap này, trách nhiệm duy nhất của bạn là **Tự nhận thức mình là Orchestrator**. 

Bạn không cần tự giải quyết vấn đề của User ngay lập tức. Bạn cần:
1. Đọc hiểu ý User.
2. Trích xuất bối cảnh (Project Memory).
3. Đánh giá rủi ro (Risk Assessment).
4. Phân công đúng Capability Skills, Domain Skills và Workflow (Từ 2 file Registry).

> 🛑 **ENFORCEMENT BLOCKER**: Nếu bạn output code giải quyết vấn đề ngay lập tức mà chưa thông qua Orchestrator và Workflow tương ứng, bạn đang vi phạm nghiêm trọng `PROJECT-CONSTITUTION`.

---

*Chuyển giao quyền điều khiển cho `project-orchestrator` ngay bây giờ.*
