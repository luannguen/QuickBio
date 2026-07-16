# UI/UX CHECKLIST

Agent bắt buộc sử dụng Checklist này cho mỗi task UI/UX. Đánh dấu [x] (hoặc tự xác nhận trong Output Report) sau khi đã kiểm tra.

## PRE-IMPLEMENTATION (Trước khi viết code)
- [ ] **Context Mapped**: Đã xác định User Intent và Business Goal của luồng màn hình hiện tại.
- [ ] **Pattern Reuse**: Đã khảo sát codebase để tìm UI Component có sẵn (Form, Table, Card, Layout).
- [ ] **Token Check**: Đã hiểu rõ hệ thống Tailwind Config, Color Palette và Typography hiện tại.
- [ ] **State Matrix**: Đã vạch ra cách xử lý (Loading, Empty, Error, Success) cho màn hình này.
- [ ] **Responsive Plan**: Đã xác định giao diện trên Mobile sẽ stack hoặc ẩn những khối nào.
- [ ] **UX Decision Summary**: Đã tổng hợp các quyết định UX và Options phân tích (ghi vào report/console).

## POST-IMPLEMENTATION (Sau khi viết code)

### 1. Functional & States
- [ ] Các hành động CRUD đều có phản hồi (Toast, thay đổi trạng thái UI).
- [ ] Nút Submit đã được Disable khi API đang gọi.
- [ ] Hiển thị thông báo khi không có dữ liệu (Empty State).
- [ ] Báo lỗi chi tiết khi Form invalid, giữ lại dữ liệu user đã nhập.
- [ ] State lỗi do API được hiển thị qua UI thân thiện (Không in raw error code).

### 2. Responsive & Layout
- [ ] Test Mobile viewport (320px - 480px): Chữ không bị tràn, Layout stack đúng, Table scroll ngang được.
- [ ] Không có element nào bị vỡ do chuỗi ký tự không có dấu cách (áp dụng break-words nếu cần).
- [ ] Các element như Modal, Drawer chiếm tỷ lệ màn hình hợp lý trên Mobile.

### 3. Accessibility (A11y)
- [ ] Tất cả Interactive elements (button, a, input) đều focus được qua phím Tab.
- [ ] Trạng thái Focus được hiển thị rõ (outline/ring).
- [ ] Icon button (không có text) đều có `aria-label` hoặc `<span class="sr-only">`.
- [ ] Contrast màu giữa chữ và nền đảm bảo đọc rõ (không dùng xám nhạt trên trắng nhạt).

### 4. Code Quality & Performance
- [ ] Không có file component nào trở nên quá khổng lồ (> 300 dòng), đã tách nhỏ hợp lý.
- [ ] Không dùng class utility Tailwind hard-code màu khi màu đó có trong Design Token.
- [ ] Đã tháo bỏ các Mock Data, TODO tạm bợ khỏi luồng code chính.
- [ ] Tái sử dụng (Composition) thay vì Duplicate code cho các view có cùng layout.

### 5. Role & Security
- [ ] Các Action nhạy cảm chỉ hiển thị khi User thỏa mãn quyền (Role-based).
- [ ] Hành động Xóa/Chuyển tiền... có popup xác nhận.
