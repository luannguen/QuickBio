# 📜 Project Constitution

**Layer:** 1 - Constitution
**Status:** Active
**Description:** Hệ thống nguyên tắc tối cao của dự án. Mọi Agent và Engineer phải tuân thủ tuyệt đối các nguyên tắc này. Không một cấu hình, rule hay skill nào được phép vượt mặt Constitution.

## 1. Hierarchy of Precedence (Thứ tự Ưu tiên)
Khi có sự xung đột giữa các nguồn chỉ dẫn, áp dụng theo thứ tự sau (từ cao xuống thấp):
1. Security & Safety Invariants (Nguyên tắc bảo mật và an toàn cốt lõi).
2. Data Integrity & Business Invariants (Toàn vẹn dữ liệu và tính đúng đắn nghiệp vụ).
3. Approved Specifications (Yêu cầu kỹ thuật đã được User phê duyệt).
4. PROJECT CONSTITUTION (Bản Hiến pháp này).
5. AI-BOOTSTRAP Routing (Luồng điều phối mặc định).
6. Accepted Architecture Decisions (Các ADR trong Project Memory).
7. Production Skills & Domain Skills (Các skill tại thư mục `skills/`).
8. Workflow Instructions (Các quy trình tại thư mục `workflows/`).
9. Task-specific Instructions (Yêu cầu tức thời của User).
10. Project Memory (Bối cảnh chung).
11. Current Implementation (Code hiện hành).

*Lưu ý:* Nếu code hiện hành vi phạm Business Invariants hoặc Specifications, BẮT BUỘC phải báo cáo là "Conflict" và từ chối hợp thức hóa lỗi.

## 2. Rule Enforcement Levels (Các Cấp Độ Quy Tắc)

### 🔴 BLOCKER
- **Định nghĩa:** Yêu cầu tiên quyết, vi phạm sẽ gây hậu quả nghiêm trọng (hỏng data, lộ lọt bảo mật).
- **Hành động:** KHÔNG được phép bỏ qua. KHÔNG được tuyên bố "Hoàn thành Task" nếu còn vi phạm.

### 🟡 MUST
- **Định nghĩa:** Bắt buộc tuân thủ theo tiêu chuẩn kỹ thuật của dự án.
- **Hành động:** Phải thực hiện. Nếu có ngoại lệ do giới hạn nền tảng, bắt buộc phải ghi rõ lý do vào Project Memory và có biện pháp bù trừ (workaround).

### 🔵 SHOULD
- **Định nghĩa:** Khuyến nghị mạnh mẽ để đạt chất lượng tốt nhất.
- **Hành động:** Nên áp dụng. Nếu quyết định bỏ qua, phải giải thích ngắn gọn trong báo cáo Task.

### 🟢 MAY
- **Định nghĩa:** Lựa chọn tùy ngữ cảnh.
- **Hành động:** Áp dụng linh hoạt dựa trên sự phân tích trade-off (chi phí/lợi ích).

## 3. The Immutable Laws (Các Đạo Luật Bất Biến)

1. **Production-First Mindset:** KHÔNG viết code kiểu "demo", "MVP hack" hoặc "prototype" nếu User yêu cầu chất lượng production.
2. **Business Rule Integrity:** Agent KHÔNG ĐƯỢC TỰ Ý thay đổi luật nghiệp vụ (Business Rules). Nếu yêu cầu có vẻ phi logic, phải dừng lại hỏi User.
3. **No Unapproved Breaking Changes:** Agent KHÔNG ĐƯỢC TỰ Ý tạo breaking change cho Public API hoặc Database Schema đang hoạt động. Phải có Migration Plan và xin phê duyệt.
4. **Validation Non-Negotiable:** KHÔNG ĐƯỢC bỏ qua các bước kiểm tra (Security, Data Integrity, Regression) đã được quy định trong Skill/Workflow.
5. **Never Mask a Business Bug:** Tuyệt đối không dùng code hiện tại để "hợp thức hóa" một lỗi nghiệp vụ đang tồn tại.
6. **No Silent Changes:** Mọi sự thay đổi về contract (API, Database, Permission) phải được phản ánh ngay lập tức vào Documentation và Project Memory.

## 4. Forbidden Actions (Hành Động Nghiêm Cấm)
Agent KHÔNG ĐƯỢC TỰ ĐỘNG thực hiện các hành động sau dưới bất kỳ hình thức nào:
- Xóa bỏ hoặc hạ cấp một rule từ **BLOCKER** xuống cấp thấp hơn.
- Làm suy yếu các cơ chế bảo mật (Security), quyền truy cập (Accessibility), hoặc cách ly dữ liệu (Tenant isolation).
- Giảm nhẹ các tiêu chuẩn Production-Ready để "hoàn thành task nhanh hơn".

---
*Ghi chú: Bản Hiến pháp này chỉ có thể được thay đổi thông qua lệnh trực tiếp từ System Admin/User với xác nhận rõ ràng "Update Constitution".*
