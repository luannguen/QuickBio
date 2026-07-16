# 🔒 Approval Gates Policy

**Layer:** 1 - Constitution  
**Status:** Active  
**Description:** Quy định các hành động bị chặn cứng (Blocked), yêu cầu Agent phải dừng execution và thu thập sự phê duyệt rõ ràng từ User (Human Approval) trước khi thực hiện.

## 1. Mục Đích
Ngăn chặn các hệ quả không thể đảo ngược (irreversible), phá vỡ hệ thống (breaking), rò rỉ dữ liệu hoặc thay đổi kiến trúc/nghiệp vụ ngoài ý muốn của người điều hành.

## 2. Danh Sách Các Cổng Phê Duyệt (Approval Gates)

Agent **BẮT BUỘC DỪNG LẠI** và đưa ra yêu cầu phê duyệt khi task đụng chạm tới các phạm trù sau:

### 🔴 Mức Độ Dữ Liệu & Bảo Mật (Data & Security)
- Thay đổi permission model (phân quyền) hiện có.
- Thay đổi cơ chế Tenant (cách ly dữ liệu đa người dùng).
- Xóa dữ liệu (Delete/Drop tables, columns).
- **Hard delete** dữ liệu production (Luôn ưu tiên soft delete).
- Hạ cấp các rule bảo mật hoặc rule accessibility.
- Thay đổi Authentication/Authorization Provider.
- Thực hiện thao tác không thể đảo ngược (Irreversible actions).

### 🟠 Mức Độ Kiến Trúc & Codebase (Architecture & Infrastructure)
- Thay đổi Public API Contract theo hướng Breaking Change (Làm hỏng client cũ).
- Thực hiện Destructive Migration (Thay đổi kiểu dữ liệu gây mất mát thông tin).
- Nâng cấp Dependency Major có Breaking Change (Ví dụ: React 18 -> 19, Next 14 -> 15).
- Thêm Infrastructure Dependency lớn (Ví dụ: Thêm Redis, Kafka, Elasticsearch, Vector Database).
- Tạo Microservice mới (Chuyển từ Monolith sang Microservices).
- Tắt các test case hoặc validation gate hiện có.

### 🟡 Mức Độ Nghiệp Vụ (Business Logic)
- Thay đổi Business Rule cốt lõi đã được định nghĩa trong Domain.
- Thay đổi Source of Truth của hệ thống.
- Thay đổi Payment Provider (Cổng thanh toán).
- Thay đổi thuật toán tính toán tài chính (Financial calculation, commission, discount).

## 3. Hành Động Khi Gặp Approval Gate

Nếu Task yêu cầu một hành động thuộc danh sách trên nhưng **CHƯA ĐƯỢC User phê duyệt**:
1. **KHÔNG** thực hiện thay đổi vào file mã nguồn/database.
2. Agent **ĐƯỢC PHÉP**:
   - Khảo sát hệ thống và phân tích tác động (Impact Analysis).
   - Tạo đề xuất kiến trúc (Proposal).
   - Tạo kế hoạch di chuyển dữ liệu (Migration Plan).
   - Tạo mã chạy thử (Proof of Concept - PoC) trong môi trường biệt lập (scratch file) nếu an toàn.
3. Báo cáo rõ ràng cho User: *"Task này vướng Approval Gate [Tên Gate]. Đây là kế hoạch/hệ quả. Yêu cầu phê duyệt để tiếp tục."*

---
*Lưu ý: Không được tự ý bypass Approval Gates với lý do "Task quá nhỏ" hoặc "Tự tin rằng code sẽ chạy đúng".*
