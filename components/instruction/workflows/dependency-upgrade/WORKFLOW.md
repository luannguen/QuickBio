---
id: "wf-dependency"
name: "Dependency Upgrade Workflow"
version: "1.0.0"
description: "Quy trình cập nhật thư viện (NPM/Pip) an toàn."
---

# 📦 Dependency Upgrade Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Dependency Upgrade** hoặc **Vulnerability Fix**.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Impact Analysis
- Đọc `package.json`. Kiểm tra xem đây là bản nâng cấp Minor/Patch hay Major?
- Nếu là **Major Upgrade** (Ví dụ: `React 18` -> `19`), BẮT BUỘC đọc Changelog của thư viện đó trước.

### Step 2: Approval Gate
- Nếu là Major Upgrade -> **DỪNG LẠI**, xin phép User (Vì khả năng Breaking Change cao).
- Nếu là Minor/Patch -> Bỏ qua Approval Gate.

### Step 3: Upgrade & Audit
- Cập nhật thư viện. Xóa `node_modules` và cài lại nếu cần.
- Chạy lệnh kiểm tra lỗ hổng (Vd: `npm audit`).

### Step 4: Full System Build
- BẮT BUỘC chạy lệnh Build toàn bộ dự án (`npm run build`). Nếu Build fail, phải hạ cấp (Downgrade) về phiên bản cũ ngay lập tức.
