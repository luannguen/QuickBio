# 🌌 A.A.P v3.0 - UI/UX DESIGN RULESET & COMPONENT PATTERNS

> **MỤC TIÊU CỐT LÕI:** Mọi giao diện sinh ra phải "chỉn chu" đến từng pixel, mượt mà trên từng interaction. Trải nghiệm người dùng (UX) phải liền mạch, thiết kế (UI) phải thống nhất toàn dự án. Không code tuỳ tiện, mọi thành phần giao diện phải được quy nạp thành Pattern để tái sử dụng.

## 1. Triết Lý Thiết Kế (Design Philosophy)
- **MOBILE-FIRST (Tuyệt đối):** Giao diện phải được code cho Mobile (kích thước nhỏ) trước tiên. Sau đó dùng các utility breakpoint (`sm:`, `md:`, `lg:`) để scale lên Desktop.
- **TOUCH-OPTIMIZED:** Mọi khu vực có thể tương tác (Nút, Link, Menu Item, Checkbox) phải có vùng chạm tối thiểu **44px x 44px**. Không thiết kế icon/nút bấm quá bé khiến user khó chạm trên mobile.
- **CHỈN CHU & CHÍNH XÁC:** Tránh text tràn viền, text lệch (misaligned). Luôn dùng `flex items-center` để căn giữa icon và chữ. Khoảng cách (padding/margin) phải tuân thủ token của Design System (ví dụ dùng `gap-2`, `gap-4` thay vì pixel tự do).
- **FEEDBACK:** Mọi tương tác click/hover đều phải có phản hồi ngay lập tức (đổi màu, shadow, scale). 

## 2. UI/UX Component Patterns (Mẫu thiết kế tái sử dụng)
Khi AI code giao diện mới, phải tự động phân loại xem tính năng đó thuộc dạng tương tác nào để áp dụng Pattern chuẩn xác:

### Pattern A: Modal vs Bottom Sheet (Khung thoại)
- **Trên Mobile (`max-md:`)**: TUYỆT ĐỐI KHÔNG dùng Center Modal (Modal nằm giữa màn hình). Phải đổi thành **Bottom Sheet** (Vuốt từ dưới lên).
  - Trải nghiệm vuốt: Phải có thanh gạt nhỏ (`w-12 h-1.5 bg-border rounded-full mx-auto my-2`) ở đỉnh Bottom Sheet.
  - Vị trí: Dính sát mép dưới (`mt-auto`, `items-end`). Bo tròn góc trên (`rounded-t-3xl`).
- **Trên Desktop (`md:`)**: Chuyển Bottom Sheet thành **Center Modal** truyền thống (Nằm chính giữa màn hình, bo tròn 4 góc `rounded-2xl`).

### Pattern B: Right Panel / Drawer (Menu hoặc Form phức tạp)
- Dành cho các Form nhập liệu dài (như Tạo Sản phẩm, Chỉnh sửa thông tin) hoặc Navigation Menu lớn.
- Khác với Bottom Sheet (chỉ hiển thị thông báo hoặc hành động ngắn), Drawer trượt từ cạnh phải (`slide-in-from-right`) trên Desktop hoặc chiếm toàn màn hình trên Mobile.

### Pattern C: Floating Action Button (FAB) & Sticky Action Bar
- **Bên trong Bottom Sheet hoặc Trang nội dung dài:** Thanh chứa nút Action (Lưu, Xác nhận, Thanh toán) trên Mobile PHẢI luôn dính ở dưới cùng (Sticky bottom: `sticky bottom-0 bg-background/80 backdrop-blur-xl p-4 border-t border-border z-10`).
- Không bắt user cuộn xuống tận cùng màn hình dài dằng dặc mới bấm được chữ "Lưu".

### Pattern D: Micro-Animations & Skeletons
- Skeleton Loading là bắt buộc cho các vùng dữ liệu bất đồng bộ. Khối Skeleton phải match chính xác hình dạng của thẻ thật (Ví dụ thẻ User có hình tròn, skeleton cũng phải là hình tròn).
- Thêm thuộc tính `transition-all duration-300 active:scale-95` vào 100% các nút bấm (`button`).
- Thêm `animate-in fade-in zoom-in-95 duration-200` vào các thẻ hiển thị bất ngờ (Popups, Tooltips).

## 3. Hệ Thống Kiến Trúc Z-Index (Z-Index Architecture)
Để không gây ra lỗi Box này đè Box kia:
- `z-0` tới `z-30`: Nội dung chính, Background elements, Card.
- `z-40`: Header cố định (Sticky Nav), Floating Action Button cục bộ.
- `z-50`: Bottom Tab Bar Navigation trên Mobile.
- `z-[60]` tới `z-[90]`: Dark Overlay (Nền tối mờ), Modals, Bottom Sheets, Right Drawers.
- `z-[100]`: Notifications, Toasts, Cảnh báo (Alerts).

## 4. Trách Nhiệm Của AI Khi Viết UI Code
- **Nhận diện:** Đọc yêu cầu UI -> Quy chiếu vào các Pattern ở trên. (VD: "User bảo làm form thêm bài viết" -> Áp dụng Pattern Right Panel trên Desktop, Fullscreen trên Mobile + Sticky Action Bar).
- **Đóng gói:** Xây dựng code dưới dạng các Component độc lập trong `src/shared/ui/` nếu có khả năng tái sử dụng cao.
- **Tối ưu PWA:** Nhớ rằng đây là PWA app giống Native. Hạn chế tối đa thanh cuộn dư thừa (overflow x). Dùng `overscroll-none` nếu cần khoá cuộn màn hình khi mở Modal.
