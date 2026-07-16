---
id: "wf-security"
name: "Security Review Workflow"
version: "1.0.0"
description: "Quy trình rà soát và kiểm toán bảo mật toàn bộ hệ thống hoặc một module cụ thể."
---

# 🛡️ Security Review Workflow

**Layer:** 4 - Workflows  
**Status:** Active  

## 1. Trigger
Khi User yêu cầu **Audit Security** hoặc kiểm tra hệ thống.

## 2. Các Bước Thực Thi Bắt Buộc

### Step 1: Scope Definition (Xác định phạm vi)
- Kích hoạt: `security` skill.
- Khoanh vùng cần audit: Là Database (RLS), Backend (API validation), hay Frontend (XSS)?

### Step 2: Vulnerability Scanning (Rà quét)
1. **Dependency Audit:** Chạy kiểm tra lỗ hổng thư viện NPM.
2. **Endpoint Audit:** Kiểm tra tất cả các API route có Auth Guard chưa?
3. **Database Audit:** Kiểm tra tất cả các bảng xem có RLS policy bảo vệ không? Mật khẩu có bị lộ không?

### Step 3: Reporting & Action Plan
- Tạo một File Report tổng hợp liệt kê các lỗ hổng tìm thấy.
- Phân loại rủi ro (Low, Med, High, Critical).
- Nếu phát hiện High/Critical: Dừng workflow và xin **Approval Gate** để tiến hành fix ngay lập tức (Chuyển sang Incident Response Workflow).
