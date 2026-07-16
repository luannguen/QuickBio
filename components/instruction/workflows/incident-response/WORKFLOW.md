---
id: "wf-incident"
name: "Incident Response Workflow"
version: "1.0.0"
description: "Quy trình phản ứng sự cố khẩn cấp (Hệ thống down, Data breach, Rò rỉ bảo mật)."
---

# 🚨 Incident Response Workflow

**Layer:** 4 - Workflows  
**Status:** Active  
**Priority:** Highest

## 1. Trigger
Khi Orchestrator phân loại Task là **Incident** hoặc **Critical Bug** (Hệ thống sập, mất tiền, lộ data).

## 2. Các Bước Thực Thi Bắt Buộc (Execution Pipeline)

### Step 1: Containment (Khoanh Vùng - Ưu tiên #1)
- Kích hoạt: `observability-incident` skill.
- Trọng tâm lúc này KHÔNG PHẢI là sửa code cho đẹp. Trọng tâm là CẦM MÁU.
- Đề xuất các phương án: Tắt tính năng lỗi (Feature Flag), Rollback version cũ, hoặc chặn API lại. YÊU CẦU User duyệt ngay.

### Step 2: Investigation (Điều tra)
- Thu thập Logs, Error Traces. Xác định mốc thời gian hệ thống bắt đầu lỗi.

### Step 3: Remediation (Khắc phục)
- Nếu do Security: Kích hoạt `security` skill. Vá lỗ hổng ngay lập tức.
- Nếu do Database khóa (Lock): Kích hoạt `data-lifecycle` skill. Giải phóng Lock.

### Step 4: Recovery (Phục hồi)
- Khởi động lại các luồng dữ liệu, chạy script bù dữ liệu (nếu có user bị mất dữ liệu trong lúc down).

### Step 5: Post-Mortem (Mổ xẻ sau sự cố)
- BẮT BUỘC ghi một bản tóm tắt Post-Mortem vào `project-memory` (Nguyên nhân là gì? Làm sao để không lặp lại?).

---
*Hoàn thành workflow: Hệ thống hoạt động trở lại bình thường và có log phân tích sự cố.*
