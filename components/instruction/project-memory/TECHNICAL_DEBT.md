# 🚨 Nợ Kỹ Thuật & Khắc Phục (Technical Debt & Remediation)

Đây là nơi lưu trữ danh sách các lỗi đã biết (Known Issues), các giải pháp tạm thời (Workarounds) đang áp dụng, và kế hoạch refactor. Agent **phải** đọc file này khi gặp bug khó hiểu để xem nó có phải là Nợ Kỹ Thuật chưa xử lý không.

---

## 1. Known Issues (Lỗi Đã Biết Nhưng Chưa Fix Hoàn Toàn)

### [DEBT-001] Supabase Dynamic Import Warning
- **Mô tả:** Trình Vite build báo cảnh báo (warning): `Dynamic import of "supabase-js" may not be analyzable...` do cách thư viện nội bộ xử lý import.
- **Trạng thái hiện tại:** Đã verify chức năng hoạt động bình thường, không gây lỗi runtime.
- **Workaround đang dùng:** Tạm thời ignore cảnh báo này trong lúc build, hoặc để yên do không ảnh hưởng production build.
- **Kế hoạch tương lai:** Theo dõi cập nhật từ `@supabase/supabase-js` để xem có cách xử lý tĩnh tốt hơn.

---

## 2. Remediation Backlog (Danh sách cần tối ưu)

| ID | Vấn đề | Tác động (High/Med/Low) | Ghi chú / Hướng giải quyết |
|----|--------|--------------------------|----------------------------|
| RM-001 | Tối ưu hóa render LandingPageView | Low | Nên lazy-load các section cuộn trang phía dưới nếu trang phình to. |
| RM-002 | Store Hooks Dependencies | Med | Cần review lại `src/shared/hooks/store.ts` nếu thêm nhiều module phức tạp. |

*(Thêm vào bảng này bất cứ khi nào bạn phát hiện code mùi (code smell) hoặc cần tối ưu nhưng chưa có thời gian làm ngay trong task hiện tại).*
