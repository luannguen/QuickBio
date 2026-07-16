# UI/UX AUDIT REPORT & REMEDIATION BACKLOG

Dựa trên quá trình khảo sát codebase dự án `kiem tien online`.

## TỔNG QUAN PHÁT HIỆN
1. **Thiếu Hệ Sinh Thái UI Primitive (Core Components)**:
   - Các components cơ bản (Button, Input, Card, Modal base) chưa được chuẩn hóa hoặc thiếu sót thư mục dùng chung (`src/components/ui/`).
   - Giao diện đang được tạo tự do bằng Tailwind HTML classes, dẫn đến rủi ro nhân bản code và bất nhất thiết kế.
2. **Quản lý Responsive Cứng Nhắc**:
   - Tồn tại các file chia layout cụ thể như `AdminDashboardDesktop.tsx` và `AdminDashboardMobile.tsx`. Mặc dù tách biệt code đôi khi giúp tối ưu, nhưng nếu dùng không khéo sẽ dẫn đến lặp lại Logic. Cần cân nhắc Responsive Composition bên trong component thay vì chia file theo Viewport nếu logic quá giống nhau.
3. **Design Tokens Còn Hạn Chế**:
   - `tailwind.config.js` hiện chỉ định nghĩa một số ít màu `brand: { orange, coral, dark, card, light, green }`.
   - Các màu trạng thái (Error, Warning, Success, Info), màu Border, màu Muted chưa được chuẩn hóa vào hệ thống Token.
4. **Hệ thống Instruction Thiếu Sót**:
   - Dự án thiếu folder `components/instruction` hoặc các skill document tập trung. Đã bổ sung theo hệ thống chuẩn.

## REMEDIATION BACKLOG (Khuyến nghị sửa chữa - Không bắt buộc làm ngay)
- [ ] **Khởi tạo Core UI Library**: Cài đặt hoặc xây dựng bộ base UI (shadcn/ui hoặc tương đương) cho Button, Input, Dialog, Select để loại bỏ hardcode HTML.
- [ ] **Mở rộng Design Tokens**: Cập nhật `tailwind.config.js` thêm các màu semantic như `semantic-success`, `semantic-error`, `semantic-warning` và typography scale chuẩn.
- [ ] **Refactor Layout Strategy**: Kiểm tra xem các cặp file `*Desktop.tsx`/`*Mobile.tsx` có lặp lại state logic hay không. Nếu có, cần chuyển sang dùng custom hook quản lý chung state cho cả 2 view.
- [ ] **Audit Accessibility Mở Rộng**: Quét toàn bộ component hiện tại xem đã có cấu trúc ARIA và keyboard support hay chưa.
- [ ] **Audit States**: Rà soát các luồng Checkout, Landing, Bio Builder để đảm bảo Loading State, Empty State, Error Boundaries đã được cover toàn diện.

Báo cáo này nên được coi là tài liệu định hướng để áp dụng dần trong các chu kỳ refactoring tương lai.
