# UI/UX RULES SYSTEM

Quy tắc được chia thành các mức độ:
- **[BLOCKER]**: Vi phạm sẽ khiến implementation không được phép hoàn thành. Bắt buộc sửa.
- **[MUST]**: Bắt buộc tuân thủ. Chỉ được ngoại lệ khi có lý do kỹ thuật rõ ràng và phải ghi chú (Ngoại lệ).
- **[SHOULD]**: Khuyến nghị mạnh. Nếu không thực hiện phải giải thích lý do.
- **[MAY]**: Tùy chọn, sử dụng khi phù hợp ngữ cảnh.

---

## A. PRODUCT CONTEXT VÀ USER INTENT
- **[BLOCKER]** Phải xác định rõ user intent, luồng trước/sau, trạng thái thành công/thất bại trước khi thiết kế/code.
- **[MUST]** Liệt kê các hành động (chính, phụ, nguy hiểm) dựa trên role của người dùng.
- **[MUST]** Khảo sát giới hạn kỹ thuật (màn hình nhỏ, input bàn phím) trước khi định hình bố cục.

## B. INFORMATION ARCHITECTURE
- **[BLOCKER]** Không được thiết kế màn hình mà người dùng không thể biết cách quay lại hoặc thoát luồng.
- **[MUST]** Phân cấp thông tin rõ ràng: Nhóm chức năng, Breadcrumb/Tabs nếu cần.
- **[MUST]** Cung cấp empty state cho mọi vùng hiển thị dữ liệu động (danh sách, bảng).
- **[SHOULD]** Bảo toàn trạng thái (filter, pagination, form data) khi quay lại trang.

## C. VISUAL HIERARCHY
- **[BLOCKER]** Màn hình chỉ được phép có DUY NHẤT một Primary Action nổi bật nhất.
- **[MUST]** Sử dụng hệ thống spacing hiện hành để nhóm nội dung, không dùng khoảng cách ngẫu nhiên.
- **[MUST]** Nút nguy hiểm (Destructive) phải khác biệt trực quan nhưng không được nổi bật hơn Primary Action trừ trường hợp cảnh báo khẩn.

## D. DESIGN SYSTEM VÀ DESIGN TOKEN
- **[BLOCKER]** Bắt buộc sử dụng design token hiện có (Tailwind colors, spacing, typography). KHÔNG hard-code màu sắc tĩnh (`#xxxxxx`, `rgba`).
- **[BLOCKER]** Không sao chép toàn bộ một component dùng chung chỉ để thay đổi một chi tiết nhỏ. Dùng composition hoặc props.
- **[MUST]** Không đưa business logic đặc thù vào primitive component (Button, Input).

## E. RESPONSIVE VÀ ADAPTIVE DESIGN
- **[BLOCKER]** Mọi giao diện phải sử dụng tốt trên Mobile, Tablet và Desktop.
- **[MUST]** Không được coi responsive chỉ là thu nhỏ tỷ lệ. Phải thiết kế layout stack (chồng lên nhau) trên mobile.
- **[MUST]** Bảng nhiều cột trên mobile bắt buộc phải có horizontal scroll hoặc chuyển sang dạng Card mode.
- **[MUST]** Action quan trọng trên mobile (VD: "Mua hàng", "Lưu") nên dùng sticky button hoặc hiển thị rõ trong viewport ban đầu.

## F. ACCESSIBILITY
- **[BLOCKER]** Mọi nút bấm (`<button>`, thẻ `<a>`) phải có Accessible Name (text hoặc `aria-label`).
- **[BLOCKER]** Focus phải hiển thị rõ ràng khi điều hướng bằng bàn phím. Cấm xóa outline mà không có style focus thay thế.
- **[MUST]** Không dùng thẻ `<div>` gán `onClick` để thay thế cho `<button>` hoặc `<a>` nếu không có keyboard behavior tương ứng.
- **[MUST]** Đảm bảo độ tương phản (Color Contrast) ở mức WCAG AA (đặc biệt văn bản và nút).
- **[MUST]** Báo lỗi form phải có text, KHÔNG chỉ dùng mỗi viền màu đỏ để cảnh báo lỗi.

## G. FORM UX
- **[BLOCKER]** Lỗi form phải hiển thị rõ ràng tại đúng trường gây lỗi.
- **[BLOCKER]** Không xóa toàn bộ dữ liệu người dùng đã nhập khi submit thất bại.
- **[MUST]** Form destructive (Xóa/Hủy) phải có cơ chế confirmation (Xác nhận).
- **[SHOULD]** Tự động focus vào trường lỗi đầu tiên khi submit thất bại.

## H. TABLE, LIST VÀ DATA-DENSE UI
- **[BLOCKER]** Dataset lớn phải có cơ chế phân trang (Pagination), Load more, hoặc Virtualization.
- **[MUST]** Table phải xử lý các trạng thái: Đang tải (Skeleton/Loading), Rỗng (Empty State), Lỗi (Error State).
- **[MUST]** Header bảng phải sticky nếu dữ liệu kéo dài nhiều trang màn hình.

## I. FEEDBACK VÀ SYSTEM STATES
- **[BLOCKER]** Giao diện gọi API luôn phải có Loading State (disable nút submit + hiển thị spinner/skeleton).
- **[MUST]** Định nghĩa rõ Not Found state, Offline state, Permission Denied state.
- **[SHOULD]** Áp dụng Optimistic UI cho các thao tác phản hồi nhanh (như like, đánh dấu yêu thích).

## J. INTERACTION DESIGN
- **[BLOCKER]** Mọi Element có thể tương tác (button, link, card) phải có hiệu ứng Hover, Active/Focus và Disabled.
- **[MUST]** Trạng thái Disabled phải giảm Opacity hoặc đổi màu để người dùng nhận biết rõ ràng.
- **[SHOULD]** Animation (chuyển động) chỉ dùng để hướng dẫn chú ý hoặc giữ mạch ngữ cảnh, không dùng để trang trí rườm rà gây chậm trang.

## K. NAVIGATION UX
- **[BLOCKER]** Không hiển thị các Navigation link mà người dùng hoàn toàn không có quyền truy cập dựa trên role.
- **[MUST]** Người dùng phải luôn nhận biết mình đang ở trang nào (Active state trên menu/breadcrumb).

## L. PERFORMANCE UX
- **[BLOCKER]** Không render danh sách tĩnh dài hàng ngàn phần tử trên DOM mà không dùng virtualization hoặc pagination.
- **[MUST]** Không gọi lại API trùng lặp trong cùng một lần render tree. Tận dụng caching.
- **[MUST]** Hạn chế tối đa Layout Shift lớn khi dữ liệu được tải xong (Sử dụng Skeleton đúng kích thước).

## M. CONTENT DESIGN VÀ MICROCOPY
- **[BLOCKER]** Lời báo lỗi không được mơ hồ (VD: "Có lỗi xảy ra"). Phải giải thích lý do hoặc hướng khắc phục.
- **[MUST]** Nhãn (Label) của nút bấm phải mô tả đúng hành động (VD: "Xóa tài khoản" thay vì "Đồng ý").
- **[MUST]** Cấm dùng thuật ngữ code backend trực tiếp cho end-user (VD: "Null pointer", "500 Internal").

## N. SECURITY VÀ PRIVACY TRONG UI
- **[BLOCKER]** Frontend UI không tự quyết định quyền bảo mật bằng cách chỉ "ẩn" nút bấm. Dữ liệu nhạy cảm không được gửi từ Backend nếu User không có quyền.
- **[MUST]** Thao tác nguy hiểm ảnh hưởng đến hệ thống/tài chính phải có bước Confirmation.

## O. ROLE-BASED UI
- **[BLOCKER]** Không được copy toàn bộ Page code thành bản sao riêng biệt chỉ vì role khác nhau một chút logic. Phải dùng composition và Permission checks (VD: `<IfRole role="ADMIN">...`).

## P. TESTING VÀ VALIDATION
- **[BLOCKER]** Hoàn thành code UI phải test hiển thị nội dung dài (tên cực dài, text tràn).
- **[MUST]** Test trường hợp submit liên tục (double click) xem có bị duplicate request không.
