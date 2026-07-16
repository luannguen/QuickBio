---
id: "project-orchestrator"
name: "Project Orchestrator Skill"
version: "1.0.0"
description: "Kỹ năng điều phối trung tâm. Chịu trách nhiệm đọc hiểu yêu cầu, đánh giá rủi ro, truy xuất trí nhớ dự án, phân loại task và route đến đúng các Skill và Workflow cần thiết."
---

# 🧠 Project Orchestrator Skill

**Layer:** 2 - Orchestration  
**Status:** Active  
**Mức độ áp dụng:** BẮT BUỘC cho mọi task (Được gọi từ AI-BOOTSTRAP).

## 1. Purpose (Mục đích)
Đóng vai trò là "Bộ Não Điều Phối" (The Conductor) của hệ thống. Kỹ năng này không sinh ra code. Nó đảm bảo Agent hiểu toàn cảnh dự án, xác định được giới hạn, lên kế hoạch chính xác, và tránh load toàn bộ các luật/skill không cần thiết gây tràn Context (Token Limit).

## 2. Triggers (Khi nào kích hoạt)
- **Mọi Task mới:** Bắt buộc kích hoạt ngay sau khi đọc `AI-BOOTSTRAP.md` và `PROJECT-CONSTITUTION.md`.

## 3. Required Inputs
- Yêu cầu của User.
- Nội dung của `SKILL-REGISTRY.md` và `WORKFLOW-REGISTRY.md`.

## 4. Expected Outputs (Đầu ra bắt buộc)
Orchestrator phải tạo ra một **Task Execution Brief** (Bản Tóm tắt Thực thi) nằm trong nội bộ suy nghĩ (Thought) hoặc lưu vào `task.md` trước khi gọi các skill khác. Bản Brief phải gồm:
- **Task Classification:** (vd: Feature, Bug, Refactor...).
- **Risk Level:** (Low, Medium, High, Critical).
- **Affected Layers:** (UI, Backend, DB, 3rd-party).
- **Required Capability Skills:** (Từ Registry).
- **Required Domain Skills:** (Từ Registry).
- **Selected Workflow:** (Từ Registry).
- **Approval Gates:** (Có vướng cổng nào trong `APPROVAL-GATES.md` không?).
- **Definition of Done (DoD).**

## 5. Execution Workflow (Quy trình thực thi)

1. **Step 1: Classify Task (Phân loại).** Xác định xem User đang muốn làm gì (Analysis, Feature, Fix, Refactor...).
2. **Step 2: Risk Assessment (Đánh giá rủi ro).**
   - *LOW:* Đổi màu, sửa chữ.
   - *MEDIUM:* Thêm API nhỏ, thêm form.
   - *HIGH:* Thêm bảng DB, đổi logic Auth/Payment.
   - *CRITICAL:* Đổi toàn bộ Database, Migration, Hard Delete, Sửa Quyền (Permission).
3. **Step 3: Retrieve Project Memory.** Gọi `project-memory` skill để đọc bối cảnh hiện hành từ thư mục `components/instruction/project-memory/`.
4. **Step 4: Check Approval Gates.** Trích chiếu qua `APPROVAL-GATES.md`. Dừng ngay nếu thuộc loại HIGH/CRITICAL bị chặn.
5. **Step 5: Skill Selection.** Chỉ nạp (view_file) những `SKILL.md` tương ứng từ `SKILL-REGISTRY.md` thay vì đọc toàn bộ hệ thống.
6. **Step 6: Workflow Selection.** Nạp `WORKFLOW.md` tương ứng từ `WORKFLOW-REGISTRY.md`.
7. **Step 7: Handoff.** Chuyển giao quá trình thực thi cho Workflow được chọn.

## 6. Constraints & Anti-Patterns (Cấm kỵ)
- ❌ KHÔNG bắt đầu viết code ngay khi chưa có Task Execution Brief.
- ❌ KHÔNG load những kỹ năng không liên quan (vd: sửa CSS thì không load Data Lifecycle Skill).
- ❌ KHÔNG bỏ qua bước Đánh giá rủi ro (Risk Assessment).

## 7. Memory Read/Write Policy
- **Read:** Bắt buộc nạp `project-memory/SKILL.md` và tuân theo hướng dẫn đọc bối cảnh.
- **Write:** Không trực tiếp ghi vào Memory, việc ghi sẽ do các Capability Skills hoặc bước cuối của Workflow đảm nhận.
