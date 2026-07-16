---
id: "wf-bugfix"
name: "Bug Fix Workflow"
version: "1.0.0"
description: "Quy trình chuẩn mực để xử lý bug thông thường (không phải sự cố hệ thống)."
---

# 🐛 Bug Fix Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi Orchestrator phân loại Task là **Bug** hoặc **Fix**.

## 2. Các Bước Thực Thi Bắt Buộc (Execution Pipeline)

### Step 1: Reproduction (Tái Hiện)
- Bắt buộc phải tìm cách tái hiện lỗi (dựa trên mô tả hoặc log).
- KHÔNG BAO GIỜ được đoán mò và sửa đại (Guess driven development).

### Step 2: Root Cause Analysis (RCA)
- Kích hoạt: `project-memory` skill.
- Đọc code hiện tại, truy vết logic. Trả lời câu hỏi: Lỗi này do sai logic, thiếu validate, hay lỗi side-effect của component khác?

### Step 3: Implementation
- Nếu cần sửa giao diện: Kích hoạt `ui-ux-production`.
- Nếu cần sửa API: Kích hoạt `backend-production`.
- **Constraint:** Khi fix bug, TUYỆT ĐỐI không thêm feature mới hay đổi kiến trúc (Trừ khi kiến trúc là nguyên nhân gốc).

### Step 4: Regression Check (Kiểm tra hồi quy)
- Kích hoạt: `testing-quality`.
- Đảm bảo sửa chỗ này không làm hỏng chỗ khác (Đặc biệt là các logic liên quan ở Domain Skills).

### Step 5: Post-Task Memory Sync
- Nếu bug này bắt nguồn từ Technical Debt, hãy cập nhật file `TECHNICAL_DEBT.md`.

---
*Hoàn thành workflow: Agent báo cáo nguyên nhân và mã đã sửa.*
