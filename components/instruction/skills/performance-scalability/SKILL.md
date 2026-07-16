---
id: "performance-scalability"
name: "Performance & Scalability Skill"
version: "1.0.0"
description: "Quy chuẩn tối ưu hiệu năng (Performance) cho Frontend và Backend để chịu tải cao."
---

# ⚡ Performance & Scalability Skill

**Layer:** 3 - Capability Skills  
**Status:** Active  
**Risk Level:** Medium

## 1. Purpose
Tối ưu hóa thời gian tải trang (LCP, TTI), giảm băng thông, và thiết kế Backend để không bị nghẽn (bottleneck) khi lượng truy cập tăng vọt.

## 2. Triggers
- Task yêu cầu tối ưu hệ thống: `slow`, `optimize`, `speed`, `lazy load`, `cache`.

## 3. Rules & Execution

### Frontend Performance
1. **Memoization:** Cẩn trọng khi dùng `useMemo`, `useCallback`. Chỉ dùng khi có tính toán nặng hoặc truyền props vào component con có `React.memo`.
2. **Lazy Loading:** Code splitting các thư viện nặng (Chart, Editor) và route component bằng `React.lazy` (hoặc next/dynamic).
3. **Image Optimization:** Sử dụng các thành phần hình ảnh tối ưu (Next/Image) thay vì thẻ `<img>` thô, thêm thuộc tính `loading="lazy"`.

### Backend Performance & Caching
1. **Database Indexing:** Nếu một cột thường xuyên được truy vấn (vd: `email`, `tenant_id`), đề xuất thêm Index.
2. **Caching Strategy:** Sử dụng Redis hoặc HTTP Caching cho các dữ liệu ít thay đổi nhưng đọc nhiều (Ví dụ: Danh sách sản phẩm của cửa hàng).
3. **N+1 Query:** Đã được quy định cấm tại `Data Lifecycle Skill`.

## 4. Anti-Patterns
- ❌ Tối ưu sớm (Premature Optimization) khi chưa có dấu hiệu hoặc đo lường tắc nghẽn, làm code trở nên quá phức tạp không cần thiết.
