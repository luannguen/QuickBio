---
id: "wf-release"
name: "Release Workflow"
version: "1.0.0"
description: "Quy trình chuẩn bị môi trường và kiểm tra mã trước khi đẩy lên Production."
---

# 🚀 Release Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Release** hoặc có yêu cầu Deploy lên môi trường thực.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Pre-Release Checklist
- Kích hoạt: `devops-release` và `testing-quality`.
- Đảm bảo toàn bộ Biến Môi Trường (Env) cần thiết cho các API mới đã được điền đủ trên Vercel.
- Chạy lệnh build cục bộ để xác nhận không có lỗi Type/Lint.

### Step 2: Documentation Sync
- Cập nhật `README.md` hoặc Changelog của dự án.
- Cập nhật các quyết định cuối cùng vào `project-memory`.

### Step 3: Deployment
- Commit và đẩy mã lên nhánh chính (Main/Master).
- Kiểm tra trạng thái triển khai (CI/CD Logs).

### Step 4: Post-Release Verification
- Gọi thử endpoint hoặc truy cập trang chủ (bằng script hoặc dặn User kiểm tra) để đảm bảo không dính "White Screen of Death".
