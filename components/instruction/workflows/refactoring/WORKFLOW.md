---
id: "wf-refactor"
name: "Refactoring Workflow"
version: "1.0.0"
description: "Quy trình dọn dẹp, tái cấu trúc mã nguồn mà không thay đổi hành vi."
---

# 🧹 Refactoring Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Refactor** hoặc **Clean up debt**.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Boundary Identification (Xác định ranh giới)
- KHÔNG BẮT ĐẦU REFACTOR nếu chưa biết module này ảnh hưởng tới đâu. Tìm kiếm (Search codebase) xem component/hàm này được gọi ở đâu.

### Step 2: Implementation (Refactor)
- Kích hoạt: `code-review-refactoring` skill.
- Đảm bảo Rule: Không được thêm feature mới, chỉ thay đổi cấu trúc code.

### Step 3: Type & Build Validation
- Chạy Linter và TypeScript Compiler. Đảm bảo mọi đường dẫn import mới, type mới đều đúng.

### Step 4: Documentation Sync
- Kích hoạt: `documentation-sync` và `project-memory`.
- Nếu xóa nợ kỹ thuật, nhớ gạch bỏ mục tương ứng trong `TECHNICAL_DEBT.md`.
