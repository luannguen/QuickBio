# 🧠 Lõi Bộ Nhớ Dự Án (Project Memory Index)

Đây là mục lục và điểm khởi đầu để truy xuất bất kỳ kiến thức nào thuộc về dự án này. 
**Tài liệu này là The Single Source of Truth (Nguồn Sự Thật Duy Nhất).**

> ⚠️ Mọi Agent làm việc trên dự án này phải cập nhật các file liên quan tại đây khi có thay đổi lớn. KHÔNG ĐƯỢC dựa vào lịch sử chat.

## 🗺️ Bản Đồ Tri Thức (Knowledge Map)

### 1. Thông Tin Cốt Lõi (Core Context)
- **[CONTEXT.md](CONTEXT.md)**: Chứa mục tiêu, kiến trúc tổng thể, tech stack và các nguyên tắc thiết kế bất biến của dự án. 
- *Truy cập khi:* Cần hiểu dự án làm gì, đối tượng người dùng, hoặc các ràng buộc nghiệp vụ cơ bản.

### 2. Quyết Định Kỹ Thuật (Architecture & Decisions)
- **[ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md)**: Nhật ký các quyết định về kiến trúc (ADRs - Architecture Decision Records).
- *Truy cập khi:* Muốn biết "Tại sao chức năng A lại thiết kế theo cách B", "Vì sao không dùng thư viện C". 

### 3. Nợ Kỹ Thuật & Cần Khắc Phục (Technical Debt & Remediation)
- **[TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)**: Danh sách các lỗi đã biết, nợ kỹ thuật, cấu hình tạm thời, và kế hoạch khắc phục.
- *Truy cập khi:* Có lỗi khó hiểu, code cũ cần refactor, hoặc muốn tối ưu hiệu năng.

### 4. Thiết Kế Miền Dữ Liệu (Domain Model) (Tạo khi cần)
- Chứa các quy định về chuẩn hóa dữ liệu, logic nghiệp vụ chuyên sâu. (Sẽ được định nghĩa thêm nếu domain phình to).

## 🔄 Quy Trình Đọc/Ghi (Read/Write Workflow)

1. **Trước khi Code (Pre-Task):** Tìm file phù hợp trong INDEX để nạp bối cảnh.
2. **Trong khi Code (Execution):** Nếu phát hiện ràng buộc hệ thống mới, ghi nháp lại.
3. **Sau khi Code (Post-Task):** Mở các file ở trên để cập nhật thông tin nếu có quyết định/thay đổi lớn. 

---
*Mọi thay đổi cấu trúc của thư mục này phải được ghi lại ở cuối file INDEX.md.*
