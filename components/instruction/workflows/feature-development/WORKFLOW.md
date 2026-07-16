---
id: "wf-feature"
name: "Feature Development Workflow"
version: "1.0.0"
description: "Quy trình chuẩn mực để xây dựng một tính năng mới từ đầu đến cuối."
---

# 🚀 Feature Development Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Feature** hoặc **Enhancement**.

## 2. Các Bước Thực Thi Bắt Buộc (Execution Pipeline)

### Step 1: Requirement Analysis
- Kích hoạt: `requirement-analysis` skill.
- Đầu ra: Bản nháp Specs và danh sách các Edge Cases. Báo cáo User nếu cần.

### Step 2: System Architecture Design
- Kích hoạt: `system-architecture` skill, `project-memory` skill.
- Đầu ra: Phác thảo luồng dữ liệu, xác định các module bị tác động. Tạo file thiết kế nháp.
- **Approval Gate:** Nếu là module lớn, BẮT BUỘC xin User duyệt kiến trúc.

### Step 3: Domain & Security Check
- Kích hoạt: `security` skill và các `Domain` skill liên quan (Vd: User, Product).
- Đảm bảo logic không vi phạm các Invariants (Luật bất biến).

### Step 4: Implementation (Code)
- Kích hoạt: `ui-ux-production` (Nếu có UI), `backend-production` (Nếu có API/DB).
- Nếu cần giao tiếp mạng ngoài: `api-integration`.
- Nếu có update DB: `data-lifecycle`.

### Step 5: QA & Code Review
- Kích hoạt: `testing-quality`, `code-review-refactoring`.
- Đầu ra: Code đã được format, không còn lỗi TypeScript.

### Step 6: Post-Task Memory Sync
- Kích hoạt: `project-memory`, `documentation-sync`.
- Đầu ra: Cập nhật `ADR`, `README.md`, `Technical Debt`.

---
*Hoàn thành workflow: Agent báo cáo "Feature Ready" kèm theo tài liệu thay đổi.*
