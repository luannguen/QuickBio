---
id: "wf-performance"
name: "Performance Optimization Workflow"
version: "1.0.0"
description: "Quy trình tối ưu hóa tốc độ ứng dụng mà không thay đổi tính năng."
---

# ⚡ Performance Optimization Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Performance Optimization**.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Baseline Measurement (Đo lường cơ sở)
- KHÔNG tối ưu hóa bừa bãi. Xác định rõ điểm nghẽn (Bottleneck) nằm ở đâu? Là do Bundle Size, N+1 Query, Re-render, hay hình ảnh quá lớn?

### Step 2: Implementation (Tối ưu)
- Kích hoạt: `performance-scalability` skill.
- Áp dụng các giải pháp như Cache, Lazy Load, Indexing, Pagination.

### Step 3: Regression Check
- Mọi tối ưu hóa đều dễ dẫn đến lỗi nếu không test. Đặc biệt khi thêm bộ nhớ đệm (Cache) sẽ gây ra lỗi "Dữ liệu cũ (Stale Data)". Phải kiểm tra tính đúng đắn của logic vô hiệu hóa cache (Cache Invalidation).

### Step 4: Report
- Viết báo cáo ngắn gọn tóm tắt lại "Trước khi tối ưu" vs "Sau khi tối ưu". Cập nhật vào Memory.
