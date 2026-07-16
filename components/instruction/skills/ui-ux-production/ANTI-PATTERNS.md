# ANTI-PATTERNS (Những điều nghiêm cấm)

Dưới đây là các anti-pattern phá vỡ kiến trúc UI/UX và chất lượng dự án. Việc mắc phải các lỗi này được coi là vi phạm **[BLOCKER]** và phải bị refactor ngay lập tức.

## HÀNH VI CODE VÀ TỔ CHỨC
1. **MVP Mindset cho Production**: Code giao diện hời hợt kiểu demo, hardcode data trong khi yêu cầu là mức Production.
2. **Reinvent the Wheel**: Tự tạo ra Component Button, Modal, Card mới tinh thay vì tìm kiếm và tái sử dụng Shared Component hiện có của dự án.
3. **Copy-Paste Engineering**: Sao chép toàn bộ một component hay một trang rồi đổi một vài biến để phục vụ Role/Feature khác mà không đánh giá khả năng reuse qua Props hoặc Composition.
4. **Hard-code Styles**: Dùng màu sắc cứng (`#333`, `rgb(20,20,20)`), khoảng cách cứng `mt-[17px]` thay vì dùng Design Tokens (e.g. `bg-brand-dark`, `mt-4`).
5. **Dependency Hoarding**: Cài thêm thư viện UI/Animation ngoài (`moment`, thư viện toast mới, thư viện form mới) khi dự án đã có sẵn giải pháp tương đương.

## TRẢI NGHIỆM NGƯỜI DÙNG (UX)
6. **Happy Path Only**: Chỉ thiết kế và code cho luồng hoạt động lý tưởng. Bỏ quên hoàn toàn Loading State, Error State, và Empty State.
7. **Mobile Ignorance**: Bỏ quên Mobile. Bảng data tràn màn hình, nút bấm nhỏ khó ấn, layout bị nén lại thay vì chuyển sang dạng stack.
8. **Toast Abuse**: Dùng Toast để chứa thông báo lỗi cực kỳ dài hoặc thông tin quan trọng cần người dùng thao tác tiếp (Nên dùng Modal hoặc Inline Alert).
9. **Modal Inception (Nested Modals)**: Mở Modal chồng lên Modal liên tục gây rối luồng điều hướng (Trừ trường hợp bắt buộc cực kỳ đặc biệt).
10. **Amnesia Form**: Xóa sạch mọi dữ liệu người dùng đã điền cất công trong form chỉ vì gọi API thất bại.
11. **Double Submit Disasters**: Quên khóa nút (disable) khi đang submit, dẫn đến User bấm 5 lần tạo ra 5 bản ghi trong Database.

## ACCESSIBILITY VÀ FEEDBACK
12. **Div-Button**: Dùng `<div onClick={...}>` để làm nút bấm nhưng quên không cung cấp thẻ `tabIndex`, role="button" và các xử lý sự kiện bàn phím.
13. **Silent Failure**: Submit lỗi, API báo 400 nhưng UI không hiện thông báo gì hoặc chỉ đổi trạng thái không rõ ràng.
14. **Color-only Indicators**: Dùng MÀU SẮC là cách DUY NHẤT để cảnh báo. Ví dụ: Field lỗi chỉ hiện viền đỏ (người mù màu sẽ không thấy). Phải có cả Text báo lỗi.
15. **Mystery Icons**: Dùng các icon trừu tượng mà không có tooltip, label hoặc text đi kèm giải thích ý nghĩa.

## KIẾN TRÚC UI
16. **Giant Monolithic Components**: Nhồi nhét hàng nghìn dòng code JSX, Fetch API, Business Logic, Validation vào chung 1 file thay vì chia tách MVC/Container-Presenter.
17. **Z-Index Wars**: Dùng `z-[9999]` ngẫu nhiên ở khắp nơi để sửa lỗi đè layer dẫn tới hỗn loạn xếp lớp UI.
18. **CSS Override Hell**: Viết code CSS/Tailwind chồng chéo bằng `!important` để sửa giao diện cục bộ thay vì tìm hiểu tại sao Component gốc bị sai.
19. **Security by Hiding**: Cố gắng đảm bảo an toàn hệ thống chỉ bằng việc dùng `display: none` hoặc ẩn UI (không render) thay vì kết hợp xử lý cả ở Backend permission.
20. **Visual over Quality**: Đánh giá hoàn thành task vì "nhìn UI giống hệt design mẫu" nhưng lại hoàn toàn phớt lờ việc code rối, hiệu năng kém, Responsive gãy và Accessibility bằng 0.
