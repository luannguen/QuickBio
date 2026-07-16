---
id: "wf-migration"
name: "Migration Workflow"
version: "1.0.0"
description: "Quy trình thay đổi cấu trúc database hoặc kiến trúc hệ thống cốt lõi."
---

# 🏗️ Migration Workflow

**Layer:** 4 - Workflows  
**Status:** Active  
**Priority:** High Risk

## 1. Trigger
Khi Orchestrator phân loại Task là **Migration** hoặc có thay đổi cấu trúc Database.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Pre-flight Planning (Lên kế hoạch)
- Kích hoạt: `data-lifecycle` và `migration-compatibility` skills.
- Viết 1 bản kế hoạch (Draft) mô tả: 
  1) Thay đổi những gì? 
  2) Dữ liệu cũ bị ảnh hưởng ra sao? 
  3) Cách lùi (Rollback) nếu thất bại.

### Step 2: Approval Gate (Bắt Buộc)
- **DỪNG LẠI:** Trình bày kế hoạch cho User và YÊU CẦU PHÊ DUYỆT.
- Chỉ tiếp tục nếu User gõ lệnh duyệt (Approve).

### Step 3: Script Generation
- Tạo script SQL Migration hoặc Script Data Transfer.
- Đảm bảo áp dụng nguyên tắc Backward Compatibility (Expand & Contract).

### Step 4: Execution & Verification
- Chạy script/code.
- Nếu gặp lỗi: Lập tức Rollback, không cố sửa script trên Production Data.

### Step 5: Post-Task Memory Sync
- Cập nhật schema documentation. Ghi nhận thời điểm migration vào `ADR`.
